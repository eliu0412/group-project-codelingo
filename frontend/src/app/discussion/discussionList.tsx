import React from 'react';

interface Discussion {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  content: string;
}

interface DiscussionListProps {
  discussions: Discussion[];
}

const DiscussionList: React.FC<DiscussionListProps> = ({ discussions }) => {
  return (
    <div className="discussion-list">
      {discussions?.map((discussion) => (
        <div key={discussion.title} className="discussion-item">
          <h2>{discussion.title}</h2>
          <p>Author: {discussion.author}</p>
          <p>Date: {discussion.createdAt}</p>
          <a href={`/discussion/${discussion.content}`}>View Details</a>
        </div>
      ))}
    </div>
  );
};

export default DiscussionList;