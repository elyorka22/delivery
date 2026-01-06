import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { Restaurant, MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { getImageUrl } from '../../utils/upload';

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const { addItem, items, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    if (id) {
      fetchRestaurant();
      fetchMenuItems();
    }
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await api.get(`/restaurants/${id}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Barchasi', ...Array.from(new Set(menuItems.map((item) => item.category)))];
  const filteredItems = selectedCategory === 'Barchasi'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    if (item.isAvailable) {
      addItem(item);
    }
  };

  const getItemQuantity = (itemId: string): number => {
    const cartItem = items.find((i) => i.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleIncrease = (item: MenuItem) => {
    if (item.isAvailable) {
      const quantity = getItemQuantity(item.id);
      if (quantity === 0) {
        addItem(item);
      } else {
        updateQuantity(item.id, quantity + 1);
      }
    }
  };

  const handleDecrease = (item: MenuItem) => {
    const quantity = getItemQuantity(item.id);
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else if (quantity === 1) {
      removeItem(item.id);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : restaurant ? (
          <>
            {/* Restaurant Header */}
            <div className="relative h-64 md:h-80 overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
                {restaurant.description && (
                  <p className="text-lg text-white/90 mb-4">{restaurant.description}</p>
                )}
                <div className="flex items-center space-x-6 text-sm">
                  <span className="flex items-center">
                    <span className="mr-2">📍</span>
                    {restaurant.address}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">📞</span>
                    {restaurant.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Categories */}
              <div className="mb-8">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-primary-100 flex items-center justify-center">
                          <span className="text-6xl">🍕</span>
                        </div>
                      )}
                      {getItemQuantity(item.id) === 0 ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                          className={`absolute bottom-3 right-3 w-12 h-12 rounded-full font-semibold transition-all flex items-center justify-center shadow-lg hover:shadow-xl text-2xl ${
                            item.isAvailable
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          title={item.isAvailable ? '+ Qo\'shish' : 'Mavjud emas'}
                        >
                          {item.isAvailable ? '+' : '✕'}
                        </button>
                      ) : (
                        <div className="absolute bottom-3 right-3 flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="w-10 h-10 flex items-center justify-center text-primary-600 hover:bg-primary-50 font-bold text-lg transition-colors"
                            title="Kamaytirish"
                          >
                            −
                          </button>
                          <span className="w-10 h-10 flex items-center justify-center text-gray-900 font-semibold text-sm">
                            {getItemQuantity(item.id)}
                          </span>
                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={!item.isAvailable}
                            className={`w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors ${
                              item.isAvailable
                                ? 'text-primary-600 hover:bg-primary-50'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title="Ko'paytirish"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                          {!item.isAvailable && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                            Mavjud emas
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">
                          {item.price} so'm
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Taomlar topilmadi
                  </h3>
                  <p className="text-gray-600">
                    Bu kategoriyada hali taomlar yo'q
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Restoran topilmadi
              </h2>
              <Link
                to="/"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Bosh sahifaga qaytish
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
