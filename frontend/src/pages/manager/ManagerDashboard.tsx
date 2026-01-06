import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import ManagerNav from '../../components/ManagerNav';
import ManagerHome from './ManagerHome';
import ManagerRestaurant from './ManagerRestaurant';
import ManagerMenu from './ManagerMenu';
import ManagerOrders from './ManagerOrders';

export default function ManagerDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ManagerNav />
        <Routes>
          <Route index element={<ManagerHome />} />
          <Route path="restaurant" element={<ManagerRestaurant />} />
          <Route path="menu" element={<ManagerMenu />} />
          <Route path="orders" element={<ManagerOrders />} />
        </Routes>
      </div>
    </Layout>
  );
}

