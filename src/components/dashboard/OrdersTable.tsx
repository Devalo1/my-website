import React, { useState } from 'react';
import { 
  Table, Tag, Button, Space, Dropdown, Menu, Card, DatePicker, 
  Select, Input, Badge, Typography, Drawer, Descriptions, Divider
} from 'antd';
import { DownOutlined, ReloadOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useOrders } from '../../hooks/useOrders';
import { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/orderService';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;

// Mapare culori pentru status comenzi
const statusColors = {
  'pending': 'orange',
  'processing': 'blue',
  'shipped': 'purple',
  'delivered': 'green',
  'cancelled': 'red'
};

// Traduceri status comenzi pentru afișare
const statusLabels: Record<OrderStatus, string> = {
  'pending': 'În așteptare',
  'processing': 'În procesare',
  'shipped': 'Expediat',
  'delivered': 'Livrat',
  'cancelled': 'Anulat'
};

interface OrdersTableProps {
  isAdmin?: boolean;
  userId?: string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ isAdmin = false, userId }) => {
  // State pentru filtre
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State pentru drawer de detalii comandă
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // Folosim hook-ul de comenzi cu filtrele setate
  const { orders, loading, error, loadMore, hasMore, refresh } = useOrders({
    status,
    userId: isAdmin ? undefined : userId,
    startDate: dateRange ? dateRange[0].toDate() : undefined,
    endDate: dateRange ? dateRange[1].toDate() : undefined,
    searchTerm
  });

  // Handler pentru actualizarea statusului
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Nu este nevoie să actualizăm manual datele, deoarece hook-ul useOrders
      // folosește onSnapshot pentru a asculta schimbările în timp real
    } catch (error) {
      console.error('Eroare la actualizarea statusului:', error);
      // Aici ar trebui adăugată o notificare de eroare
    }
  };

  // Handler pentru anularea comenzii
  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Sigur doriți să anulați această comandă?')) {
      try {
        await orderService.cancelOrder(orderId);
      } catch (error) {
        console.error('Eroare la anularea comenzii:', error);
        // Aici ar trebui adăugată o notificare de eroare
      }
    }
  };

  // Meniu dropdown pentru acțiuni pe comandă
  const actionsMenu = (record: Order) => (
    <Menu>
      <Menu.Item key="view" onClick={() => {
        setSelectedOrder(record);
        setDrawerVisible(true);
      }}>
        <EyeOutlined /> Vezi detalii
      </Menu.Item>
      
      {isAdmin && record.status !== 'cancelled' && record.status !== 'delivered' && (
        <>
          <Menu.Divider />
          <Menu.SubMenu key="status" title="Schimbă status">
            {Object.entries(statusLabels).map(([key, label]) => (
              <Menu.Item 
                key={key} 
                disabled={record.status === key}
                onClick={() => handleStatusChange(record.id, key as OrderStatus)}
              >
                {label}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        </>
      )}
      
      {(isAdmin || record.status === 'pending') && record.status !== 'cancelled' && (
        <Menu.Item key="cancel" danger onClick={() => handleCancelOrder(record.id)}>
          Anulează comanda
        </Menu.Item>
      )}
    </Menu>
  );

  // Definirea coloanelor tabelului
  const columns = [
    {
      title: 'ID Comandă',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text copyable>{id.substring(0, 8)}...</Text>
    },
    {
      title: 'Client',
      dataIndex: 'userEmail',
      key: 'userEmail',
      render: (email: string, record: Order) => (
        <div>
          <div>{record.userName || 'N/A'}</div>
          <Text type="secondary">{email}</Text>
        </div>
      )
    },
    {
      title: 'Produse',
      dataIndex: 'items',
      key: 'items',
      render: (items: Order['items']) => (
        <Badge count={items.length} showZero>
          <Text>{items.length} produse</Text>
        </Badge>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <Text strong>{total.toFixed(2)} RON</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]} key={status}>
          {statusLabels[status]}
        </Tag>
      )
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) => moment(createdAt.toDate()).format('DD-MM-YYYY HH:mm')
    },
    {
      title: 'Acțiuni',
      key: 'actions',
      render: (text: string, record: Order) => (
        <Dropdown overlay={actionsMenu(record)}>
          <Button>
            Acțiuni <DownOutlined />
          </Button>
        </Dropdown>
      )
    }
  ];

  // Funcție pentru randarea drawer-ului cu detalii
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;

    return (
      <Drawer
        title={`Detalii Comandă #${selectedOrder.id.substring(0, 8)}`}
        width={600}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Status">
            <Tag color={statusColors[selectedOrder.status]}>
              {statusLabels[selectedOrder.status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Client">
            {selectedOrder.userName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{selectedOrder.userEmail}</Descriptions.Item>
          <Descriptions.Item label="Data comandă">
            {moment(selectedOrder.createdAt.toDate()).format('DD-MM-YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            <Text strong>{selectedOrder.total.toFixed(2)} RON</Text>
          </Descriptions.Item>
          {selectedOrder.notes && (
            <Descriptions.Item label="Note">{selectedOrder.notes}</Descriptions.Item>
          )}
          {selectedOrder.shippingAddress && (
            <Descriptions.Item label="Adresă livrare">
              {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zip}, {selectedOrder.shippingAddress.country}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider orientation="left">Produse comandate</Divider>
        
        <Table 
          dataSource={selectedOrder.items}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Produs',
              dataIndex: 'productName',
              key: 'productName'
            },
            {
              title: 'Cantitate',
              dataIndex: 'qty',
              key: 'qty'
            },
            {
              title: 'Preț unitar',
              dataIndex: 'price',
              key: 'price',
              render: (price: number) => `${price.toFixed(2)} RON`
            },
            {
              title: 'Total',
              key: 'total',
              render: (_, record) => `${(record.price * record.qty).toFixed(2)} RON`
            }
          ]}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}><Text strong>Total comandă</Text></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text type="danger" strong>{selectedOrder.total.toFixed(2)} RON</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
        
        {isAdmin && selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
          <>
            <Divider orientation="left">Acțiuni</Divider>
            <Space>
              <Select 
                style={{ width: 200 }}
                placeholder="Schimbă status"
                value={selectedOrder.status}
                onChange={(value: OrderStatus) => handleStatusChange(selectedOrder.id, value)}
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <Option key={key} value={key} disabled={selectedOrder.status === key}>
                    {label}
                  </Option>
                ))}
              </Select>
              
              <Button 
                danger 
                onClick={() => handleCancelOrder(selectedOrder.id)}
                disabled={selectedOrder.status === 'cancelled'}
              >
                Anulează comanda
              </Button>
            </Space>
          </>
        )}
      </Drawer>
    );
  };

  return (
    <div>
      <Card title="Comenzi" extra={<Button icon={<ReloadOutlined />} onClick={refresh}>Reîmprospătează</Button>}>
        {/* Filtre */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Select 
            placeholder="Status"
            allowClear
            style={{ width: 130 }}
            onChange={(value: OrderStatus | undefined) => setStatus(value)}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <Option key={key} value={key}>{label}</Option>
            ))}
          </Select>
          
          <RangePicker 
            placeholder={['Data început', 'Data sfârșit']}
            onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
          />
          
          <Input 
            placeholder="Caută după id, client..." 
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
        </Space>
        
        {/* Tabel comenzi */}
        <Table 
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{ 
            emptyText: error ? 
              `Eroare: ${error.message}` : 
              'Nu există comenzi care să corespundă filtrelor selectate'
          }}
        />
        
        {/* Buton încarcă mai multe */}
        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button 
              onClick={loadMore} 
              loading={loading}
              disabled={!hasMore}
            >
              Încarcă mai multe
            </Button>
          </div>
        )}
      </Card>
      
      {/* Drawer detalii comandă */}
      {renderOrderDetail()}
    </div>
  );
};

export default OrdersTable;
