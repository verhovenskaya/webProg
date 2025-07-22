// pages/Profile/profile.tsx
import { useAuth } from '../../utils/useAuth';
import styles from './profile.module.scss';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className={styles.profileContainer}>
      <h2>Профиль пользователя</h2>
      {user && (
        <div className={styles.userDetails}>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
};