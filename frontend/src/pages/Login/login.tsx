import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.scss';

export const LoginPage = () => {
  const { login, error, loading, isAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate('/events', { replace: true });
    }
  }, [isAuth, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Вход в систему</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <button
          type="button"
          className={styles.submitButton}
          style={{ marginTop: 16 }}
          onClick={() => navigate('/register')}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default LoginPage;