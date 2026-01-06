import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import RestaurantPage from './pages/public/RestaurantPage';
import CartPage from './pages/public/CartPage';
import OrdersPage from './pages/public/OrdersPage';
import ProfilePage from './pages/public/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import CookDashboard from './pages/cook/CookDashboard';
import CourierDashboard from './pages/courier/CourierDashboard';
import { UserRole } from './types';

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles: UserRole[] }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cook/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.COOK]}>
                <CookDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courier/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.COURIER]}>
                <CourierDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

