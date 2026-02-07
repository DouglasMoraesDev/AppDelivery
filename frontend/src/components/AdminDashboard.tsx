import React, { useState, useEffect } from 'react';
import { 
  Settings, Store, Palette, MapPin, Image, Save, LogOut, 
  Package, ShoppingBag, Users, TrendingUp, Edit2, Trash2, 
  Plus, X, Upload, Eye, Clock, CheckCircle, XCircle, FileText 
} from 'lucide-react';
import ProductModal from './ProductModal';
import ReportsTab from './ReportsTab';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  available: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Config {
  businessName: string;
  phone: string;
  whatsappNumber: string;
  logo?: string;
  banner?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  bgColor: string;
  zipCode?: string;
  street?: string;
  number?: string;
  district?: string;
  city: string;
  state: string;
  isOpen: boolean;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  type: 'DELIVERY' | 'PICKUP';
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  deliveryAddress?: {
    street: string;
    number: string;
    district: string;
    city: string;
  };
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'config' | 'reports'>('overview');
  const [config, setConfig] = useState<Config | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<'all' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // Reports
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reportData, setReportData] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    // Verificar se está em modo demo
    const isDemoMode = localStorage.getItem('adminToken')?.includes('demo-token');
    
    if (isDemoMode) {
      // Carregar dados de demonstração
      setConfig({
        businessName: 'Gemini Burger Demo',
        phone: '(11) 99999-9999',
        whatsappNumber: '5511999999999',
        primaryColor: '#ea580c',
        secondaryColor: '#dc2626',
        accentColor: '#f59e0b',
        textColor: '#ffffff',
        bgColor: '#18181b',
        city: 'São Paulo',
        state: 'SP',
        isOpen: true,
      });
      
      setCategories([
        { id: '1', name: 'Hambúrgueres', slug: 'burgers' },
        { id: '2', name: 'Acompanhamentos', slug: 'sides' },
        { id: '3', name: 'Bebidas', slug: 'drinks' },
        { id: '4', name: 'Sobremesas', slug: 'desserts' },
        { id: '5', name: 'Combos', slug: 'combos' },
        { id: '6', name: 'Bebidas Alcoólicas', slug: 'alcohol' },
      ]);
      
      // Produtos de demonstração - usando os produtos originais do constants/index.ts
      const mockProducts: Product[] = [
        // COMBOS
        {
          id: 'c1',
          name: 'Combo Individual Prime',
          description: '1 Gemini Prime + 1 Batata Rústica Individual + 1 Refrigerante Lata.',
          price: 58.00,
          categoryId: '5',
          available: true,
          image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'c2',
          name: 'Combo Casal Smash',
          description: '2 Super Flash Smash + 1 Batata Rústica Grande + 2 Refrigerantes Lata.',
          price: 89.90,
          categoryId: '5',
          available: true,
          image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'c3',
          name: 'Combo Família Monster',
          description: '4 Burgers (2 Prime, 2 Smash) + 2 Porções de Batata + 1 Coca-Cola 2L.',
          price: 159.00,
          categoryId: '5',
          available: true,
          image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800'
        },
        // BURGERS
        {
          id: 'b1',
          name: 'Gemini Prime',
          description: 'Blend bovino 180g, queijo cheddar artesanal, cebola caramelizada e maionese trufada no pão brioche.',
          price: 38.90,
          categoryId: '1',
          available: true,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'b6',
          name: 'Truffle Gorgonzola',
          description: 'Hambúrguer 180g, creme de gorgonzola premium, mel trufado e rúcula fresca.',
          price: 45.00,
          categoryId: '1',
          available: true,
          image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'b7',
          name: 'Monster Double Stack',
          description: 'Dois burgers de 180g, quatro fatias de cheddar, bacon duplo e pão australiano.',
          price: 52.00,
          categoryId: '1',
          available: true,
          image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'b2',
          name: 'Super Flash Smash',
          description: 'Dois burgers smash 90g, double cheddar, picles da casa e molho especial.',
          price: 29.90,
          categoryId: '1',
          available: true,
          image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800'
        },
        // SIDES
        {
          id: 's1',
          name: 'Batata Rústica Grande',
          description: 'Batatas com casca temperadas com alecrim, páprica e sal grosso. Acompanha maionese verde.',
          price: 22.00,
          categoryId: '2',
          available: true,
          image: 'https://png.pngtree.com/png-vector/20250813/ourlarge/pngtree-golden-brown-rustic-potato-wedges-served-with-spices-on-vivid-orange-png-image_16719846.png'
        },
        {
          id: 's4',
          name: 'Batata com Cheddar e Bacon',
          description: 'Nossa batata rústica coberta com muito molho cheddar e farofa de bacon.',
          price: 28.00,
          categoryId: '2',
          available: true,
          image: '/batata-com-cheddar.png'
        },
        // DRINKS
        {
          id: 'd3',
          name: 'Coca-Cola 350ml',
          description: 'Lata gelada.',
          price: 7.00,
          categoryId: '3',
          available: true,
          image: '/02.png'
        },
        {
          id: 'd6',
          name: 'Água Mineral c/ Gás',
          description: 'Garrafa 500ml gelada com rodelas de limão.',
          price: 5.00,
          categoryId: '3',
          available: true,
          image: '/agua.jpg'
        },
        // ALCOHOLIC DRINKS
        {
          id: 'a1',
          name: 'Chopp IPA Artesanal',
          description: 'Copo de 500ml. Cerveja encorpada com notas cítricas e amargor marcante.',
          price: 24.00,
          categoryId: '6',
          available: true,
          image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'a2',
          name: 'Gin Tônica Clássica',
          description: 'Gin premium, tônica, zimbro e uma rodela de limão siciliano.',
          price: 28.00,
          categoryId: '6',
          available: true,
          image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'a3',
          name: 'Heineken Long Neck',
          description: 'Cerveja Premium Lager 330ml gelada.',
          price: 12.00,
          categoryId: '6',
          available: true,
          image: '/heineken.png'
        },
        {
          id: 'a4',
          name: 'Caipirinha de Morango',
          description: 'Morangos frescos, açúcar e cachaça premium ou vodka.',
          price: 22.00,
          categoryId: '6',
          available: true,
          image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800'
        },
        // DESSERTS
        {
          id: 'e1',
          name: 'Milkshake Nutella',
          description: 'Sorvete de baunilha, muita Nutella e chantilly artesanal.',
          price: 24.00,
          categoryId: '4',
          available: true,
          image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800'
        }
      ];
      // Forçar atualização IMEDIATA dos produtos - sempre sobrescrever localStorage
      console.log('📦 Atualizando produtos no localStorage...', mockProducts.length, 'produtos');
      localStorage.setItem('demoProducts', JSON.stringify(mockProducts));
      localStorage.setItem('productsVersion', '3.0'); // Incrementar versão para forçar reload
      setProducts(mockProducts);
      
      // Disparar evento para App.tsx detectar
      window.dispatchEvent(new Event('storage'));
      
      setStats({
        totalOrders: 150,
        totalRevenue: 12500.00,
        pendingOrders: 5,
        totalProducts: mockProducts.length,
      });
      
      // Dados de pedidos para demonstração
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: '#001',
          customerName: 'João Silva',
          phone: '(11) 98765-4321',
          total: 89.90,
          status: 'PENDING',
          type: 'DELIVERY',
          paymentMethod: 'PIX',
          createdAt: new Date().toISOString(),
          items: [
            { id: '1', productName: 'Gemini Prime', quantity: 2, price: 38.90, subtotal: 77.80 },
            { id: '2', productName: 'Batata Rústica', quantity: 1, price: 12.10, subtotal: 12.10 }
          ],
          deliveryAddress: {
            street: 'Rua das Flores',
            number: '123',
            district: 'Centro',
            city: 'São Paulo'
          }
        },
        {
          id: '2',
          orderNumber: '#002',
          customerName: 'Maria Santos',
          phone: '(11) 91234-5678',
          total: 159.00,
          status: 'CONFIRMED',
          type: 'DELIVERY',
          paymentMethod: 'CREDIT_CARD',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          items: [
            { id: '1', productName: 'Combo Família Monster', quantity: 1, price: 159.00, subtotal: 159.00 }
          ],
          deliveryAddress: {
            street: 'Av. Paulista',
            number: '1000',
            district: 'Bela Vista',
            city: 'São Paulo'
          }
        },
        {
          id: '3',
          orderNumber: '#003',
          customerName: 'Pedro Oliveira',
          phone: '(11) 99876-5432',
          total: 58.00,
          status: 'READY',
          type: 'PICKUP',
          paymentMethod: 'CASH',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          items: [
            { id: '1', productName: 'Combo Individual Prime', quantity: 1, price: 58.00, subtotal: 58.00 }
          ]
        }
      ];
      
      // Carregar pedidos reais do localStorage
      const savedOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]');
      
      // Se houver pedidos reais, usá-los; senão, usar mock
      const ordersToUse = savedOrders.length > 0 ? savedOrders : mockOrders;
      setOrders(ordersToUse);
      
      // Atualizar estatísticas com pedidos reais
      if (savedOrders.length > 0) {
        const totalRevenue = savedOrders.reduce((sum: number, order: any) => sum + order.total, 0);
        const pendingCount = savedOrders.filter((order: any) => order.status === 'pending').length;
        setStats({
          totalOrders: savedOrders.length,
          totalRevenue,
          pendingOrders: pendingCount,
          totalProducts: mockProducts.length,
        });
      }
      
      console.log('✅ Modo demonstração ativado - dados mockados carregados');
      
      // Listener para atualizar pedidos em tempo real
      const orderUpdateInterval = setInterval(() => {
        const currentOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]');
        if (currentOrders.length > 0) {
          setOrders(currentOrders);
          const totalRevenue = currentOrders.reduce((sum: number, order: any) => sum + order.total, 0);
          const pendingCount = currentOrders.filter((order: any) => order.status === 'pending').length;
          setStats((prev) => ({
            ...prev,
            totalOrders: currentOrders.length,
            totalRevenue,
            pendingOrders: pendingCount,
          }));
        }
      }, 3000); // Verifica a cada 3 segundos
      
      return () => clearInterval(orderUpdateInterval);
    } else {
      loadConfig();
      loadProducts();
      loadCategories();
      loadStats();
      loadOrders();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'reports') {
      const isDemoMode = localStorage.getItem('adminToken')?.includes('demo-token');
      if (isDemoMode) {
        // Gerar relatório de demonstração
        generateDemoReport(reportPeriod);
      } else {
        loadReport(reportPeriod);
      }
    }
  }, [activeTab, reportPeriod]);
  
  const generateDemoReport = (period: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    const daysCount = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
    
    const mockReport = {
      period,
      totalOrders: Math.floor(Math.random() * 50) + daysCount * 10,
      totalRevenue: Math.floor(Math.random() * 5000) + daysCount * 500,
      avgOrderValue: 85.50,
      topProducts: [
        { name: 'Gemini Prime', quantity: 45, revenue: 1750.50 },
        { name: 'Super Flash Smash', quantity: 38, revenue: 1136.20 },
        { name: 'Combo Família Monster', quantity: 25, revenue: 3975.00 },
      ],
      orders: orders.map((order, idx) => ({
        ...order,
        createdAt: new Date(now.getTime() - idx * 3600000 * 12).toISOString()
      })),
      paymentMethods: {
        PIX: 45,
        CREDIT_CARD: 30,
        DEBIT_CARD: 15,
        CASH: 10
      },
      deliveryTypes: {
        DELIVERY: 75,
        PICKUP: 25
      }
    };
    
    setReportData(mockReport);
  };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('⚠️ Não foi possível carregar configurações do servidor');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.warn('⚠️ Backend indisponível, usando modo demonstração');
    }
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível carregar produtos');
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível carregar categorias');
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          pendingOrders: data.pendingOrders || 0,
          totalProducts: products.length,
        });
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível carregar estatísticas');
    }
  };

  const loadReport = async (period: 'daily' | 'weekly' | 'monthly') => {
    setLoadingReport(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/analytics/detailed-report?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoadingReport(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Modo demonstração - salvar no localStorage
      if (token?.includes('demo-token')) {
        localStorage.setItem('demoConfig', JSON.stringify(config));
        console.log('✅ Configurações salvas no modo demo:', config);
        alert('Configurações salvas com sucesso!');
        setIsSaving(false);
        return;
      }
      
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        localStorage.setItem('demoConfig', JSON.stringify(config));
        alert('Configurações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (type: 'logo' | 'banner', file: File) => {
    // Simular upload - em produção, usar um serviço real
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setConfig(prev => prev ? { ...prev, [type]: imageUrl } : null);
    };
    reader.readAsDataURL(file);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Modo demonstração
      if (token?.includes('demo-token')) {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        localStorage.setItem('demoProducts', JSON.stringify(updatedProducts));
        console.log('✅ Produto excluído no modo demo');
        alert('Produto excluído com sucesso!');
        return;
      }
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Produto excluído com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto');
    }
  };

  const toggleProductAvailability = async (id: string, available: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Modo demonstração
      if (token?.includes('demo-token')) {
        const updatedProducts = products.map(p => 
          p.id === id ? { ...p, available: !available } : p
        );
        setProducts(updatedProducts);
        localStorage.setItem('demoProducts', JSON.stringify(updatedProducts));
        console.log('✅ Disponibilidade alterada no modo demo');
        return;
      }
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ available: !available }),
      });
      
      if (response.ok) {
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, available: !available } : p
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        loadStats();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
      PREPARING: 'bg-purple-100 text-purple-800 border-purple-300',
      READY: 'bg-orange-100 text-orange-800 border-orange-300',
      DELIVERED: 'bg-green-100 text-green-800 border-green-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      PREPARING: 'Preparando',
      READY: 'Pronto',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  };

  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === orderFilter);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{config.businessName}</h1>
                <p className="text-sm text-gray-500">Painel Administrativo</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'overview'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Visão Geral
              </div>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'orders'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Pedidos
              </div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'products'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produtos
              </div>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'config'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'reports'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Relatórios
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Pedidos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Faturamento</p>
                    <p className="text-3xl font-bold text-gray-900">
                      R$ {stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Produtos</p>
                    <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setShowProductModal(true);
                  }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Adicionar Produto</p>
                    <p className="text-sm opacity-90">Cadastrar novo item</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Ver Pedidos</p>
                    <p className="text-sm opacity-90">{stats.pendingOrders} pendentes</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition"
                >
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Relatórios</p>
                    <p className="text-sm opacity-90">Análises e vendas</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Produtos por Categoria */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos por Categoria</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map(cat => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  const available = products.filter(p => p.categoryId === cat.id && p.available).length;
                  return (
                    <div key={cat.id} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600">{cat.name}</p>
                      <p className="text-xs text-green-600 mt-1">{available} disponíveis</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pedidos Recentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Ver todos →
                </button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetails(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'PENDING' ? 'bg-yellow-100' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100' :
                        order.status === 'PREPARING' ? 'bg-purple-100' :
                        order.status === 'READY' ? 'bg-teal-100' :
                        order.status === 'DELIVERED' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {order.status === 'PENDING' ? <Clock className="w-5 h-5 text-yellow-600" /> :
                         order.status === 'DELIVERED' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                         <ShoppingBag className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber} - {order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.items.length} itens • {order.type === 'DELIVERY' ? '🚚 Entrega' : '🏃 Retirada'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R$ {order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>Nenhum pedido registrado ainda</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status do Sistema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Loja</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Modo de Operação</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      Demo
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Loja Aberta</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      config?.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {config?.isOpen ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Produtos Ativos</span>
                    <span className="font-bold text-gray-900">
                      {products.filter(p => p.available).length} / {products.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Ações</h3>
                <div className="space-y-2">
                  {stats.pendingOrders > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pedidos Pendentes</p>
                        <p className="text-xs text-gray-600">{stats.pendingOrders} pedidos aguardando confirmação</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gerenciar Estoque</p>
                      <p className="text-xs text-gray-600">Verifique disponibilidade dos produtos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Revisar Relatórios</p>
                      <p className="text-xs text-gray-600">Análise de vendas disponível</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Header e Filtros */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
                <p className="text-sm text-gray-600 mt-1">{filteredOrders.length} pedidos</p>
              </div>
              
              {/* Filtros */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    orderFilter === 'all'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setOrderFilter('PENDING')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    orderFilter === 'PENDING'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pendentes
                </button>
                <button
                  onClick={() => setOrderFilter('CONFIRMED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    orderFilter === 'CONFIRMED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Confirmados
                </button>
                <button
                  onClick={() => setOrderFilter('PREPARING')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    orderFilter === 'PREPARING'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Preparando
                </button>
                <button
                  onClick={() => setOrderFilter('DELIVERED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    orderFilter === 'DELIVERED'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Entregues
                </button>
              </div>
            </div>

            {/* Lista de Pedidos */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-600">
                  {orderFilter === 'all' 
                    ? 'Ainda não há pedidos no sistema.' 
                    : `Não há pedidos com status "${getStatusLabel(orderFilter as Order['status'])}".`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetails(true);
                    }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Informações do Pedido */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-gray-900">#{order.orderNumber}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                              {order.type === 'DELIVERY' ? '🚚 Delivery' : '🏪 Retirada'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Cliente:</span> {order.customerName}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Telefone:</span> {order.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Itens:</span> {order.items.length} produto(s)
                          </p>
                        </div>

                        {/* Valor e Data */}
                        <div className="flex md:flex-col items-end gap-2 md:gap-1">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-600">
                              R$ {Number(order.total).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ações Rápidas */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'CONFIRMED');
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                          >
                            ✓ Confirmar
                          </button>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'PREPARING');
                            }}
                            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
                          >
                            🍳 Preparar
                          </button>
                        )}
                        {order.status === 'PREPARING' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'READY');
                            }}
                            className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition"
                          >
                            ✓ Pronto
                          </button>
                        )}
                        {order.status === 'READY' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'DELIVERED');
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                          >
                            ✓ Entregar
                          </button>
                        )}
                        {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Tem certeza que deseja cancelar este pedido?')) {
                                updateOrderStatus(order.id, 'CANCELLED');
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                          >
                            ✕ Cancelar
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
                        >
                          👁️ Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductModal(true);
                }}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <Plus className="w-5 h-5" />
                Novo Produto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    {product.image ? (
                      <img 
                        src={product.image.startsWith('http') ? product.image : `/uploads/${product.image}`} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleProductAvailability(product.id, product.available)}
                        className={`p-2 rounded-lg ${
                          product.available ? 'bg-green-500' : 'bg-red-500'
                        } text-white`}
                      >
                        {product.available ? <Eye className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configurações do Estabelecimento</h2>

            {/* Informações Básicas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5" />
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Nome do Estabelecimento
                  </label>
                  <input
                    type="text"
                    value={config.businessName}
                    onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={config.phone}
                    onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={config.whatsappNumber}
                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Status
                  </label>
                  <button
                    onClick={() => setConfig({ ...config, isOpen: !config.isOpen })}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                      config.isOpen
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {config.isOpen ? 'Aberto' : 'Fechado'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cores e Visual */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Personalização Visual
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">✨ Personalização Ativa!</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  As cores abaixo serão <strong>aplicadas automaticamente</strong> no site do cliente. 
                  Experimente diferentes combinações e veja as mudanças em tempo real!
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-green-900 mb-2">🎨 Onde cada cor é aplicada:</h4>
                <ul className="text-sm text-green-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[120px]">Cor Primária:</span>
                    <span>Logo, botões principais, destaques, ícones, badge do carrinho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[120px]">Cor Secundária:</span>
                    <span>Preços dos produtos, títulos, elementos secundários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[120px]">Cor de Destaque:</span>
                    <span>Botões hover, efeitos especiais, animações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[120px]">Cor do Texto:</span>
                    <span>Campos de input quando o cliente digita (nome, endereço, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[120px]">Cor de Fundo:</span>
                    <span>Fundo dos campos de input e elementos de formulário</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">🎨 Preview das Cores Atuais</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-300"
                      style={{ backgroundColor: config.primaryColor }}
                    ></div>
                    <p className="text-xs font-medium text-gray-700">Cor Primária</p>
                    <p className="text-xs text-gray-500">{config.primaryColor}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-300"
                      style={{ backgroundColor: config.secondaryColor }}
                    ></div>
                    <p className="text-xs font-medium text-gray-700">Cor Secundária</p>
                    <p className="text-xs text-gray-500">{config.secondaryColor}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-300"
                      style={{ backgroundColor: config.accentColor }}
                    ></div>
                    <p className="text-xs font-medium text-gray-700">Cor de Destaque</p>
                    <p className="text-xs text-gray-500">{config.accentColor}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-300 flex items-center justify-center"
                      style={{ backgroundColor: config.bgColor }}
                    >
                      <span style={{ color: config.textColor }} className="text-sm font-bold">Aa</span>
                    </div>
                    <p className="text-xs font-medium text-gray-700">Texto em Fundo</p>
                    <p className="text-xs text-gray-500">{config.textColor} / {config.bgColor}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">🎨 Editar Cores</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cor Primária
                    </label>
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">{config.primaryColor}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cor Secundária
                    </label>
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">{config.secondaryColor}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cor de Destaque
                    </label>
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">{config.accentColor}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cor do Texto
                    </label>
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">{config.textColor}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cor de Fundo
                    </label>
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">{config.bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {config.logo && (
                      <img src={config.logo} alt="Logo" className="w-20 h-20 object-contain rounded-lg border border-gray-200" />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Carregar Logo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload('logo', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Banner
                  </label>
                  <div className="flex items-center gap-4">
                    {config.banner && (
                      <img src={config.banner} alt="Banner" className="w-32 h-20 object-cover rounded-lg border border-gray-200" />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Carregar Banner</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload('banner', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    CEP
                  </label>
                  <input
                    type="text"
                    value={config.zipCode || ''}
                    onChange={(e) => setConfig({ ...config, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Rua
                  </label>
                  <input
                    type="text"
                    value={config.street || ''}
                    onChange={(e) => setConfig({ ...config, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Número
                  </label>
                  <input
                    type="text"
                    value={config.number || ''}
                    onChange={(e) => setConfig({ ...config, number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={config.district || ''}
                    onChange={(e) => setConfig({ ...config, district: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={config.city}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827' }}>
                    Estado
                  </label>
                  <input
                    type="text"
                    value={config.state}
                    onChange={(e) => setConfig({ ...config, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <button
                onClick={saveConfig}
                disabled={isSaving}
                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={(product) => {
            // Modo demo - atualizar produtos localmente
            const isDemoMode = localStorage.getItem('adminToken')?.includes('demo-token');
            
            if (isDemoMode) {
              let updatedProducts;
              if (editingProduct) {
                // Editar produto existente
                updatedProducts = products.map(p => p.id === product.id ? product : p);
                console.log('✅ Produto editado no modo demo:', product);
              } else {
                // Adicionar novo produto
                updatedProducts = [...products, product];
                console.log('✅ Novo produto adicionado no modo demo:', product);
              }
              setProducts(updatedProducts);
              // Sincronizar com localStorage para o cliente ver as mudanças
              localStorage.setItem('demoProducts', JSON.stringify(updatedProducts));
              setShowProductModal(false);
              setEditingProduct(null);
            } else {
              // Modo real - recarregar da API
              if (editingProduct) {
                loadProducts();
              } else {
                loadProducts();
              }
            }
          }}
          product={editingProduct}
          categories={categories}
        />
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pedido #{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status e Ações */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Status do Pedido</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                
                {/* Ações de Status */}
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED' && (
                    <>
                      {selectedOrder.status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          ✓ Confirmar Pedido
                        </button>
                      )}
                      {selectedOrder.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'PREPARING')}
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                        >
                          🍳 Iniciar Preparo
                        </button>
                      )}
                      {selectedOrder.status === 'PREPARING' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'READY')}
                          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                        >
                          ✓ Marcar como Pronto
                        </button>
                      )}
                      {selectedOrder.status === 'READY' && (
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          ✓ Marcar como Entregue
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja cancelar este pedido?')) {
                            updateOrderStatus(selectedOrder.id, 'CANCELLED');
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        ✕ Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Informações do Cliente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações do Cliente</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nome:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Telefone:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.type === 'DELIVERY' ? '🚚 Delivery' : '🏪 Retirada no Local'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pagamento:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.paymentMethod === 'PIX' && '💳 PIX'}
                      {selectedOrder.paymentMethod === 'CREDIT_CARD' && '💳 Cartão de Crédito'}
                      {selectedOrder.paymentMethod === 'DEBIT_CARD' && '💳 Cartão de Débito'}
                      {selectedOrder.paymentMethod === 'CASH' && '💵 Dinheiro'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              {selectedOrder.type === 'DELIVERY' && selectedOrder.deliveryAddress && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Endereço de Entrega</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-900">
                      {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.number}
                    </p>
                    <p className="text-gray-600">
                      {selectedOrder.deliveryAddress.district} - {selectedOrder.deliveryAddress.city}
                    </p>
                  </div>
                </div>
              )}

              {/* Itens do Pedido */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x R$ {Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          R$ {Number(item.subtotal).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-orange-600">
                    R$ {Number(selectedOrder.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botão Fechar */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowOrderDetails(false);
                    setSelectedOrder(null);
                  }}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <ReportsTab
          period={reportPeriod}
          onPeriodChange={setReportPeriod}
          reportData={reportData}
          loading={loadingReport}
        />
      )}
    </div>
  );
}


