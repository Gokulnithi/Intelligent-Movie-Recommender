import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ReviewDetailPage.css';

function ReviewDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { review } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review.review);
  const [currentReview, setCurrentReview] = useState(review);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading
  const [isUpdating, setIsUpdating] = useState(false); // New state for loading
  if (!review) return <p>No review selected.</p>;

  const handleBack = () => {
    navigate('/Users');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditReview = async () => {
    try {
        setIsUpdating(true)
      const reviewDocRef = doc(db, 'users', review.userId, 'moviereviews', review.id);
      await updateDoc(reviewDocRef, { review: editedReview });
      alert('Review updated successfully!');
      setIsEditing(false); // Exit editing mode after update
      // Update the current review state to reflect the changes
      setCurrentReview((prev) => ({ ...prev, review: editedReview }));
    } catch (err) {
      console.error('Error updating review:', err);
      alert('Failed to update review. Please try again.');
    }finally{
        setIsUpdating(false)
    }
  };
  const handleDeleteReview = async () => {
    try {
      setIsSubmitting(true)
      const reviewDocRef = doc(db, 'users', review.userId, 'moviereviews', review.id);
      await deleteDoc(reviewDocRef);
      alert('Review deleted successfully!');
      navigate('/Users');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }finally{
      setIsSubmitting(false)
    }
  };

  return (
    <div className="review-detail-page">
      <button onClick={handleBack} className='back'>Back</button>
      <div className="container">
        <div className="content">
          <div className="poster">
            <img src={currentReview.posterUrl} alt={currentReview.title} />
          </div>
          <h3>Review for {currentReview.movie_title}</h3>
          {isEditing ? (
            <>
              <textarea
                value={editedReview}
                onChange={(e) => setEditedReview(e.target.value)}
                rows="5"
                cols="50"
              />
              <button onClick={handleEditReview} className='green'>{isUpdating ? <div className="Lspinner"></div> : 'Post'}</button>
            </>
          ) : (
            <>
              <p>{currentReview.review}</p>
              <button onClick={handleEditClick} className='green'>Edit Review</button>
            </>
          )}
          <p><strong>Timestamp:</strong> {new Date(currentReview.timestamp).toLocaleString()}</p>
          <button onClick={handleDeleteReview} className='red'>{isSubmitting ? <div className="Lspinner"></div> : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewDetailPage;
