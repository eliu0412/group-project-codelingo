import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config.ts';
const { disc } = config.api;
import { useAuth } from "../context/AuthContext";

const DiscussionDetail = () => {
    const { user } = useAuth();
    const { id } = useParams(); // Get discussion ID from URL
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Fetch discussion details
        const fetchDiscussion = async () => {
            try {
                const response = await axios.get(`${disc}/user/discussion/${id}`);
                console.log(response.data);
                setDiscussion(response.data);
                setComments(response.data.comments || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDiscussion();
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`${disc}/user/discussion/${id}/comment`, {
                content: newComment,
            });
            setComments([...comments, { content: newComment, author: user.uid, createdAt: Date.now() }]);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    if (!discussion) return <p>Loading...</p>;

    return (
      <div className="discussion-detail-container">
            <div className="discussion-header">
                <h1 className="discussion-title">{discussion.title}</h1>
                <p className="discussion-content">{discussion.content}</p>
                <p className="discussion-author"><strong>Author:</strong> {discussion.author}</p>
            </div>
            <hr />
            <div className="comments-section">
                <h2 className="comments-title">Comments</h2>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p className="comment-content">{comment.content}</p>
                            <p className="comment-meta">
                                <small>By {comment.author} on {new Date(comment.createdAt).toLocaleString()}</small>
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                )}
                </div>
            <hr />
            <div className="add-comment-section">
                <h3 className="add-comment-title">Add a Comment</h3>
                <textarea
                    className="comment-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="4"
                    cols="50"
                    placeholder="Write your comment here..."
                />
                <br />
                <button className="submit-comment-button" onClick={handleAddComment}>Submit</button>
            </div>
        </div>
    );
  };

export default DiscussionDetail;