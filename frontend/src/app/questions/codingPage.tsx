import { useState } from "react";
import background from "../../assets/landing.jpg";
import CodeEditor from "./codeEditor";
import Timer from "./timer";
import { useLocation, useNavigate } from "react-router-dom";
import { saveUserData } from './problemApi';
import { useAuth } from "../context/AuthContext";

function CodingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dailyChallenge] = useState(location.state?.dailyChallenge || false);
  const [problem] = useState(location.state?.problem || {});
  const [problemIndex] = useState(location.state?.problemIndex || 0);

  const [points] = useState(location.state?.points || 0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const { user } = useAuth();

  

  const handleSubmit = async () => {
    if (!dailyChallenge) return;

    const finalScore = Math.max(Math.floor(score * 10000 - elapsedTime * 5 + points), 0);
    console.log("Final Score:", finalScore);

    if (!problem[problemIndex + 1]) {
      console.log("No more problems available.");
      await saveUserData({
        uid: user.uid,
        email: user.email,
        username: user.displayName,
        score: points
      });
      console.log("User data saved successfully.");
      navigate("/lobby", { state: { refresh: true } });
      return;
    }
    
    switch (problem[problemIndex + 1].problemType) {
      case "coding":
        navigate("/coding", { state: { problem: problem, problemIndex: problemIndex + 1, dailyChallenge: true, points: finalScore } });
        break;
      case "mcq":
        navigate("/mcq", { state: { problem: problem, problemIndex: problemIndex + 1, dailyChallenge: true, points: finalScore } });
        break;
      case "fill":
        navigate("/fill-in-the-blank", {state: { problem: problem, problemIndex: problemIndex + 1, dailyChallenge: true, points: finalScore }});
        break;
      default:
        break;
    }
  }

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
        <Timer onTimeUpdate={setElapsedTime} />
        <CodeEditor onResultUpdate={setScore} />
        {dailyChallenge && (
          <div>
            <button 
                onClick={handleSubmit}
                className="bg-[#5a3dc3ce] text-white
                px-6 py-3 border-none rounded-md
                cursor-pointer text-lg transition
                duration-300 mt-2 hover:bg-[#512fcace]
                active:bg-[#381aa2ce]"
                > Submit</button>
          </div>
        )}
        
      </div>
    </>
  );
}

export default CodingPage;