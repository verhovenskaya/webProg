import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import styles from './home.module.scss';
import { getToken, removeToken } from '../../utils/localStorageUtils.js';
import { getMe } from '../../api/auth';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuth, user, logout, setUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const token = getToken();
  setIsLoggedIn(!!token);

  const fetchUserData = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
      removeToken();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  if (token) {
    fetchUserData();
  }
}, [navigate, setUser]);

  const handleLogout = () => {
    removeToken();
    logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className={styles.home}>
      <header className={styles.siteHeader}>
    <nav className={styles.navigationBar}>
    <div className={styles.navLeft}>
  <button
    onClick={() => navigate('/')}
    className={styles.logoButton}
  >
    <div className={styles.logoContainer}>
      <h1>Event Manager</h1>
    </div>
  </button>
</div>
  <div className={styles.navRight}>
    {isAuth ? (
      <>
        {isAuth && user && (
          <div className={styles.profileBox}>
            <span>Профиль: {user?.name} ({user?.email})</span>
            {/* Можно добавить ссылку на страницу профиля */}
          </div>
        )}
        <button onClick={handleLogout} className={styles.navButton}>
          Выйти
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => navigate('/login')}
          className={styles.navButton}
        >
          Авторизация
        </button>
        <button
          onClick={() => navigate('/register')}
          className={styles.navButton}
        >
          Регистрация
        </button>
      </>
    )}
  </div>
</nav>

<div className={styles.userInfo}>
  {user && user.name ? (
    <p className={styles.userGreeting}>
      Добро пожаловать, <strong>{user.name}</strong>!
    </p>
  ) : (
    <p className={styles.userGreeting}>
    </p>
  )}
</div>
    </header>
      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <h2>Платформа для управления мероприятиями</h2>
          <p className={styles.description}>
            Организуйте мероприятия и отслеживайте события в одном месте.
          </p>

          <div className={styles.actions}>
          <button
          onClick={() => navigate('/events')}
          className={styles.button}
        >
              {isAuth ? 'Перейти к мероприятиям' : 'Посмотреть мероприятия'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;