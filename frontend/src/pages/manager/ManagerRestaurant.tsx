import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Restaurant } from '../../types';
import { uploadImage, getImageUrl } from '../../utils/upload';

export default function ManagerRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get('/manager/restaurant');
      setRestaurant(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description || '',
        address: response.data.address,
        phone: response.data.phone,
        image: response.data.image || '',
      });
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        description: restaurant.description || '',
        address: restaurant.address,
        phone: restaurant.phone,
        image: restaurant.image || '',
      });
      setImagePreview(restaurant.image || '');
    }
    setImageFile(null);
    setShowEditForm(true);
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Если выбран новый файл, загружаем его
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const response = await api.put('/manager/restaurant', {
        ...formData,
        image: imageUrl,
      });
      setRestaurant(response.data);
      setSuccess('Restoran ma\'lumotlari muvaffaqiyatli yangilandi');
      setShowEditForm(false);
      setImageFile(null);
      setImagePreview('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Yangilashda xatolik');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Restoran topilmadi</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Restoran ma'lumotlari</h1>
        <button
          onClick={handleEdit}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Tahrirlash
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {!showEditForm ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-64 overflow-hidden">
            {restaurant.image ? (
              <img
                src={getImageUrl(restaurant.image)}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary-500 flex items-center justify-center">
                <span className="text-8xl">🍽️</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
            {restaurant.description && (
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
            )}
            <div className="space-y-2">
              <p className="flex items-center text-gray-700">
                <span className="mr-2">📍</span>
                {restaurant.address}
              </p>
              <p className="flex items-center text-gray-700">
                <span className="mr-2">📞</span>
                {restaurant.phone}
              </p>
              <p className="flex items-center text-gray-700">
                <span className="mr-2">📷</span>
                {restaurant.image ? (
                  <a href={restaurant.image} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    Rasm URL
                  </a>
                ) : (
                  <span className="text-gray-400">Rasm yo'q</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Restoran ma'lumotlarini tahrirlash</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomi *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tavsif
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manzil *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rasm
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Yoki URL kiriting (ixtiyoriy)
              </p>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
              />
              {(imagePreview || formData.image) && (
                <div className="mt-2">
                  <img
                    src={imagePreview || formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Yuklanmoqda...' : 'Saqlash'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setError('');
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

