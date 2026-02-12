import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, MapPin, Phone, CreditCard, FileText, Truck } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
  product: {
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  type: 'DELIVERY' | 'PICKUP';
  deliveryAddress?: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    zipCode?: string;
    complement?: string;
    referencePoint?: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
  };
}

const statusConfig = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-500', icon: CheckCircle },
  PREPARING: { label: 'Em Preparo', color: 'bg-purple-500', icon: Package },
  READY: { label: 'Saiu para Entrega', color: 'bg-green-500', icon: Truck },
  DELIVERED: { label: 'Entregue', color: 'bg-green-600', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
};

const paymentMethodLabels: Record<string, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  CASH: 'Dinheiro',
};

export default function MeusPedidos() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearchOrders = async () => {
    if (!phone || phone.length < 10) {
      setError('Digite um telefone válido');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Remover caracteres não numéricos
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Pegar tenantSlug da URL ou usar padrão
      const tenantSlug = window.location.hostname === 'localhost' 
        ? 'default' // ou pegar do localStorage
        : window.location.hostname.split('.')[0];

      const response = await fetch(
        `/api/public/orders/by-phone/${cleanPhone}?tenantSlug=${tenantSlug}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }

      const data = await response.json();
      setOrders(data);
      
      // Salvar telefone no localStorage
      localStorage.setItem('customerPhone', cleanPhone);
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao buscar pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar pedidos automaticamente se telefone salvo
  useEffect(() => {
    const savedPhone = localStorage.getItem('customerPhone');
    if (savedPhone) {
      setPhone(savedPhone);
      // Auto-buscar após 500ms
      setTimeout(() => {
        handleSearchOrders();
      }, 500);
    }
  }, []);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const estimateDeliveryTime = (order: Order) => {
    if (order.status === 'DELIVERED') return 'Entregue';
    if (order.status === 'CANCELLED') return 'Cancelado';
    
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - createdAt.getTime()) / 60000); // minutos
    
    let estimatedTime;
    switch (order.status) {
      case 'PENDING':
        estimatedTime = 40 - elapsed;
        break;
      case 'CONFIRMED':
        estimatedTime = 35 - elapsed;
        break;
      case 'PREPARING':
        estimatedTime = 25 - elapsed;
        break;
      case 'READY':
        estimatedTime = 15 - elapsed;
        break;
      default:
        estimatedTime = 40 - elapsed;
    }
    
    if (estimatedTime <= 0) return 'Em breve';
    return `${estimatedTime} min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="w-8 h-8 text-orange-600" />
            Meus Pedidos
          </h1>
          <p className="text-gray-600">Acompanhe seus pedidos em tempo real</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Digite seu telefone para ver seus pedidos
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              maxLength={15}
            />
            <button
              onClick={handleSearchOrders}
              disabled={loading}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Pedido {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${statusConfig[order.status].color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status].label}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Previsão: {estimateDeliveryTime(order)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </p>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <p key={item.id} className="text-sm text-gray-600">
                          {item.quantity}x {item.product.name}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-500">
                          + {order.items.length - 2} {order.items.length - 2 === 1 ? 'item' : 'itens'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        {order.type === 'DELIVERY' ? (
                          <>
                            <Truck className="w-4 h-4" />
                            Entrega
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4" />
                            Retirada
                          </>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {paymentMethodLabels[order.paymentMethod]}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(Number(order.total))}
                    </p>
                  </div>

                  {/* Out for Delivery Notification */}
                  {order.status === 'READY' && order.type === 'DELIVERY' && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <Truck className="w-5 h-5" />
                        <p className="font-semibold">
                          🎉 Seu pedido saiu para entrega!
                        </p>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Logo logo estará aí!
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : !loading && phone ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600">
              Você ainda não fez pedidos com este telefone
            </p>
          </div>
        ) : null}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content - detalhes completos do pedido */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pedido {selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${statusConfig[selectedOrder.status].color}`}>
                    {React.createElement(statusConfig[selectedOrder.status].icon, { className: 'w-5 h-5' })}
                    {statusConfig[selectedOrder.status].label}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tempo estimado: {estimateDeliveryTime(selectedOrder)}
                  </p>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.quantity}x {item.product.name}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-gray-600">Obs: {item.notes}</p>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(Number(item.subtotal))}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatCurrency(Number(selectedOrder.total))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.type === 'DELIVERY' && selectedOrder.deliveryAddress && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Endereço de Entrega
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900">
                        {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.number}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.deliveryAddress.district}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.state}
                      </p>
                      {selectedOrder.deliveryAddress.complement && (
                        <p className="text-gray-600 text-sm mt-1">
                          Complemento: {selectedOrder.deliveryAddress.complement}
                        </p>
                      )}
                      {selectedOrder.deliveryAddress.referencePoint && (
                        <p className="text-gray-600 text-sm">
                          Referência: {selectedOrder.deliveryAddress.referencePoint}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pagamento
                  </h3>
                  <p className="text-gray-700">
                    {paymentMethodLabels[selectedOrder.paymentMethod]}
                  </p>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Observações
                    </h3>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Contact */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-800 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Dúvidas? Entre em contato: {selectedOrder.customer.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
