import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { uploadImage, getImageUrl } from '../../utils/upload';

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const getDashboardLink = () => {
    if (!user) return null;
    
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return '/admin';
      case UserRole.MANAGER:
        return '/manager';
      case UserRole.COOK:
        return '/cook';
      case UserRole.COURIER:
        return '/courier';
      default:
        return null;
    }
  };

  const getDashboardLabel = () => {
    if (!user) return '';
    
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return 'Super admin paneli';
      case UserRole.MANAGER:
        return 'Menejer paneli';
      case UserRole.COOK:
        return 'Oshpaz paneli';
      case UserRole.COURIER:
        return 'Kuryer paneli';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setMessage('');

    try {
      let avatarUrl = formData.avatar;

      // Если выбран новый файл, загружаем его
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      const response = await api.put('/users/me', {
        ...formData,
        avatar: avatarUrl,
      });
      setAuth(response.data.user, localStorage.getItem('token') || '');
      setMessage('Profil muvaffaqiyatli yangilandi');
      setAvatarFile(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Profilni yangilashda xatolik');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Profil</h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {avatarPreview || user?.avatar ? (
                  <img
                    src={avatarPreview || getImageUrl(user?.avatar)}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center shadow-lg';
                        fallback.innerHTML = `<span class="text-5xl text-white">${user?.name?.charAt(0).toUpperCase() || '👤'}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-5xl text-white">
                      {user?.name?.charAt(0).toUpperCase() || '👤'}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <span className="text-sm">📷</span>
                </label>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              {user && user.role !== UserRole.CUSTOMER && getDashboardLink() && (
                <Link
                  to={getDashboardLink()!}
                  className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-4"
                >
                  {getDashboardLabel()}
                </Link>
              )}
            </div>

            {message && (
              <div
                className={`mb-6 px-4 py-3 rounded-lg ${
                  message.includes('muvaffaqiyatli') || message.includes('успешно')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ism
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="+998 (99) 123-45-67"
                />
              </div>

              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-primary-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || uploading ? 'Yuklanmoqda...' : 'O\'zgarishlarni saqlash'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
