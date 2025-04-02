import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Spin, Empty, Alert } from 'antd';
import { Line, Bar, Pie } from '@ant-design/charts';
import { FireOutlined, ShoppingOutlined, SyncOutlined } from '@ant-design/icons';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order, Product, SalesData, ProductStockData } from '../../types';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface AnalyticsChartsProps {
  isAdmin: boolean;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ isAdmin }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [stockData, setStockData] = useState<ProductStockData[]>([]);
  const [categoryData, setCategoryData] = useState<{ type: string; value: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State pentru filtre
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(30, 'days'), 
    moment()
  ]);
  const [analyticType, setAnalyticType] = useState<'sales' | 'products'>('sales');
  
  // Încărcăm datele analitice
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (analyticType === 'sales') {
        // Interogare pentru date vânzări
        const startDate = Timestamp.fromDate(dateRange[0].toDate());
        const endDate = Timestamp.fromDate(dateRange[1].toDate());
        
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('createdAt', '>=', startDate),
          where('createdAt', '<=', endDate),
          where('status', '!=', 'cancelled')
        );
        
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt
          } as Order;
        });
        
        // Grupăm vânzările după dată
        const salesByDate = orders.reduce((acc: Record<string, number>, order) => {
          const date = moment(order.createdAt.toDate()).format('YYYY-MM-DD');
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += order.total;
          return acc;
        }, {});
        
        // Creăm un array pentru fiecare zi din intervalul selectat
        const days = [];
        const currDate = moment(dateRange[0]);
        const lastDate = moment(dateRange[1]);
        while (currDate.diff(lastDate) <= 0) {
          const dateKey = currDate.format('YYYY-MM-DD');
          days.push({
            date: dateKey,
            sales: salesByDate[dateKey] || 0
          });
          currDate.add(1, 'days');
        }
        
        setSalesData(days);
        
        // Calculăm vânzările pe categorii pentru graficul pie
        const orderProducts = orders.flatMap(order => order.items);
        const categorySales: Record<string, number> = {};
        
        for (const item of orderProducts) {
          // Aici ar trebui să facem o interogare pentru a obține categoria produsului
          // Dar pentru simplificare, vom folosi un placeholder
          const category = 'Categorie'; // Aceasta ar trebui înlocuită cu categoria reală
          if (!categorySales[category]) {
            categorySales[category] = 0;
          }
          categorySales[category] += item.price * item.qty;
        }
        
        const categoryDataArray = Object.entries(categorySales).map(([type, value]) => ({
          type,
          value
        }));
        
        setCategoryData(categoryDataArray);
      } else {
        // Interogare pentru date stoc produse
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        const products = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          } as Product;
        });
        
        // Sortăm produsele după stoc
        const topProducts = [...products]
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 10)
          .map(product => ({
            productName: product.name,
            stock: product.stock
          }));
        
        setStockData(topProducts);
        
        // Calculăm produsele pe categorii pentru graficul pie
        const categoryProducts: Record<string, number> = {};
        
        for (const product of products) {
          if (!categoryProducts[product.category]) {
            categoryProducts[product.category] = 0;
          }
          categoryProducts[product.category]++;
        }
        
        const categoryDataArray = Object.entries(categoryProducts).map(([type, value]) => ({
          type,
          value
        }));
        
        setCategoryData(categoryDataArray);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Eroare la încărcarea datelor analitice:', err);
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
      setLoading(false);
    }
  };
  
  // Încărcăm datele la prima randare și când se schimbă filtrele
  useEffect(() => {
    loadAnalyticsData();
  }, [analyticType]); // Nu includem dateRange aici pentru a evita multiple reîncărcări automate
  
  // Configurare grafic pentru vânzări
  const salesConfig = {
    data: salesData,
    xField: 'date',
    yField: 'sales',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth: true,
  };
  
  // Configurare grafic pentru stoc
  const stockConfig = {
    data: stockData,
    xField: 'stock',
    yField: 'productName',
    seriesField: 'productName',
    legend: {
      position: 'top',
    },
  };
  
  // Configurare grafic pie pentru categorii
  const pieConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  
  // Render conditional pentru grafice
  const renderCharts = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Se încarcă datele analitice...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert
          message="Eroare la încărcarea datelor"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      );
    }
    
    if ((analyticType === 'sales' && salesData.length === 0) || 
        (analyticType === 'products' && stockData.length === 0)) {
      return (
        <Empty
          description="Nu există date pentru intervalul selectat"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }
    
    return (
      <Row gutter={[16, 16]}>
        <Col span={24} lg={16}>
          <Card title={analyticType === 'sales' ? 'Vânzări în timp' : 'Top produse după stoc'}>
            {analyticType === 'sales' ? (
              <Line {...salesConfig} />
            ) : (
              <Bar {...stockConfig} />
            )}
          </Card>
        </Col>
        
        <Col span={24} lg={8}>
          <Card title={analyticType === 'sales' ? 'Vânzări pe categorii' : 'Produse pe categorii'}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
        
        {analyticType === 'sales' && (
          <Col span={24}>
            <Card title="Statistici generale">
              <Row gutter={16}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Total vânzări"
                      value={salesData.reduce((sum, item) => sum + item.sales, 0)}
                      precision={2}
                      suffix="RON"
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Medie zilnică"
                      value={salesData.length > 0 ? 
                        salesData.reduce((sum, item) => sum + item.sales, 0) / salesData.length : 0}
                      precision={2}
                      suffix="RON"
                      prefix={<FireOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Zile analizate"
                      value={salesData.length}
                      prefix={<SyncOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    );
  };
  
  return (
    <div>
      <Card 
        title="Analiză și Statistici" 
        extra={
          <Space>
            <Select
              style={{ width: 150 }}
              value={analyticType}
              onChange={setAnalyticType}
            >
              <Option value="sales">Vânzări</Option>
              <Option value="products">Produse</Option>
            </Select>
            
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
            />
            
            <Button 
              type="primary" 
              icon={<SyncOutlined />} 
              onClick={loadAnalyticsData}
            >
              Actualizează
            </Button>
          </Space>
        }
      >
        {renderCharts()}
      </Card>
    </div>
  );
};

// Importăm Statistic aici pentru că l-am folosit în corp
import { Space, Statistic } from 'antd';

export default AnalyticsCharts;
