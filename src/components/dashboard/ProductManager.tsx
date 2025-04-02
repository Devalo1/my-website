import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Space, Modal, Form, Input, InputNumber, 
  Select, Upload, message, Popconfirm, Image, Tooltip, Typography,
  Divider, Tag
} from 'antd';
import { 
  PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, FilterOutlined, ReloadOutlined
} from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import { Product, ProductFilters } from '../../types';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

// Categorii de produse
const PRODUCT_CATEGORIES = [
  'Prăjituri', 'Torturi', 'Suplimente', 'Boabe', 'Pachete', 'Altele'
];

interface ProductManagerProps {
  isAdmin: boolean;
}

const ProductManager: React.FC<ProductManagerProps> = ({ isAdmin }) => {
  // Form pentru adăugare/editare produs
  const [form] = Form.useForm();
  
  // State pentru filtre produse
  const [filters, setFilters] = useState<ProductFilters>({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
    searchTerm: ''
  });
  
  // State pentru modal și mod editare
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  
  // State pentru upload imagine
  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // State pentru filtre avansate
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Folosim hook-ul de produse
  const { products, loading, error, loadMore, hasMore, refresh } = useProducts(filters);

  // Handler pentru deschiderea modalului în mod adăugare
  const showAddModal = () => {
    setEditMode(false);
    setCurrentProductId(null);
    setImageFile(null);
    setImagePreview(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Handler pentru deschiderea modalului în mod editare
  const showEditModal = (product: Product) => {
    setEditMode(true);
    setCurrentProductId(product.id);
    setImagePreview(product.imageUrl);
    setImageFile(null);
    
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      ingredients: product.ingredients ? product.ingredients.join('\n') : ''
    });
    
    setModalVisible(true);
  };

  // Handler pentru închiderea modalului
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Handler pentru upload-ul de imagine
  const handleImageUpload = (file: RcFile) => {
    // Validare tip fișier
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Puteți încărca doar fișiere JPG/PNG!');
      return Upload.LIST_IGNORE;
    }
    
    // Validare dimensiune fișier (max 2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Imaginea trebuie să fie sub 2MB!');
      return Upload.LIST_IGNORE;
    }
    
    // Setăm starea pentru preview și fișier
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setImageFile(file);
    
    // Blocăm upload-ul automat
    return false;
  };

  // Handler pentru submit form
  const handleSubmit = async (values: any) => {
    try {
      // Validăm dacă avem imagine în mod adăugare
      if (!editMode && !imageFile) {
        message.error('Vă rugăm să încărcați o imagine pentru produs!');
        return;
      }
      
      // Pregătim obiectul produs
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        category: values.category,
        ingredients: values.ingredients ? values.ingredients.split('\n').filter(Boolean) : []
      };
      
      if (editMode && currentProductId) {
        // Editare produs existent
        await productService.updateProduct(currentProductId, productData, imageFile || undefined);
        message.success('Produsul a fost actualizat cu succes!');
      } else {
        // Adăugare produs nou
        if (!imageFile) {
          message.error('Imaginea este obligatorie pentru produsele noi');
          return;
        }
        
        await productService.addProduct(productData as any, imageFile);
        message.success('Produsul a fost adăugat cu succes!');
      }
      
      // Resetăm formularul și starea
      form.resetFields();
      setModalVisible(false);
      setImageFile(null);
      setImagePreview(null);
      
      // Reîmprospătăm lista de produse
      refresh();
    } catch (error) {
      console.error('Eroare la salvarea produsului:', error);
      message.error(`Eroare: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
    }
  };

  // Handler pentru ștergerea produsului
  const handleDeleteProduct = async (productId: string) => {
    try {
      await productService.deleteProduct(productId);
      message.success('Produsul a fost șters cu succes!');
      refresh();
    } catch (error) {
      console.error('Eroare la ștergerea produsului:', error);
      message.error(`Eroare: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
    }
  };

  // Handler pentru filtrare
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Coloane tabel
  const columns = [
    {
      title: 'Imagine',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => (
        <Image 
          src={imageUrl} 
          alt="Produs" 
          width={50} 
          height={50} 
          style={{ objectFit: 'cover' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        />
      )
    },
    {
      title: 'Nume Produs',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Categorie',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Preț',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <Text>{price.toFixed(2)} RON</Text>
    },
    {
      title: 'Stoc',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => {
        let color = 'green';
        if (stock <= 0) {
          color = 'red';
        } else if (stock < 10) {
          color = 'orange';
        }
        return <Tag color={color}>{stock}</Tag>;
      }
    },
    {
      title: 'Acțiuni',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space>
          <Tooltip title="Editează">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)}
              disabled={!isAdmin}
            />
          </Tooltip>
          
          <Tooltip title="Șterge">
            <Popconfirm
              title="Sigur doriți să ștergeți acest produs?"
              onConfirm={() => handleDeleteProduct(record.id)}
              okText="Da"
              cancelText="Nu"
              disabled={!isAdmin}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                disabled={!isAdmin}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card 
        title="Produse" 
        extra={
          <Space>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              Filtre
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refresh}
            >
              Reîmprospătează
            </Button>
            {isAdmin && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={showAddModal}
              >
                Adaugă produs
              </Button>
            )}
          </Space>
        }
      >
        {/* Filtrele avansate */}
        {filtersVisible && (
          <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
            <Space wrap>
              <Select
                style={{ width: 200 }}
                placeholder="Categorie"
                allowClear
                onChange={(value) => handleFilterChange('category', value)}
              >
                {PRODUCT_CATEGORIES.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
              
              <InputNumber
                style={{ width: 120 }}
                placeholder="Preț minim"
                min={0}
                onChange={(value) => handleFilterChange('minPrice', value)}
              />
              
              <InputNumber
                style={{ width: 120 }}
                placeholder="Preț maxim"
                min={0}
                onChange={(value) => handleFilterChange('maxPrice', value)}
              />
              
              <Select
                style={{ width: 150 }}
                placeholder="În stoc"
                allowClear
                onChange={(value) => handleFilterChange('inStock', value)}
              >
                <Option value={true}>Doar în stoc</Option>
                <Option value={false}>Toate produsele</Option>
              </Select>
              
              <Input 
                placeholder="Caută produs..." 
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </Space>
          </div>
        )}
        
        {/* Tabel produse */}
        <Table 
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{ 
            emptyText: error ? 
              `Eroare: ${error.message}` : 
              'Nu există produse care să corespundă filtrelor selectate'
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
      
      {/* Modal adăugare/editare produs */}
      <Modal
        title={editMode ? 'Editare produs' : 'Adăugare produs nou'}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nume produs"
            rules={[{ required: true, message: 'Introduceți numele produsului!' }]}
          >
            <Input placeholder="Nume produs" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Descriere"
            rules={[{ required: true, message: 'Introduceți descrierea produsului!' }]}
          >
            <TextArea placeholder="Descriere produs" rows={4} />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Categorie"
            rules={[{ required: true, message: 'Selectați categoria!' }]}
          >
            <Select placeholder="Selectați categoria">
              {PRODUCT_CATEGORIES.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Space style={{ display: 'flex', marginBottom: 16 }} align="start">
            <Form.Item
              name="price"
              label="Preț (RON)"
              rules={[{ required: true, message: 'Introduceți prețul!' }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber 
                min={0}
                step={0.01}
                precision={2}
                style={{ width: 150 }}
              />
            </Form.Item>
            
            <Form.Item
              name="stock"
              label="Stoc"
              rules={[{ required: true, message: 'Introduceți stocul!' }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber 
                min={0}
                style={{ width: 150 }}
              />
            </Form.Item>
          </Space>
          
          <Form.Item
            name="ingredients"
            label="Ingrediente (câte unul pe linie)"
          >
            <TextArea placeholder="Ingrediente" rows={4} />
          </Form.Item>
          
          <Form.Item label="Imagine produs">
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={handleImageUpload}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Produs" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Încarcă</div>
                  </div>
                )}
              </Upload>
              {imagePreview && (
                <Button 
                  style={{ marginLeft: 16 }}
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                >
                  Elimină imaginea
                </Button>
              )}
            </div>
            <Text type="secondary">
              Acceptă fișiere JPG/PNG de până la 2MB
              {!editMode && !imagePreview && <Text type="danger"> (obligatoriu pentru produse noi)</Text>}
            </Text>
          </Form.Item>
          
          <Divider />
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Anulează</Button>
              <Button type="primary" htmlType="submit">
                {editMode ? 'Actualizează' : 'Adaugă'} produs
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
