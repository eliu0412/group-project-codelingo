import React from 'react';

export interface Discussion {
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
        <div
          key={discussion.id}
          className="discussion-item"
        >
          <h2 className="title">{discussion.title}</h2>
          <p className="author">By {discussion.author}</p>
          <p className="date">{new Date(discussion.createdAt).toLocaleDateString()}</p>
          <div className="mt-4">
            <a
              href={`/discussion/${discussion.id}`}
              className="view-details"
            >
              View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiscussionList;