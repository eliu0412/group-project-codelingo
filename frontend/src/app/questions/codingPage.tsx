import { useState } from "react";
import background from "../../assets/landing.jpg";
import CodeEditor from "./codeEditor";
import Timer from "./timer";
import { useLocation, useNavigate } from "react-router-dom";

function CodingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dailyChallenge] = useState(location.state?.dailyChallenge || false);
  const [problem] = useState(location.state?.problem || {});
  const [problemIndex] = useState(location.state?.problemIndex || 0);

  const handleSubmit = async () => {
    if (!dailyChallenge) return;

    if (!problem[problemIndex + 1]) {
      navigate("/lobby");
      return;
    }
    switch (problem[problemIndex + 1].problemType) {
      case "coding":
        navigate("/coding", { state: { problem: problem, problemIndex: problemIndex + 1, dailyChallenge: true } });
        break;
      case "mcq":
        navigate("/mcq", { state: { problem: problem, problemIndex: problemIndex + 1, dailyChallenge: true } });
        break;
      case "fill":
        navigate("/fill-in-the-blank", {state: { problem: problem, problemIndex: problemIndex + 1, dailyChallenge: true }});
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
        <Timer />
        <CodeEditor />
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
