import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDiscussion } from './discussionApi';
import { useLocation } from 'react-router-dom';
import '../styles/general.css';
import './discussion.css';
import background from "../../assets/landing.jpg";
import { useAuth } from "../context/AuthContext";

const DiscussionForm: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const { previousPage, problemTitle, problemDescription } = location.state || {};
  const [newDiscussion, setNewDiscussion] = useState({
    title: problemTitle || '',
    content: problemDescription || '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDiscussion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscussion(newDiscussion, user);
      navigate('/discussions');
    } catch (error) {
      console.error('Failed to create discussion:', error);
    }
  };

  const handleBackToDiscussions = () => {
    navigate('/discussions');
  };

  const handleBackToProblem = () => {
    if (previousPage) {
        navigate(-1);
    }
    navigate('/problems');
  };

  return (
    <div
      className="discussions-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "10vh",
      }}
    >
        <h2 className="fade-in text-white text-3xl font-thick italic text-center mt-10 mb-5">
            "The important thing is not to stop questioning."
        </h2>
        <form onSubmit={handleSubmitForm}
          className="w-3/4 bg-gray-900 rounded-2xl shadow-2xl p-10">
            <label className="text-white font-thin italic">Title:</label>
            <input
                type="text"
                name="title"
                value={newDiscussion.title}
                onChange={handleFormChange}
                required
                className="w-full p-3 mt-2 mb-4 bg-gray-800 rounded-md text-white"
            />
            <label className="text-white font-thin italic">Content:</label>
            <textarea
                name="content"
                value={newDiscussion.content}
                onChange={handleFormChange}
                required
                className="w-full p-3 mt-2 mb-4 bg-gray-800 rounded-md text-white"
                style={{ minHeight: '200px' }}
            />
            <div className="flex justify-center gap-5 mt-8">
                <button
                type="button"
                onClick={handleBackToDiscussions}
                className="bg-transparent border border-[#666] cursor-pointer rounded-md text-lg leading-tight text-white px-9 py-4 transition duration-300 hover:bg-[rgba(41,41,82,0.9)] active:bg-[rgba(32,32,65,0.9)]">
                    Back to Discussions
                </button>
                <button type="submit" className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md cursor-pointer text-lg leading-tight transition duration-300 hover:bg-[#512fcace] active:bg-[#381aa2ce]">
                    Submit
                </button>
                <button type="button" onClick={handleBackToProblem} className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md cursor-pointer text-lg leading-tight transition duration-300 hover:bg-[#512fcace] active:bg-[#381aa2ce]">
                    Back to Problem
                </button>
            </div>
        </form>
    </div>
  );
};

export default DiscussionForm;
