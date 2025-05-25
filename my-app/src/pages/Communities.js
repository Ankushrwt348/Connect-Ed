import React from 'react';
import styles from '../styles/Communities.module.css';

function Communities() {
  const communities = [
    {
      id: 1,
      name: "Web Developers Hub",
      description: "A community for web developers to share knowledge, discuss trends, and collaborate on projects",
      members: "2.5k members",
      rating: "4.8",
      admin: {
        name: "John Doe",
        role: "Senior Developer",
        image: "/path-to-image/john.jpg"
      }
    },
    {
      id: 2,
      name: "Design Enthusiasts",
      description: "Connect with designers worldwide, share portfolios, and get feedback on your work",
      members: "1.8k members",
      rating: "4.9",
      admin: {
        name: "Sarah Smith",
        role: "UX Designer",
        image: "/path-to-image/sarah.jpg"
      }
    },
    {
      id: 3,
      name: "AI & ML Community",
      description: "Join discussions about artificial intelligence, machine learning, and data science",
      members: "3.2k members",
      rating: "4.7",
      admin: {
        name: "Mike Johnson",
        role: "AI Researcher",
        image: "/path-to-image/mike.jpg"
      }
    },
    {
      id: 4,
      name: "Mobile Developers",
      description: "A community for mobile app developers to discuss iOS, Android, and cross-platform development",
      members: "2.1k members",
      rating: "4.6",
      admin: {
        name: "Emily Chen",
        role: "Mobile Developer",
        image: "/path-to-image/emily.jpg"
      }
    },
    {
      id: 5,
      name: "Cloud Computing Experts",
      description: "Connect with cloud professionals to discuss AWS, Azure, GCP, and cloud-native solutions",
      members: "1.5k members",
      rating: "4.7",
      admin: {
        name: "Alex Turner",
        role: "Cloud Architect",
        image: "/path-to-image/alex.jpg"
      }
    },
    {
      id: 6,
      name: "DevOps Network",
      description: "Share experiences and best practices in DevOps, CI/CD, and infrastructure automation",
      members: "1.9k members",
      rating: "4.8",
      admin: {
        name: "David Kim",
        role: "DevOps Engineer",
        image: "/path-to-image/david.jpg"
      }
    }
  ];

  return (
    <div className={styles.communities}>
      <h1>Communities</h1>
      <p className={styles.subtitle}>
        Join our vibrant communities and connect with like-minded individuals
      </p>

      <div className={styles.communitiesGrid}>
        {communities.map(community => (
          <div key={community.id} className={styles.communityCard}>
            <div className={styles.cardHeader}>
              <span className={styles.memberCount}>
                <i className="fas fa-users"></i> {community.members}
              </span>
              <span className={styles.rating}>
                ⭐ {community.rating}
              </span>
            </div>

            <h2>{community.name}</h2>
            <p className={styles.description}>{community.description}</p>

            <div className={styles.admin}>
              <img src={community.admin.image} alt={community.admin.name} className={styles.adminImage} />
              <div className={styles.adminInfo}>
                <p className={styles.adminName}>{community.admin.name}</p>
                <p className={styles.adminRole}>{community.admin.role}</p>
              </div>
            </div>

            <button className={styles.joinButton}>Join Community</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Communities;