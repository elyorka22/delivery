import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { Restaurant, MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { getImageUrl } from '../../utils/upload';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const { addItem, items, updateQuantity, removeItem } = useCartStore();

  // Demo data
  const demoRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Пицца Мария',
      description: 'Итальянская кухня',
      address: 'ул. Ленина, 10',
      phone: '+7 (999) 123-45-67',
      image: '',
      managerId: '1',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Бургер Кинг',
      description: 'Американская кухня',
      address: 'пр. Мира, 25',
      phone: '+7 (999) 234-56-78',
      image: '',
      managerId: '2',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Суши Мастер',
      description: 'Японская кухня',
      address: 'ул. Пушкина, 5',
      phone: '+7 (999) 345-67-89',
      image: '',
      managerId: '3',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Китайская Лапша',
      description: 'Китайская кухня',
      address: 'ул. Гагарина, 15',
      phone: '+7 (999) 456-78-90',
      image: '',
      managerId: '4',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Сладкое Королевство',
      description: 'Десерты и выпечка',
      address: 'ул. Советская, 20',
      phone: '+7 (999) 567-89-01',
      image: '',
      managerId: '5',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Кофе Хаус',
      description: 'Кофейня и завтраки',
      address: 'пр. Победы, 30',
      phone: '+7 (999) 678-90-12',
      image: '',
      managerId: '6',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '7',
      name: 'Салат Бар',
      description: 'Здоровое питание',
      address: 'ул. Мира, 12',
      phone: '+7 (999) 789-01-23',
      image: '',
      managerId: '7',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '8',
      name: 'Шашлычная',
      description: 'Грузинская кухня',
      address: 'ул. Горького, 8',
      phone: '+7 (999) 890-12-34',
      image: '',
      managerId: '8',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length > 0) {
        setRestaurants(data);
      } else {
        // Use demo data if no restaurants found
        setRestaurants(demoRestaurants);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Use demo data on error
      setRestaurants(demoRestaurants);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (restaurantId: string) => {
    setMenuLoading(true);
    try {
      const response = await api.get(`/restaurants/${restaurantId}/menu`);
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId: string) => {
    if (selectedRestaurant === restaurantId) {
      setSelectedRestaurant(null);
      setMenuItems([]);
    } else {
      setSelectedRestaurant(restaurantId);
      fetchMenuItems(restaurantId);
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

  const filteredRestaurants = Array.isArray(restaurants) 
    ? restaurants.filter((restaurant) => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && restaurant.isActive;
      })
    : [];

  const filteredMenuItems = Array.isArray(menuItems)
    ? menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && item.isAvailable;
      })
    : [];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Restoran yoki taom qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg rounded-xl border border-gray-300 bg-white shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Restaurants Carousel */}
            <div className="overflow-x-auto pb-2 pt-2 scrollbar-hide">
              <div className="flex space-x-4 px-4 sm:px-0">
                <button
                  onClick={() => {
                    setSelectedRestaurant(null);
                    setMenuItems([]);
                  }}
                  className={`flex flex-col items-center space-y-2 min-w-[100px] transition-all ${
                    selectedRestaurant === null
                      ? 'transform scale-110'
                      : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all ${
                      selectedRestaurant === null
                        ? 'bg-primary-600 text-white shadow-primary-200 ring-4 ring-primary-600'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                  >
                    🍽️
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      selectedRestaurant === null
                        ? 'text-primary-600 font-bold'
                        : 'text-primary-600 font-semibold'
                    }`}
                  >
                    Barchasi
                  </span>
                </button>
                {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => handleRestaurantClick(restaurant.id)}
                    className={`flex flex-col items-center space-y-2 min-w-[100px] transition-all ${
                      selectedRestaurant === restaurant.id
                        ? 'transform scale-110'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shadow-lg transition-all ${
                        selectedRestaurant === restaurant.id
                          ? 'ring-4 ring-primary-600 shadow-primary-200'
                          : 'ring-2 ring-primary-200 shadow-md'
                      }`}
                    >
                      {restaurant.image ? (
                        <img
                          src={getImageUrl(restaurant.image)}
                          alt={restaurant.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&crop=center"
                          alt={restaurant.name}
                          className="w-full h-full object-cover rounded-full bg-white"
                          style={{ backgroundColor: 'white' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.createElement('span');
                            fallback.textContent = '🍽️';
                            fallback.className = 'text-2xl';
                            target.parentElement?.appendChild(fallback);
                          }}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center line-clamp-2 ${
                        selectedRestaurant === restaurant.id
                          ? 'text-primary-600 font-bold'
                          : 'text-primary-600 font-semibold'
                      }`}
                    >
                      {restaurant.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {selectedRestaurant ? (
            // Menu Items Section
            <>
              {menuLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredMenuItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredMenuItems.map((item) => (
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
                            onClick={() => handleIncrease(item)}
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
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                  <div className="text-5xl mb-4">🍽️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Taomlar topilmadi
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Bu restoranda hali taomlar yo'q
                  </p>
                </div>
              )}
            </>
          ) : (
            // Restaurants Cards Section
            <>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                      <div className="h-32 bg-gray-200"></div>
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredRestaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurant/${restaurant.id}`}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                    >
                      <div className="relative h-32 overflow-hidden">
                        {restaurant.image ? (
                          <img
                            src={getImageUrl(restaurant.image)}
                            alt={restaurant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                            <span className="text-5xl">🍽️</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-primary-600">
                          Ochiq
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span className="flex items-center">
                            <span className="mr-1">🕐</span>
                            35 daqiqa
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">⭐</span>
                            4.8
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 font-semibold text-sm">
                            dan 500 so'm
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Restoranlar topilmadi
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Qidiruv so'rovini o'zgartirib ko'ring
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Qidiruvni tozalash
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
