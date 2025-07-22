import { useState } from 'react';
import { useAuth } from '../../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.scss';

export const RegisterPage = () => {
  const { register, error, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/login', { replace: true });
    } catch {}
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <button
          type="button"
          className={styles.submitButton}
          style={{ marginTop: 16 }}
          onClick={() => navigate('/login')}
        >
          Уже есть аккаунт? Войти
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;