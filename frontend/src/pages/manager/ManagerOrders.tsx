import { useEffect, useState } from 'react';
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

export default function ManagerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/manager/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Заказы ресторана</h1>
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Yuklanmoqda...</p>
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
                  <p className="text-gray-600">Адрес: {order.address}</p>
                  <p className="text-gray-600">Телефон: {order.phone}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === OrderStatus.DELIVERED
                      ? 'bg-green-100 text-green-800'
                      : order.status === OrderStatus.CANCELLED
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>
              {order.items && order.items.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Состав:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.menuItem?.name || 'Taom'} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary-600">
                  {order.totalPrice} so'm
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

