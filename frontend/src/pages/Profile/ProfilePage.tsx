import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import styles from './profile.module.scss';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.profilePage}>
      <h1>Профиль пользователя</h1>
      
      <div className={styles.profileInfo}>
        <h2>Основная информация</h2>
        <p><strong>Имя:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <button 
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default ProfilePage;