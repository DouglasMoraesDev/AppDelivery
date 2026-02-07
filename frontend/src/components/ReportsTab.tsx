import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, MapPin, Package, DollarSign, Calendar, FileText } from 'lucide-react';

interface ReportsTabProps {
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
  reportData: any;
  loading: boolean;
}

export default function ReportsTab({ period, onPeriodChange, reportData, loading }: ReportsTabProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Selecione um período para visualizar o relatório</p>
        </div>
      </div>
    );
  }

  const periodLabels = {
    daily: 'Hoje',
    weekly: 'Últimos 7 dias',
    monthly: 'Últimos 30 dias',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios Detalhados</h2>
          <p className="text-gray-600 mt-1">Análise completa de pedidos e vendas</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPeriodChange('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'daily'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Diário
          </button>
          <button
            onClick={() => onPeriodChange('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'weekly'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => onPeriodChange('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'monthly'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mensal
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Pedidos</h3>
            <FileText className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{reportData.totalOrders}</p>
          <p className="text-orange-100 text-sm mt-2">{periodLabels[period]}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Faturamento</h3>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">R$ {reportData.totalRevenue.toFixed(2)}</p>
          <p className="text-green-100 text-sm mt-2">{periodLabels[period]}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ticket Médio</h3>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">R$ {reportData.avgOrderValue.toFixed(2)}</p>
          <p className="text-blue-100 text-sm mt-2">Por pedido</p>
        </div>
      </div>

      {/* Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            Produtos Mais Pedidos
          </h3>
          <div className="space-y-3">
            {reportData.topProducts?.slice(0, 10).map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} unidades vendidas</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">R$ {product.revenue.toFixed(2)}</p>
              </div>
            ))}
            {(!reportData.topProducts || reportData.topProducts.length === 0) && (
              <p className="text-center text-gray-500 py-4">Nenhum produto vendido no período</p>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Clientes que Mais Pediram
          </h3>
          <div className="space-y-3">
            {reportData.topCustomers?.slice(0, 10).map((customer: any, index: number) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">
                      {customer.orderCount} {customer.orderCount === 1 ? 'pedido' : 'pedidos'} • {customer.phone}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">R$ {customer.totalSpent.toFixed(2)}</p>
              </div>
            ))}
            {(!reportData.topCustomers || reportData.topCustomers.length === 0) && (
              <p className="text-center text-gray-500 py-4">Nenhum cliente no período</p>
            )}
          </div>
        </div>
      </div>

      {/* Orders by Location */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          Pedidos por Localização
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportData.ordersByLocation?.slice(0, 12).map((loc: any, index: number) => (
            <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-gray-900">{loc.location}</p>
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{loc.count}</p>
              <p className="text-sm text-gray-600">
                {loc.count === 1 ? 'pedido' : 'pedidos'}
              </p>
              <div className="mt-2 pt-2 border-t border-gray-300">
                <p className="text-sm font-semibold text-green-600">R$ {loc.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
          {(!reportData.ordersByLocation || reportData.ordersByLocation.length === 0) && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Nenhuma localização registrada no período
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          Todos os Pedidos - Detalhado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Pedido #</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Data/Hora</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Telefone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Itens</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Valor Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Pagamento</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.orders?.map((order: any) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-gray-900 text-sm whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}<br/>
                      <span className="text-xs text-gray-700">
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{order.customerName}</td>
                    <td className="py-3 px-4 text-gray-900 text-sm">{order.phone}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="mb-1">
                            <span className="font-medium">{item.quantity}x</span> {item.productName}
                            <span className="text-gray-700 ml-2">R$ {item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600 whitespace-nowrap">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.paymentMethod === 'PIX' ? 'bg-teal-100 text-teal-800' :
                        order.paymentMethod === 'CREDIT_CARD' ? 'bg-blue-100 text-blue-800' :
                        order.paymentMethod === 'DEBIT_CARD' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.paymentMethod === 'PIX' ? 'PIX' :
                         order.paymentMethod === 'CREDIT_CARD' ? 'Crédito' :
                         order.paymentMethod === 'DEBIT_CARD' ? 'Débito' : 'Dinheiro'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.type === 'DELIVERY' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {order.type === 'DELIVERY' ? '🚚 Entrega' : '🏃 Retirada'}
                      </span>
                      {order.type === 'DELIVERY' && order.deliveryAddress && (
                        <div className="text-xs text-gray-700 mt-1">
                          {order.deliveryAddress.street}, {order.deliveryAddress.number} - {order.deliveryAddress.district}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PREPARING' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'READY' ? 'bg-teal-100 text-teal-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'DELIVERED' ? '✓ Entregue' :
                         order.status === 'PENDING' ? '⏳ Pendente' :
                         order.status === 'CONFIRMED' ? '✓ Confirmado' :
                         order.status === 'PREPARING' ? '👨‍🍳 Preparando' :
                         order.status === 'READY' ? '✓ Pronto' : '✗ Cancelado'}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-300">
                <td colSpan={5} className="py-3 px-4 font-bold text-gray-900 text-right">TOTAL GERAL:</td>
                <td className="py-3 px-4 text-right font-bold text-green-600 text-lg">
                  R$ {reportData.totalRevenue?.toFixed(2) || '0.00'}
                </td>
                <td colSpan={3} className="py-3 px-4 text-gray-900 text-sm">
                  {reportData.totalOrders || 0} pedidos
                </td>
              </tr>
            </tfoot>
          </table>
          {(!reportData.orders || reportData.orders.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>Nenhum pedido registrado no período selecionado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
