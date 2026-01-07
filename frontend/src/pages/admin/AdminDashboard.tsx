import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import AdminNav from '../../components/AdminNav';
import AdminHome from './AdminHome';
import AdminRestaurants from './AdminRestaurants';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminProfile from './AdminProfile';

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNav />
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </Layout>
  );
}

