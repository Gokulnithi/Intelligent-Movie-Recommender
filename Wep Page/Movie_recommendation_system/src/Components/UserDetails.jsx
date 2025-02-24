import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDetails.css';

const TMDB_API_KEY = '42ef72f608c1ec1efcf17368ae166783';  // Replace with your TMDB API key

function UserDetails() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [deletingReviewId, setDeletingReviewId] = useState(null); // State to track the ID of the review being deleted
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch user reviews
        const reviewsCollection = collection(db, 'users', currentUser.uid, 'moviereviews');
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const userReviews = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          userId: currentUser.uid, // Ensure userId is included in each review
        }));

        // Fetch posters for reviews
        const reviewsWithPosters = await Promise.all(userReviews.map(async (review) => {
          const posterUrl = await getMoviePoster(review.movie_title);
          return { ...review, posterUrl };
        }));

        setReviews(reviewsWithPosters);
        setLoadingReviews(false);
      } else {
        setUser(null);
        setUserData(null);
        setReviews([]);
        setLoadingReviews(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getMoviePoster = async (title) => {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${title}`;
    try {
      const response = await axios.get(searchUrl);
      const data = response.data;
      if (data.results && data.results.length > 0) {
        return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
      }
    } catch (error) {
      console.error('Error fetching poster:', error);
    }
    return null;
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) return;
    setDeletingReviewId(reviewId); // Set the ID of the review being deleted
    try {
      const reviewDocRef = doc(db, 'users', user.uid, 'moviereviews', reviewId);
      await deleteDoc(reviewDocRef);
      setReviews(reviews.filter(review => review.id !== reviewId));
      alert('Review deleted successfully!');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeletingReviewId(null); // Reset the ID after deletion is complete
    }
  };

  const handleSelectReview = (review) => {
    navigate(`/review/${review.id}`, { state: { review } });
  };

  if (!user || !userData) return <LoadingSpinner />;
  
  return (
    <div className="user-details">
      <h2>User Details</h2>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Age:</strong> {userData.age}</p>

      <h3>User Reviews</h3>
      {loadingReviews ? (
        <LoadingSpinner />
      ) : reviews.length > 0 ? (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item" onClick={() => handleSelectReview(review)}>
              <div className="imgreview">
                {review.posterUrl && <img src={review.posterUrl} alt={`${review.movie_title} poster`} className="poster" />}
              </div>
              <div className='det'>
                <p><strong>Movie:</strong> {review.movie_title}</p>
                <p><strong>Timestamp:</strong> {new Date(review.timestamp).toLocaleString()}</p>
              </div>
              <div className="del">
                <button onClick={(e) => { e.stopPropagation(); handleDeleteReview(review.id); }} className="delete-button">
                  {deletingReviewId === review.id ? <div className="Lspinner"></div> : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}

export default UserDetails;
