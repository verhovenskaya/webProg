import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

export const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, запрашиваемая страница не существует.</p>
      <Link to="/" className={styles.homeLink}>
        Вернуться на главную
      </Link>
    </div>
  );
};
export default NotFound;