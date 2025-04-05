import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.tsx";
import '../styles/general.css';
import './discussion.css';
import background from "../../assets/landing.jpg";
import { addComment, getDiscussionById } from './discussionApi.ts';

const DiscussionDetail = () => {
    const { user } = useAuth(); // Get user from auth context
    const { id } = useParams(); // Get discussion ID from URL
    const [discussion, setDiscussion] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); // Loading state to handle async fetching

    useEffect(() => {
        if (id) {
            // Fetch the discussion by ID
            getDiscussionById(id)
                .then(discussionData => {
                    setDiscussion(discussionData); // Set discussion data
                    setComments(discussionData.comments || []); // Set comments
                    setLoading(false); // Set loading to false when data is fetched
                })
                .catch((err) => {
                    console.error("Error fetching discussion:", err.message);
                    setLoading(false); // Set loading to false on error
                });
        }
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return; // Prevent adding empty comment
    
        if (!user) {
            return alert("You must be logged in to comment");
        }
    
        try {
            const newCommentData = await addComment(id, { content: newComment }, user);
            setComments([...comments, newCommentData]); // Add new comment to the list
            setNewComment(''); // Clear input field

            const updatedDiscussion = await getDiscussionById(id);
            setComments(updatedDiscussion.comments || []);
        } catch (err) {
            console.error("Error adding comment:", err);
            // Handle error (could show an error message)
        }
    };

    if (loading) return <p>Loading...</p>; // Show loading message while fetching data
    if (!discussion) return <p>Discussion not found</p>; // If no discussion, show error

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
            <div className="discussion-detail-container bg-gray-900 rounded-2xl shadow-2xl p-10 mt-10" style={{ width: "1000px" }}>
                <h3 className="text-white text-3xl font-thick">{discussion.title}</h3>
                
                <div className="discussion-content-box mt-5">
                    <label className="text-white font-thick">Content:</label>
                    <textarea
                        className="text-white bg-gray-800 p-4 rounded-md w-full mt-2"
                        value={discussion.content}
                        rows={6}
                        readOnly
                    />
                </div>
                
                <div className="discussion-author mt-5">
                    <label className="text-white font-thick">Author:</label>
                    <p className="text-white">{discussion.author}</p>
                </div>

                <hr className="my-5" />

                <div className="add-comment-section">
                    <label className="text-white font-thick">Add a Comment:</label>
                    <textarea
                        className="text-white bg-gray-800 p-4 rounded-md w-full"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        placeholder="Write your comment here..."
                    />
                    <button
                        className="bg-[#5a3dc3ce] text-white px-9 py-4 rounded-md cursor-pointer text-lg mt-4
                            transition duration-300 hover:bg-[#512fcace] active:bg-[#381aa2ce]"
                        onClick={handleAddComment}
                    >
                        Submit
                    </button>
                </div>

                <hr className="my-5" />
                
                <div>
                    <label className="text-white font-thick">Comments:</label>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="comment mt-4 p-4 bg-gray-800 rounded-md">
                                <p className="text-white">{comment.content}</p>
                                <p className="text-gray-400">
                                    <small>By {comment.username}, {new Date(comment.createdAt).toLocaleString()}</small>
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscussionDetail;