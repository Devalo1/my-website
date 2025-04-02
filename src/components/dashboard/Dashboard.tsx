import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Button, Avatar, Dropdown, message } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Link, Routes, Route } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { User } from '../../types';
import OrdersTable from './OrdersTable';
import ProductManager from './ProductManager';
import AnalyticsCharts from './AnalyticsCharts';
import UserProfile from './UserProfile';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Încărcăm datele utilizatorului
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        // Încercăm să obținem datele complete ale utilizatorului din Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data() as User;
          setUser({
            ...userData,
            uid: userSnap.id
          });
        } else {
          // Dacă utilizatorul nu există în Firestore, folosim datele de bază din Auth
          setUser({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || '',
            photoURL: currentUser.photoURL || '',
            role: 'client', // Rol implicit
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } // Data curentă
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Eroare la încărcarea datelor utilizatorului:', error);
        message.error('Eroare la încărcarea datelor: ' + (error instanceof Error ? error.message : 'Eroare necunoscută'));
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Handler pentru deconectare
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Eroare la deconectare:', error);
      message.error('Eroare la deconectare: ' + (error instanceof Error ? error.message : 'Eroare necunoscută'));
    }
  };
  
  // Meniu dropdown pentru utilizator
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/dashboard/profile">Profilul meu</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Deconectare
      </Menu.Item>
    </Menu>
  );
  
  // Determinăm calea activă
  const getActiveKey = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/products')) return 'products';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };
  
  // Dacă se încarcă, afișăm un ecran de încărcare
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        fontSize: '24px',
        flexDirection: 'column'
      }}>
        <div className="spinner" style={{ marginBottom: 16 }}></div>
        <div>Se încarcă panoul de control...</div>
      </div>
    );
  }
  
  // Dacă utilizatorul nu este autentificat, redirecționăm
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const isAdmin = user.role === 'admin';
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        zeroWidthTriggerStyle={{ top: 12 }}
        trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      >
        <div className="logo" style={{ 
          height: '64px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          margin: '16px 0',
          color: 'white',
          fontSize: collapsed ? '24px' : '20px',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'L&C' : 'Lupul și Corbul'}
        </div>
        
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={[getActiveKey()]}
          selectedKeys={[getActiveKey()]}
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            <Link to="/dashboard/orders">Comenzi</Link>
          </Menu.Item>
          
          <Menu.Item key="products" icon={<ShoppingOutlined />}>
            <Link to="/dashboard/products">Produse</Link>
          </Menu.Item>
          
          {isAdmin && (
            <Menu.Item key="analytics" icon={<BarChartOutlined />}>
              <Link to="/dashboard/analytics">Analiză</Link>
            </Menu.Item>
          )}
          
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <Link to="/dashboard/profile">Profil</Link>
          </Menu.Item>
          
          {isAdmin && (
            <SubMenu key="admin" icon={<SettingOutlined />} title="Admin">
              <Menu.Item key="users">Utilizatori</Menu.Item>
              <Menu.Item key="settings">Setări</Menu.Item>
            </SubMenu>
          )}
        </Menu>
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>{getActiveKey().charAt(0).toUpperCase() + getActiveKey().slice(1)}</Breadcrumb.Item>
          </Breadcrumb>
          
          <div>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={user.photoURL} 
                  icon={!user.photoURL && <UserOutlined />}
                />
                <span style={{ marginLeft: 8 }}>{user.displayName || user.email}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Routes>
              <Route path="/" element={
                <div>
                  <h1>Bine ai venit la panoul de control, {user.displayName || 'utilizator'}!</h1>
                  <p>Selectează o opțiune din meniul lateral pentru a gestiona comenzile, produsele sau profilul tău.</p>
                </div>
              } />
              <Route path="/orders" element={<OrdersTable isAdmin={isAdmin} userId={!isAdmin ? user.uid : undefined} />} />
              <Route path="/products" element={<ProductManager isAdmin={isAdmin} />} />
              {isAdmin && <Route path="/analytics" element={<AnalyticsCharts isAdmin={isAdmin} />} />}
              <Route path="/profile" element={<UserProfile userId={user.uid} />} />
            </Routes>
          </div>
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          Lupul și Corbul Admin Panel ©{new Date().getFullYear()} Creat cu React + Firebase
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
