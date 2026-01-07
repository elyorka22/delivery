import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getImageUrl, uploadImage } from '../../utils/upload';

interface CarouselImage {
  id: string;
  restaurantId: string;
  restaurantName: string;
  imageUrl: string;
  order: number;
}

export default function AdminCarousel() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [formData, setFormData] = useState({
    restaurantId: '',
    imageUrl: '',
    order: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchCarouselImages();
    fetchRestaurants();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const response = await api.get('/admin/restaurants');
      const restaurantsData = response.data;
      
      // Преобразуем рестораны в формат картинок карусели
      const images: CarouselImage[] = restaurantsData
        .filter((r: any) => r.image && r.isActive)
        .map((r: any, index: number) => ({
          id: r.id,
          restaurantId: r.id,
          restaurantName: r.name,
          imageUrl: r.image,
          order: index,
        }));
      
      setCarouselImages(images);
    } catch (error) {
      console.error('Error fetching carousel images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/admin/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleCreate = () => {
    setEditingImage(null);
    setFormData({
      restaurantId: '',
      imageUrl: '',
      order: carouselImages.length,
    });
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (image: CarouselImage) => {
    setEditingImage(image);
    setFormData({
      restaurantId: image.restaurantId,
      imageUrl: image.imageUrl,
      order: image.order,
    });
    setImagePreview(getImageUrl(image.imageUrl));
    setImageFile(null);
    setShowForm(true);
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
      let imageUrl = formData.imageUrl;

      // Если выбран новый файл, загружаем его
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (!imageUrl) {
        setError('Rasm yuklanishi kerak');
        setUploading(false);
        return;
      }

      // Обновляем картинку ресторана
      const restaurant = restaurants.find((r) => r.id === formData.restaurantId);
      if (!restaurant) {
        setError('Restoran topilmadi');
        setUploading(false);
        return;
      }

      await api.put(`/admin/restaurants/${formData.restaurantId}`, {
        ...restaurant,
        image: imageUrl,
      });

      setSuccess('Karusel rasmi muvaffaqiyatli yangilandi');
      fetchCarouselImages();
      fetchRestaurants();
      setShowForm(false);
      setImageFile(null);
      setImagePreview('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (restaurantId: string) => {
    if (!confirm('Bu karusel rasmini o\'chirishni xohlaysizmi?')) {
      return;
    }

    try {
      const restaurant = restaurants.find((r) => r.id === restaurantId);
      if (restaurant) {
        await api.put(`/admin/restaurants/${restaurantId}`, {
          ...restaurant,
          image: '',
        });
        setSuccess('Karusel rasmi muvaffaqiyatli o\'chirildi');
        fetchCarouselImages();
        fetchRestaurants();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'O\'chirishda xatolik');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Karusel rasmlarini boshqarish</h1>
        <button
          onClick={handleCreate}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          + Rasm qo'shish
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

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingImage ? 'Karusel rasmini tahrirlash' : 'Yangi karusel rasmi qo\'shish'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Restoran *
              </label>
              <select
                value={formData.restaurantId}
                onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                disabled={!!editingImage}
              >
                <option value="">Restoranni tanlang</option>
                {restaurants
                  .filter((r) => r.isActive)
                  .map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
              </select>
              {editingImage && (
                <p className="mt-1 text-xs text-gray-500">
                  Restoranni o'zgartirib bo'lmaydi
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rasm (karusel uchun) *
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Kompyuter yoki telefonidan yuklash
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer hover:border-primary-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG yoki GIF formatida, maksimal 5MB
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">YOKI</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    URL orqali kiriting
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {(imagePreview || formData.imageUrl) && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Ko'rinish:
                    </label>
                    <div className="relative">
                      <img
                        src={imagePreview || getImageUrl(formData.imageUrl)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Karusel ko'rinishi
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Bu rasm karuselda ko'rinadi
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Yuklanmoqda...' : editingImage ? 'Saqlash' : 'Qo\'shish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingImage(null);
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

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carouselImages.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">Hozircha karusel rasmlari yo'q</p>
              <p className="text-sm text-gray-500 mt-2">
                Karusel rasmi qo'shish uchun yuqoridagi tugmani bosing
              </p>
            </div>
          ) : (
            carouselImages.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={image.restaurantName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Karusel
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{image.restaurantName}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(image.restaurantId)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

