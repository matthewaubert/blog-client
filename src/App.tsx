import { Outlet } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import Header from './components/Header';

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
    </AuthProvider>
  );
}
