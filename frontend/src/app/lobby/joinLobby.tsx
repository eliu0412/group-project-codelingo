import { useSocket } from "../../socketContext";
import background from "../../assets/landing.jpg";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function JoinLobby() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [warningMsg, setWarningMsg] = useState("");

  const handleJoinLobby = () => {
    const code = (document.querySelector("input") as HTMLInputElement).value;
    socket.emit("lobbyExists", code, (res: any) => {
      if (!res.exists) {
        setWarningMsg(res.message);
      } else {
        setWarningMsg("");
        navigate(`/player-lobby/${code}`, { state: { lobbyCode: code } });
      }
    });
  };

  return (
    <>
      <div
        style={{
          // borderRadius: "50px 50px 50px 50px",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          width: "100%",
        }}
        className="flex flex-col justify-center items-center"
      >
        <h1>Enter 6 Character Code</h1>
        <input
          type="text"
          placeholder="Enter Code"
          className="border-2 border-black rounded-lg p-2 max-w-md"
        ></input>
        <button
          onClick={handleJoinLobby}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Join
        </button>
        <p>{warningMsg}</p>
      </div>
    </>
  );
}

export default JoinLobby;
