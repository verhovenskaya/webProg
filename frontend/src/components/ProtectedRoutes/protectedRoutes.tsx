import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { useEffect, useState } from 'react';
import { isValidToken } from '../../utils/localStorageUtils';

const ProtectedRoute = () => {
  const { isAuth, loading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Дополнительная проверка токена при монтировании
    const token = localStorage.getItem('token');
    if (!token || !isValidToken(token)) {
      localStorage.removeItem('token');
    }
    setIsCheckingAuth(false);
  }, []);

  if (loading || isCheckingAuth) {
    return <div>Проверка авторизации...</div>; // Или компонент загрузки
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;