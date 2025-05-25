function LogoutButton({ setUser }) {
  const handleLogout = () => {
    fetch("http://localhost:8081/logout", {
      method: "POST",
      credentials: "include", // important for session cookies
    })
      .then(() => {
        setUser(null); // clear user state
        window.location.href = "/login"; // redirect to login
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
