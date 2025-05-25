import React, { useEffect, useState } from "react";
import styles from "./styles/PeopleSuggestions.module.css";

const PeopleSuggestions = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recommended people on mount
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch("/recommended");
        const data = await res.json();
        setPeople(data);
      } catch (err) {
        console.error("Error fetching recommended people:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  const handleConnect = async (userId) => {
    try {
      const res = await fetch(`/connect/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Connection request sent!");
        // Optionally remove from list or refresh
        setPeople(prev => prev.filter(p => p.id !== userId));
      } else {
        const errText = await res.text();
        alert(`Failed to connect: ${errText}`);
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  if (loading) return <p>Loading suggestions...</p>;

  return (
    <div className={styles.peopleSuggestions}>
      <h2>People You May Know</h2>
      {people.length === 0 ? (
        <p>No suggestions at the moment.</p>
      ) : (
        people.map((person) => (
          <div key={person.id} className={styles.person}>
            <img
              src={person.profilePic || "/default-avatar.png"}
              alt={person.name}
              className={styles.profilePic}
            />
            <div>
              <h3>{person.name}</h3>
              <p>{person.role || "Alumni"}</p>
              <button onClick={() => handleConnect(person.id)}>Connect</button>
            </div>
          </div>
        ))
      )}
      <a href="/network">See more connections</a>
    </div>
  );
};

export default PeopleSuggestions;
