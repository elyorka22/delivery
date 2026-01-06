import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ManagerHome() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateCook, setShowCreateCook] = useState(false);
  const [showCreateCourier, setShowCreateCourier] = useState(false);
  const [cookFormData, setCookFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [courierFormData, setCourierFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/manager/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/manager/cooks', cookFormData);
      setSuccess('Oshpaz muvaffaqiyatli yaratildi');
      setShowCreateCook(false);
      setCookFormData({ name: '', email: '', password: '', phone: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Oshpaz yaratishda xatolik');
    }
  };

  const handleCreateCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/manager/couriers', courierFormData);
      setSuccess('Kuryer muvaffaqiyatli yaratildi');
      setShowCreateCourier(false);
      setCourierFormData({ name: '', email: '', password: '', phone: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kuryer yaratishda xatolik');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Menejer paneli</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Jami buyurtmalar</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Daromad</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalRevenue} so'm</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Kutilayotgan</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.pendingOrders}</p>
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Cook */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Oshpazlarni boshqarish</h2>
                <button
                  onClick={() => setShowCreateCook(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  + Oshpaz qo'shish
                </button>
              </div>

              {showCreateCook && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
                      {success}
                    </div>
                  )}
                  <form onSubmit={handleCreateCook} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Имя"
                      value={cookFormData.name}
                      onChange={(e) => setCookFormData({ ...cookFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={cookFormData.email}
                      onChange={(e) => setCookFormData({ ...cookFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Пароль"
                      value={cookFormData.password}
                      onChange={(e) => setCookFormData({ ...cookFormData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Телефон (опционально)"
                      value={cookFormData.phone}
                      onChange={(e) => setCookFormData({ ...cookFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Создать
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateCook(false);
                          setCookFormData({ name: '', email: '', password: '', phone: '' });
                          setError('');
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Create Courier */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Kuryerlarni boshqarish</h2>
                <button
                  onClick={() => setShowCreateCourier(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  + Kuryer qo'shish
                </button>
              </div>

              {showCreateCourier && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
                      {success}
                    </div>
                  )}
                  <form onSubmit={handleCreateCourier} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Имя"
                      value={courierFormData.name}
                      onChange={(e) => setCourierFormData({ ...courierFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={courierFormData.email}
                      onChange={(e) => setCourierFormData({ ...courierFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Пароль"
                      value={courierFormData.password}
                      onChange={(e) => setCourierFormData({ ...courierFormData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Телефон (опционально)"
                      value={courierFormData.phone}
                      onChange={(e) => setCourierFormData({ ...courierFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Создать
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateCourier(false);
                          setCourierFormData({ name: '', email: '', password: '', phone: '' });
                          setError('');
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
