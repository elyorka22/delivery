import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { getImageUrl } from '../../utils/upload';

interface CarouselCategory {
  id: string;
  category: string;
  imageUrl: string;
  order: number;
}

export default function HomePage() {
  const [carouselCategories, setCarouselCategories] = useState<CarouselCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem, items, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    fetchCarouselCategories();
  }, []);

  const fetchCarouselCategories = async () => {
    try {
      const response = await api.get('/admin/carousel/categories');
      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length > 0) {
        setCarouselCategories(data);
      } else {
        // If no carousel categories, fetch all available categories
        const categoriesResponse = await api.get('/restaurants/categories');
        const categories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
        // Create default carousel categories from available categories
        const defaultCategories: CarouselCategory[] = categories.map((cat: string, index: number) => ({
          id: `default-${index}`,
          category: cat,
          imageUrl: '',
          order: index,
        }));
        setCarouselCategories(defaultCategories);
      }
    } catch (error) {
      console.error('Error fetching carousel categories:', error);
      // Fallback: try to get categories from restaurants
      try {
        const categoriesResponse = await api.get('/restaurants/categories');
        const categories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
        const defaultCategories: CarouselCategory[] = categories.map((cat: string, index: number) => ({
          id: `default-${index}`,
          category: cat,
          imageUrl: '',
          order: index,
        }));
        setCarouselCategories(defaultCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
  };

  const fetchMenuItemsByCategory = async (category: string) => {
    setMenuLoading(true);
    try {
      const response = await api.get(`/restaurants/category/${encodeURIComponent(category)}/menu`);
      const data = Array.isArray(response.data) ? response.data : [];
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      setMenuItems([]);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setMenuItems([]);
    } else {
      setSelectedCategory(category);
      fetchMenuItemsByCategory(category);
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
                  placeholder="Taom qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg rounded-xl border border-gray-300 bg-white shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories Carousel */}
            <div className="overflow-x-auto pb-2 pt-2 scrollbar-hide">
              <div className="flex space-x-4 px-4 sm:px-0">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setMenuItems([]);
                  }}
                  className={`flex flex-col items-center space-y-2 min-w-[100px] transition-all ${
                    selectedCategory === null
                      ? 'transform scale-110 ring-4 ring-primary-600 shadow-primary-200'
                      : 'hover:scale-105 ring-2 ring-primary-200'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all ${
                      selectedCategory === null
                        ? 'bg-primary-600 text-white shadow-primary-200'
                        : 'bg-primary-100 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    🍽️
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      selectedCategory === null
                        ? 'text-primary-600 font-bold'
                        : 'text-primary-600 font-semibold'
                    }`}
                  >
                    Barchasi
                  </span>
                </button>
                {carouselCategories.map((carouselCategory) => (
                  <button
                    key={carouselCategory.id}
                    onClick={() => handleCategoryClick(carouselCategory.category)}
                    className={`flex flex-col items-center space-y-2 min-w-[100px] transition-all ${
                      selectedCategory === carouselCategory.category
                        ? 'transform scale-110 ring-4 ring-primary-600 shadow-primary-200'
                        : 'hover:scale-105 ring-2 ring-primary-200'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shadow-lg transition-all ${
                        selectedCategory === carouselCategory.category
                          ? 'ring-4 ring-primary-600 shadow-primary-200'
                          : 'ring-2 ring-primary-200 shadow-md'
                      }`}
                    >
                      {carouselCategory.imageUrl ? (
                        <img
                          src={getImageUrl(carouselCategory.imageUrl)}
                          alt={carouselCategory.category}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl">
                          🍕
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center line-clamp-2 ${
                        selectedCategory === carouselCategory.category
                          ? 'text-primary-600 font-bold'
                          : 'text-primary-600 font-semibold'
                      }`}
                    >
                      {carouselCategory.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {selectedCategory ? (
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
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {selectedCategory} - Barcha restoranlar
                  </h2>
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
                              className="absolute bottom-3 right-3 bg-primary-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              + Qo'shish
                            </button>
                          ) : (
                            <div className="absolute bottom-3 right-3 bg-white rounded-full px-3 py-2 shadow-lg flex items-center space-x-3">
                              <button
                                onClick={() => handleDecrease(item)}
                                className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-primary-700 transition-colors"
                              >
                                -
                              </button>
                              <span className="font-semibold text-gray-900 min-w-[24px] text-center">
                                {getItemQuantity(item.id)}
                              </span>
                              <button
                                onClick={() => handleIncrease(item)}
                                disabled={!item.isAvailable}
                                className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>
                          )}
                          {item.restaurant && (
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-primary-600">
                              {item.restaurant.name}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary-600">
                              {item.price.toLocaleString()} so'm
                            </span>
                            {!item.isAvailable && (
                              <span className="text-xs text-red-600 font-semibold">Mavjud emas</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Bu kategoriyada hali taomlar yo'q
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Kategoriyani tanlang yoki qidiruvdan foydalaning
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
