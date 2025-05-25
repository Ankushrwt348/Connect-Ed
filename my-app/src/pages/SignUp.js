import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Auth.module.css';

function SignUp({ setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('registration');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef(null);
  const fullNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setError('');
    if (step === 'otp') {
      otpInputRef.current?.focus();
    } else if (step === 'registration') {
      fullNameInputRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setStep('otp');
        setResendCooldown(60);
      } else {
        const errText = await response.text();
        setError(`Signup failed: ${errText}`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8081/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...userData, otp })
      });
  
      if (response.ok) {
        const userInfoRes = await fetch('http://localhost:8081/api/user-info', {
          credentials: 'include'
        });
  
        if (!userInfoRes.ok) throw new Error('Failed to fetch user info');
        const user = await userInfoRes.json();
        setUser(user);
  
        // New logic here:
        if (user.email === 'rawatankush348@gmail.com') {
          if (user.status && user.status.toLowerCase() === 'approved') {
            // Approved admin goes to home page
            navigate('/');
          } else {
            // Admin not approved — block access
            setError('Your admin account is not approved. Access blocked.');
            // Optionally, you can log out user or redirect to a blocked page
          }
        } else {
          // For normal users, you can check their status too if needed
          if (user.status && user.status.toLowerCase() === 'approved') {
            navigate('/');
          } else {
            setError('Your account is not approved. Access blocked.');
          }
        }
      } else {
        const errText = await response.text();
        setError(`OTP verification failed: ${errText}`);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('An error occurred during OTP verification');
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8081/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email })
      });

      if (response.ok) {
        setResendCooldown(60);
      } else {
        const errText = await response.text();
        setError(`Resend OTP failed: ${errText}`);
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('An error occurred during OTP resend');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2>Verify Your Email</h2>
          <p className={styles.otpMessage}>
            Please enter the verification code sent to {userData.email}
          </p>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <form className={styles.authForm} onSubmit={handleOTPVerification}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength="6"
              required
              disabled={loading}
              ref={otpInputRef}
              inputMode="numeric"
            />
            <button type="submit" disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <button
            onClick={handleResendOTP}
            disabled={loading || resendCooldown > 0}
            className={styles.resendButton}
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Create Account</h2>

        <button
          onClick={handleGoogleLogin}
          className={styles.googleButton}
          disabled={loading}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            style={{ width: '20px', marginRight: '8px' }}
          />
          Continue with Google
        </button>

        <div className={styles.divider}>or</div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form className={styles.authForm} onSubmit={handleRegistration}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={userData.fullName}
            onChange={handleInputChange}
            required
            disabled={loading}
            ref={fullNameInputRef}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
            ref={emailInputRef}
          />
          <div className={styles.passwordWrapper} style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              ref={passwordInputRef}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Continuing...' : 'Continue'}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
