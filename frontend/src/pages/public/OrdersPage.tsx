import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Tasdiqlash kutilmoqda',
  CONFIRMED: 'Tasdiqlandi',
  PREPARING: 'Tayyorlanmoqda',
  READY: 'Tayyor',
  PICKED_UP: 'Kuryer olib ketdi',
  DELIVERING: 'Yetkazilmoqda',
  DELIVERED: 'Yetkazildi',
  CANCELLED: 'Bekor qilindi',
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  PICKED_UP: 'bg-indigo-100 text-indigo-800',
  DELIVERING: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Mening buyurtmalarim</h1>
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Restoranlarga qaytish
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
              <div className="text-7xl mb-6">📦</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                У вас пока нет заказов
              </h2>
              <p className="text-gray-600 mb-8">
                Сделайте первый заказ из наших ресторанов
              </p>
              <Link
                to="/"
                className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 hover:shadow-xl transition-all"
              >
                Перейти к ресторанам
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          Buyurtma #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      {order.restaurant && (
                        <p className="text-lg text-gray-700 mb-2">
                          🍽️ {order.restaurant.name}
                        </p>
                      )}
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center">
                          <span className="mr-2">📍</span>
                          {order.address}
                        </p>
                        <p className="flex items-center">
                          <span className="mr-2">📞</span>
                          {order.phone}
                        </p>
                        {order.notes && (
                          <p className="flex items-center">
                            <span className="mr-2">💬</span>
                            {order.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-3xl font-bold text-primary-600 mb-2">
                        {order.totalPrice} so'm
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Buyurtma tarkibi:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">
                                {item.menuItem?.name.includes('Пицца') ? '🍕' :
                                 item.menuItem?.name.includes('Бургер') ? '🍔' :
                                 item.menuItem?.name.includes('Салат') ? '🥗' : '🍽️'}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.menuItem?.name || 'Taom'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  x {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-700">
                              {item.price * item.quantity} so'm
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
