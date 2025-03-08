import "./App.css";
import Navbar from "./app/shared-components/Navbar";
import Landing from "./app/home/landing";
import About from "./app/home/about";
import Contact from "./app/home/contact";
import DiscussionsPage from "./app/discussion/discussionPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./app/registration/registrationPage";
import Login from "./app/login/loginPage";
import ProblemPage from "./app/questions/problemPage";
import CodingPage from "./app/questions/codingPage";
import GeneratedProblemPage from "./app/questions/generatedProblemPage";
import DiscussionFormPage from './app/discussion/discussionFormPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/discussions/new-discussion" element={<DiscussionFormPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/problems" element={<ProblemPage />} />
          <Route path="/coding" element={<CodingPage />} />
          <Route path="/problems/generated" element={<GeneratedProblemPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
