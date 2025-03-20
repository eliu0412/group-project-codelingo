import React, { useEffect, useState } from 'react';
import background from "../../assets/landing.jpg"; // Import background image
import '../styles/general.css'; // Import existing general styles
import './lobbyPage.css'; // Import your specific lobby styles

interface Leader {
  username: string;
  rank: number;
}

const Lobby = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/user/top-users');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        
        // Directly set the leaders data without sorting
        setLeaders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaders();
  }, []);

  const handleMatch = () => {
    console.log('Match button clicked');
  };

  return (
    <div
      className="lobby page-background"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
      }}
    >
      <div className="page-content">
        <h1>Ranked Leaderboard</h1>

        {loading && <p>Loading leaderboard...</p>}
        {error && <p className="error">{error}</p>}

        {leaders.length > 0 && (
          <table className="leaderboard">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={index}>
                  <td>{leader.rank}</td>
                  <td>{leader.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={handleMatch} className="match-button">
          Match
        </button>
      </div>
    </div>
  );
};

export default Lobby;