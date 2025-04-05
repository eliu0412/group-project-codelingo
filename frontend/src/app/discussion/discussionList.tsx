import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Comment {
  content: string;
  author: string;
  username: string;
  createdAt: string;
}

export interface Discussion {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  comments: Comment[];
}

interface DiscussionListProps {
  discussions: Discussion[];
}

const DiscussionList: React.FC<DiscussionListProps> = ({ discussions }) => {
  const navigate = useNavigate();

  const handleViewDetails = (discussionId: number) => {
    navigate(`/discussion/${discussionId}`); // Pass only the ID in the URL
  };

  return (
    <div className="discussion-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-8 w-full max-w-7xl">
      {discussions
        ?.filter(discussion => discussion.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8)
        .map((discussion) => (
          <div
            key={discussion.id}
            className="bg-gray-900 rounded-2xl shadow-2xl p-6 transition transform hover:scale-[1.01] max-w-full"
          >
            <h2 className="text-white text-xl font-bold mb-2 truncate">
              {discussion.title}
            </h2>
            <p className="text-gray-400 font-medium text-sm truncate">
              By {discussion.author}
            </p>
            <p className="text-gray-500 text-xs mb-4 truncate">
              {new Date(discussion.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4">
              <button
                onClick={() => handleViewDetails(discussion.id)}
                className="bg-[#5a3dc3ce] text-white px-4 py-2 rounded-md cursor-pointer text-sm transition duration-300 hover:bg-[#512fcace] active:bg-[#381aa2ce]"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DiscussionList;