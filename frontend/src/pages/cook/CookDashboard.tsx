import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтвержден',
  PREPARING: 'Готовится',
  READY: 'Готов',
  PICKED_UP: 'Забран',
  DELIVERING: 'Доставляется',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменен',
};

export default function CookDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/cook/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.put(`/cook/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Панель повара</h1>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Заказ #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-gray-600">
                      {order.restaurant?.name || 'Ресторан'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === OrderStatus.READY
                        ? 'bg-green-100 text-green-800'
                        : order.status === OrderStatus.PREPARING
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Состав заказа:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.menuItem?.name || 'Taom'} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex space-x-2">
                  {order.status === OrderStatus.CONFIRMED && (
                    <button
                      onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Начать готовить
                    </button>
                  )}
                  {order.status === OrderStatus.PREPARING && (
                    <button
                      onClick={() => updateOrderStatus(order.id, OrderStatus.READY)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Готово
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

