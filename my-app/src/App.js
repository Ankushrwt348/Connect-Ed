import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Network from './pages/Network';
import Meetups from './pages/Meetup';
import Communities from './pages/Communities';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OAuth2Success from "./components/OAuth2Succes";
import LogoutButton from './components/LogoutButton';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminDashboard';
import styles from './styles/App.module.css';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/api/user-info', {  // <-- fixed URL here
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user info');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoadingUser(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingUser(false);
      });
  }, []);

  if (loadingUser) return <p>Loading user info...</p>;

  // Consistent email check for admin
  const isAdmin = user?.email === "rawatankush348@gmail.com";

  return (
    <Router>
      <div className={styles.app}>
        <nav className={styles.navbar}>
          <NavLink to="/" className={styles.logoContainer}>
            <img src="/logo.png" alt="Connect-ed logo" className={styles.logo} />
          </NavLink>
          <div className={styles.navLinks}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : undefined} end>
              Home
            </NavLink>
            <NavLink to="/meetups" className={({ isActive }) => isActive ? styles.active : undefined}>
              Meetups
            </NavLink>
            <NavLink to="/communities" className={({ isActive }) => isActive ? styles.active : undefined}>
              Communities
            </NavLink>
            <NavLink to="/network" className={({ isActive }) => isActive ? styles.active : undefined}>
              Network
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : undefined}>
                Admin
              </NavLink>
            )}
          </div>

          <div className={styles.rightSection}>
            {!user ? (
              <>
                <NavLink to="/signin" className={({ isActive }) => isActive ? styles.active : styles.signInButton}>
                  Sign In
                </NavLink>
                <NavLink to="/signup" className={({ isActive }) => isActive ? styles.active : styles.signUpButton}>
                  Sign Up
                </NavLink>
              </>
            ) : (
              <div className={styles.userSection}>
                <div className={styles.userProfile}>
                  <NavLink to="/profile">
                    <img
                      src={user.picture || user.imageUrl || "/default-avatar.png"}
                      alt="Profile"
                      className={styles.profilePic}
                    />
                  </NavLink>
                </div>
                <LogoutButton setUser={setUser} />
              </div>
            )}
          </div>
        </nav>

        <main className={styles.mainContent}>
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn setUser={setUser} />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="/oauth2/success" element={<OAuth2Success />} />

            {/* Private Routes */}
            <Route path="/" element={
              <PrivateRoute user={user}>
                <Home user={user} />
              </PrivateRoute>
            } />

            <Route path="/meetups" element={
              <PrivateRoute user={user}>
                <Meetups />
              </PrivateRoute>
            } />

            <Route path="/communities" element={
              <PrivateRoute user={user}>
                <Communities />
              </PrivateRoute>
            } />

            <Route path="/network" element={
              <PrivateRoute user={user}>
                <Network />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute user={user}>
                <Profile user={user} />
              </PrivateRoute>
            } />

            {/* Admin Route */}
            <Route path="/admin" element={
              <PrivateRoute user={user}>
                {isAdmin ? <AdminPanel /> : <Navigate to="/" replace />}
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;