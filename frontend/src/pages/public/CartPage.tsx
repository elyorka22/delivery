import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { useState } from 'react';
import { getImageUrl } from '../../utils/upload';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!address || !phone) {
      setError('Manzil va telefonni to\'ldiring');
      return;
    }

    if (items.length === 0) {
      setError('Savat bo\'sh');
      return;
    }

    const restaurantId = items[0].restaurantId;
    const orderItems = items.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    setLoading(true);
    setError('');

    try {
      await api.post('/orders', {
        restaurantId,
        items: orderItems,
        address,
        phone,
        notes,
      });
      clearCart();
      navigate(`/orders`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Buyurtma yaratishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
              <div className="text-7xl mb-6">🛒</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Savat bo'sh</h2>
              <p className="text-gray-600 mb-8">
                Добавьте блюда из ресторанов, чтобы сделать заказ
              </p>
              <Link
                to="/"
                className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Перейти к ресторанам
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Savat</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-4">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-primary-100 rounded-xl flex items-center justify-center">
                        <span className="text-4xl">🍕</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.price} so'm dona</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-bold text-primary-600">
                            {item.price * item.quantity} so'm
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Buyurtma berish</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Yetkazib berish manzili *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Manzilni kiriting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+998 (99) 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Izoh
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Qo'shimcha xohishlar"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Mahsulotlar:</span>
                    <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                    <span>Jami:</span>
                    <span className="text-primary-600">{getTotal()} so'm</span>
                  </div>
                </div>

                {user ? (
                  <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-primary-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Buyurtma berilmoqda...' : 'Buyurtma berish'}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-bold text-lg text-center hover:bg-primary-700 hover:shadow-xl transition-all"
                  >
                    Buyurtma uchun kirish
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
