import { Link, useLocation } from 'react-router-dom';

export default function AdminNav() {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Bosh sahifa' },
    { path: '/admin/restaurants', label: 'Restoranlar' },
    { path: '/admin/users', label: 'Foydalanuvchilar' },
    { path: '/admin/orders', label: 'Buyurtmalar' },
  ];

  return (
    <nav className="bg-white shadow-sm mb-6 overflow-x-auto">
      <div className="flex space-x-1 min-w-max">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap ${
              location.pathname === item.path
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

