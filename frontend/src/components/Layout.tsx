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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-2xl">🍕</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900 block">FoodDelivery</span>
                <span className="text-xs text-gray-500">Tez ovqat yetkazib berish</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.role === UserRole.CUSTOMER && (
                    <>
                      <Link
                        to="/cart"
                        className="relative px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                      >
                        <span className="relative">
                          Savat
                          {cartItemsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {cartItemsCount > 99 ? '99+' : cartItemsCount}
                            </span>
                          )}
                        </span>
                      </Link>
                      <Link
                        to="/orders"
                        className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                      >
                        Buyurtmalar
                      </Link>
                    </>
                  )}
                  <Link
                    to={getDashboardLink() || '/profile'}
                    className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title={user.name}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/cart"
                    className="relative px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title="Savat"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemsCount > 0 && (
                      <span className="absolute top-1 right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 hover:shadow-lg transition-all"
                  >
                    Ro'yxatdan o'tish
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
