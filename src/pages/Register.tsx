import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    try {
      setLoading(true);
      
      // Creare utilizator în Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      // Actualizare profil cu numele complet
      await updateProfile(user, {
        displayName: values.name
      });
      
      // Creare document utilizator în Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: values.name,
        photoURL: null,
        role: 'client', // Rol implicit
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now()
      });
      
      message.success('Înregistrare reușită! Bine ai venit!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Eroare la înregistrare:', error);
      
      let errorMessage = 'Eroare la înregistrare. Încercați din nou.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Există deja un cont cu această adresă de email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Parola este prea slabă. Folosiți minim 6 caractere.';
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>Lupul și Corbul</Title>
          <Text type="secondary">Creează un cont nou</Text>
        </div>
        
        <Form
          name="register"
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Introduceți numele complet!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nume complet" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Introduceți adresa de email!' },
              { type: 'email', message: 'Introduceți o adresă de email validă!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Introduceți parola!' },
              { min: 6, message: 'Parola trebuie să aibă minim 6 caractere!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Parolă" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirmați parola!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Parolele nu coincid!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirmă parola" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              size="large"
            >
              Înregistrare
            </Button>
          </Form.Item>
        </Form>
        
        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Ai deja un cont? <Link to="/login">Autentifică-te aici!</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;
