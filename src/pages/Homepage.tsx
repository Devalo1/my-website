import React from 'react';
import { Button, Typography, Space, Card, Row, Col } from 'antd';
import { ShopOutlined, UserOutlined, DashboardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Homepage: React.FC = () => {
  return (
    <div style={{ padding: '50px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <Title>Lupul și Corbul</Title>
        <Paragraph style={{ fontSize: 18 }}>
          Cea mai bună selecție de prăjituri artizanale și suplimente naturale.
        </Paragraph>
        
        <Space size="large" style={{ margin: '30px 0' }}>
          <Link to="/login">
            <Button type="primary" icon={<UserOutlined />} size="large">
              Autentificare
            </Button>
          </Link>
          <Link to="/register">
            <Button icon={<UserOutlined />} size="large">
              Înregistrare
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button icon={<DashboardOutlined />} size="large">
              Dashboard
            </Button>
          </Link>
        </Space>
        
        <Row gutter={[24, 24]} style={{ marginTop: 50 }}>
          <Col xs={24} md={8}>
            <Card 
              title="Prăjituri Artizanale" 
              hoverable
              cover={<img alt="Prăjituri" src="https://via.placeholder.com/300x200?text=Prajituri" />}
            >
              <Paragraph>
                Descoperă selecția noastră de prăjituri artizanale preparate cu ingrediente naturale și rețete tradiționale.
              </Paragraph>
              <Button type="primary" icon={<ShopOutlined />}>
                Comandă acum
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              title="Suplimente Naturale" 
              hoverable
              cover={<img alt="Suplimente" src="https://via.placeholder.com/300x200?text=Suplimente" />}
            >
              <Paragraph>
                Îmbunătățește-ți sănătatea cu gama noastră de suplimente naturale de cea mai înaltă calitate.
              </Paragraph>
              <Button type="primary" icon={<ShopOutlined />}>
                Descoperă
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              title="Pachete Personalizate" 
              hoverable
              cover={<img alt="Pachete" src="https://via.placeholder.com/300x200?text=Pachete" />}
            >
              <Paragraph>
                Creează-ți propriul pachet personalizat, perfectat după preferințele tale.
              </Paragraph>
              <Button type="primary" icon={<ShopOutlined />}>
                Personalizează
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Homepage;
