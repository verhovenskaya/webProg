import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          Logo
        </div>

        <nav className={styles.nav}>
          <Link to="/events" className={styles.navLink}>
            Все мероприятия
          </Link>
          <Link to="/some-non-existent-page" className={styles.navLink}>
            Страница не найдена
          </Link>

          {isAuth ? (
            <div className={styles.profileDropdown}>
              <button className={styles.profileButton}>
                Профиль
              </button>
              <div className={styles.dropdownContent}>
                <div className={styles.profileInfo}>
                  <p>Имя: {user?.name}</p>
                  <p>Email: {user?.email}</p>
                </div>
                <button 
                  onClick={logout} 
                  className={styles.logoutButton}
                >
                  Выйти
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.navLink}>
                Авторизация
              </Link>
              <Link to="/register" className={styles.navLink}>
                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;