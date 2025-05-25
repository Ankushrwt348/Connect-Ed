import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/SignIn.module.css';

function SignIn({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userInfoRes = await fetch('http://localhost:8081/api/user-info', {
          credentials: 'include',
        });

        if (!userInfoRes.ok) throw new Error('Failed to fetch user info');

        const user = await userInfoRes.json();
        setUser(user);

        if (user.email === 'rawatankush348@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const error = await response.text();
        alert(`Login failed: ${error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during sign-in');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInCard}>
        <h2>Welcome Back</h2>
        <p>Please sign in to your account</p>

        <button
          onClick={handleGoogleLogin}
          className={styles.googleButton}
          aria-label="Continue with Google"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            style={{ width: '20px', marginRight: '8px' }}
          />
          Continue with Google
        </button>

        <div className={styles.divider}>or</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.signInButton}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.signUpText}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
