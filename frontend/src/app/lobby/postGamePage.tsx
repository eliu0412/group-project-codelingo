import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import hooks from React Router
import background from "../../assets/landing.jpg"; // Import background image for styling
import "../styles/general.css"; // Import general styles
import "./postGamePage.css"; // Import specific review page styles
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../../socketContext";

interface GameData {
  username: string;
  score: number;
  lastMatchResult: string;
}

const PostGameReview = () => {
  const location = useLocation();
  const socket = useSocket();
  const { username } = useParams<{ username: string }>(); // Extract username from URL
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState([]);
  const lobbyCode = location.state?.lobbyCode || null;
  const [score, setScore] = useState(location.state?.finalScore || 0);
  //const history = useHistory();

  const navigate = useNavigate();

  useEffect(() => {
    if (socket && lobbyCode) {
      socket.emit("updateScore", lobbyCode);
    }
  }, []);

  function sortByScore(obj) {
    return Object.entries(obj)
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score);
  }

  useEffect(() => {
    if (socket) {
      socket.on("updateScoreEvent", (scores) => {
        const sortedPlayers = sortByScore(scores);
        setPlayers(sortedPlayers);
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/user/gamescore?username=${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch game data");
        }
        const data = await response.json();

        setGameData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [username]); // Re-run fetch when the username parameter changes

  const handleNewGame = () => {
    navigate("/join-lobby");
  };

  return (
    <div
      className="review page-background"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      <div className="page-content">
        <h1>Post Game Review</h1>

        {loading && <p>Loading game data...</p>}
        {error && <p className="error">{error}</p>}

        {lobbyCode && (
          <div>
            {players.map((player, index) => {
              return (
                <div key={index} className="player-score text-black">
                  <p>
                    <span className="text-black">
                      {index + 1}. {Object.keys(player)[0]} {player.score}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {!lobbyCode && (
          <div>
            <p>
              <span className="text-black">Score: {score}</span>
            </p>
          </div>
        )}

        {gameData && (
          <div
            className={`game-summary ${gameData.lastMatchResult.toLowerCase()}`}
          >
            <p>
              <strong>Username:</strong> {gameData.username}
            </p>
            <p>
              <strong>Score:</strong> {gameData.score}
            </p>
            <p>
              <strong>Last Match Result:</strong>
              {gameData.lastMatchResult === "win" ? (
                <span className="win">Win 🏆</span>
              ) : (
                <span className="loss">Loss 😞</span>
              )}
            </p>
          </div>
        )}

        <div className="button-group">
          <button
            onClick={handleNewGame}
            className="bg-blue-500 p-2 rounded-3xl hover:bg-blue-700 transition"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostGameReview;
