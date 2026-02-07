import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    // Simular carregamento de dados
    // Em produção, fazer fetch da API: fetch('/api/pedidos')
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: '1',
          customerName: 'João Silva',
          phone: '(11) 99999-9999',
          total: 89.90,
          status: 'pending',
          createdAt: new Date().toISOString(),
          items: [
            { name: 'X-Bacon', quantity: 2, price: 35.90 },
            { name: 'Coca-Cola 350ml', quantity: 2, price: 9.00 }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setStats({
        totalOrders: mockOrders.length,
        totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
        completedOrders: mockOrders.filter(o => o.status === 'delivered').length
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    // Em produção: fetch(`/api/pedidos/${orderId}`, { method: 'PATCH', body: { status: newStatus }})
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      preparing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      out_for_delivery: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'Pendente',
      preparing: 'Preparando',
      out_for_delivery: 'Saiu para entrega',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status];
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-zinc-400">Gerencie seus pedidos e vendas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-8 h-8 text-emerald-500" />
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
            <p className="text-sm text-zinc-400">Total de Pedidos</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-zinc-400">Receita Total</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            <p className="text-sm text-zinc-400">Pedidos Pendentes</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{stats.completedOrders}</p>
            <p className="text-sm text-zinc-400">Pedidos Entregues</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {status === 'all' ? 'Todos' : getStatusLabel(status as Order['status'])}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhum pedido encontrado</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{order.customerName}</h3>
                    <p className="text-sm text-zinc-400">{order.phone}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="text-2xl font-bold text-emerald-500">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-zinc-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-zinc-400">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                      >
                        Iniciar Preparo
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                      >
                        Saiu para Entrega
                      </button>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      >
                        Marcar como Entregue
                      </button>
                    )}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
