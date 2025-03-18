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
    const sampleData: Leader[] = [
      { username: 'User1', rank: 1 },
      { username: 'User2', rank: 2 },
      { username: 'User3', rank: 3 },
      { username: 'User4', rank: 4 },
      { username: 'User5', rank: 5 },
    ];

    setLeaders(sampleData);
    setLoading(false);
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
        <h1>Lobby</h1>

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