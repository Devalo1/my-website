import React, { useState, useEffect } from 'react';
import { 
  Card, Avatar, Typography, Tabs, Form, Input, Button, 
  Descriptions, Upload, message, Divider, Badge 
} from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, 
  HomeOutlined, UploadOutlined 
} from '@ant-design/icons';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { User } from '../../types';
import OrdersTable from './OrdersTable';
import { RcFile } from 'antd/lib/upload';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<RcFile | null>(null);
  
  // Încărcăm datele utilizatorului
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        setUser({
          ...userData,
          uid: userSnap.id
        });
        
        // Setăm valorile inițiale în formular
        form.setFieldsValue({
          displayName: userData.displayName,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          country: userData.country || ''
        });
        
        // Setăm URL-ul avatarului
        setAvatarUrl(userData.photoURL || null);
      } else {
        setError('Utilizatorul nu a fost găsit.');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Eroare la încărcarea datelor utilizatorului:', err);
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
      setLoading(false);
    }
  };
  
  // Încărcăm datele la prima randare
  useEffect(() => {
    loadUserData();
  }, [userId]);
  
  // Handler pentru actualizarea profilului
  const handleUpdateProfile = async (values: any) => {
    try {
      setLoading(true);
      
      // Pregătim datele actualizate
      const updateData: Record<string, any> = {
        displayName: values.displayName,
        phone: values.phone,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
        updatedAt: Timestamp.now()
      };
      
      // Dacă avem un avatar nou, îl încărcăm
      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`);
        await uploadBytes(storageRef, avatarFile);
        const downloadURL = await getDownloadURL(storageRef);
        updateData.photoURL = downloadURL;
        setAvatarUrl(downloadURL);
      }
      
      // Actualizăm utilizatorul în Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updateData);
      
      // Actualizăm starea locală
      setUser(prev => prev ? { ...prev, ...updateData } : null);
      
      message.success('Profilul a fost actualizat cu succes!');
      setLoading(false);
    } catch (err) {
      console.error('Eroare la actualizarea profilului:', err);
      message.error('Eroare la actualizarea profilului: ' + (err instanceof Error ? err.message : 'Eroare necunoscută'));
      setLoading(false);
    }
  };
  
  // Handler pentru upload avatar
  const handleAvatarChange = (info: any) => {
    if (info.file) {
      // Verificăm tipul și dimensiunea fișierului
      const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Puteți încărca doar fișiere JPG/PNG!');
        return;
      }
      
      const isLt2M = info.file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Imaginea trebuie să fie sub 2MB!');
        return;
      }
      
      // Creăm un URL temporar pentru preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(info.file);
      
      // Salvăm fișierul pentru încărcare ulterioară
      setAvatarFile(info.file);
    }
  };
  
  // Randare condițională
  if (loading) {
    return (
      <Card loading={true} style={{ minHeight: 500 }} />
    );
  }
  
  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Text type="danger">{error}</Text>
          <Button type="primary" onClick={loadUserData} style={{ marginTop: 16 }}>
            Reîncearcă
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <div>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Upload
            name="avatar"
            listType="picture-circle"
            showUploadList={false}
            beforeUpload={(file) => {
              handleAvatarChange({ file });
              return false; // Prevenim încărcarea automată
            }}
          >
            {avatarUrl ? (
              <Avatar
                src={avatarUrl}
                size={100}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{ cursor: 'pointer' }}
              />
            )}
          </Upload>
          
          <div style={{ marginLeft: 16 }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              {user?.displayName || 'Utilizator'}
            </Title>
            <Text type="secondary" style={{ display: 'block' }}>
              <MailOutlined style={{ marginRight: 8 }} />
              {user?.email}
            </Text>
            {user?.role && (
              <Badge 
                color={user.role === 'admin' ? 'red' : 'blue'} 
                text={user.role === 'admin' ? 'Administrator' : 'Client'} 
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        </div>
        
        <Divider />
        
        <Tabs defaultActiveKey="profile">
          <TabPane tab="Profil" key="profile">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                name="displayName"
                label="Nume complet"
                rules={[{ required: true, message: 'Vă rugăm introduceți numele complet' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nume complet" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: 'email', message: 'Email invalid' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" disabled />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="Telefon"
              >
                <Input prefix={<PhoneOutlined />} placeholder="Telefon" />
              </Form.Item>
              
              <Form.Item
                name="address"
                label="Adresă"
              >
                <Input prefix={<HomeOutlined />} placeholder="Adresă" />
              </Form.Item>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <Form.Item
                  name="city"
                  label="Oraș"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="Oraș" />
                </Form.Item>
                
                <Form.Item
                  name="postalCode"
                  label="Cod poștal"
                  style={{ flex: 0.5 }}
                >
                  <Input placeholder="Cod poștal" />
                </Form.Item>
              </div>
              
              <Form.Item
                name="country"
                label="Țară"
              >
                <Input placeholder="Țară" />
              </Form.Item>
              
              <Form.Item style={{ textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                >
                  Actualizează profil
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Comenzile mele" key="orders">
            <OrdersTable userId={userId} isAdmin={user?.role === 'admin'} />
          </TabPane>
          
          <TabPane tab="Informații cont" key="account">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID Utilizator">
                <Text copyable>{userId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Adresă email">
                {user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Rol">
                {user?.role === 'admin' ? 'Administrator' : 'Client'}
              </Descriptions.Item>
              <Descriptions.Item label="Data înregistrării">
                {user?.createdAt ? 
                  new Date(user.createdAt.seconds * 1000).toLocaleString() : 
                  'Necunoscut'}
              </Descriptions.Item>
              {user?.lastLogin && (
                <Descriptions.Item label="Ultima autentificare">
                  {new Date(user.lastLogin.seconds * 1000).toLocaleString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile;
