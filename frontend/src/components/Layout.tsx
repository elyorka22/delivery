import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { UserRole } from '../types';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        return '/profile';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-xl sm:text-2xl">🍕</span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold text-gray-900 block">FoodDelivery</span>
                <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Tez ovqat yetkazib berish</span>
              </div>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  {user.role === UserRole.CUSTOMER && (
                    <>
                      <Link
                        to="/cart"
                        className="relative px-2 sm:px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm sm:text-base"
                      >
                        <span className="relative">
                          <span className="hidden sm:inline">Savat</span>
                          <span className="sm:hidden">🛒</span>
                          {cartItemsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {cartItemsCount > 99 ? '99+' : cartItemsCount}
                            </span>
                          )}
                        </span>
                      </Link>
                      <Link
                        to="/orders"
                        className="px-2 sm:px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">Buyurtmalar</span>
                        <span className="sm:hidden">📦</span>
                      </Link>
                    </>
                  )}
                  <Link
                    to={getDashboardLink() || '/profile'}
                    className="px-2 sm:px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title={user.name}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    <span className="hidden sm:inline">Chiqish</span>
                    <span className="sm:hidden">🚪</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/cart"
                    className="relative px-2 sm:px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title="Savat"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemsCount > 0 && (
                      <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-base hover:bg-primary-700 hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Ro'yxatdan o'tish</span>
                    <span className="sm:hidden">Ro'yxatdan o'tish</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
