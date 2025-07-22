import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import styles from './home.module.scss';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();

  return (
    <div className={styles.home}>
      <div className={styles.logoContainer}>
        <h1>Event Manager</h1>
      </div>
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
        {user && user.name && (
          <p className={styles.userGreeting}>
            Добро пожаловать, <strong>{user.name}</strong>!
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;