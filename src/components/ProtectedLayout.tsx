import { Outlet } from 'react-router-dom';
import { Layout } from './Layout';

export default function ProtectedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
