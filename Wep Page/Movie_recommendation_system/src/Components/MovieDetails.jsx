import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MovieDetails.css';

const TMDB_API_KEY = '42ef72f608c1ec1efcf17368ae166783';

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(true); // New state for video loading
  const [feedback, setFeedback] = useState('');
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMovieVideo = async () => {
      setLoadingVideo(true);
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
        const video = res.data.results.find(video => video.type === 'Trailer');
        setVideo(video);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingVideo(false);
      }
    };

    fetchMovieDetails();
    fetchMovieVideo();
  }, [movieId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (feedback.trim() && user) {
      const reviewDocRef = doc(db, 'users', user.uid, 'moviereviews', movieId);
      try {
        await setDoc(reviewDocRef, {
          movie_title: movie.title,
          review: feedback,
          timestamp: new Date().toISOString()
        });
        toast.success('Review submitted successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { 
            backgroundColor: 'green',
            color:'white',
            fontWeight:'bold'
         },
        });
        setFeedback('');
      } catch (err) {
        console.error('Error submitting review:', err);
        toast.error('Failed to submit review. Please try again.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { 
            backgroundColor: 'red',
            color:'white',
            fontWeight:'bold'
         },
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (!user) {
      toast.error('You need to be logged in to submit a review.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { backgroundColor: 'red' },
      });
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="movie-details">
      <button onClick={() => navigate(-1) } className='btnBack'>Back</button>
      <div className="mc">
        <div className="moviepack">
          <h2>{movie.title}</h2>
          <div className="imgstory">
            <div className='imgdiv'>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className='imgPoster' alt={movie.title} />
            </div>
            <div className="tags">
              <p><strong>Overview:</strong> {movie.overview}</p>
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Rating:</strong> {movie.vote_average}</p>
            </div>
          </div>
          {loadingVideo ? (
            <LoadingSpinner />
          ) : (
            video ? (
              <>
                <h2>Trailer</h2>
                <div className="outerV">
                  <div className="video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </>
            ) : (
              <div className='notFound'>Video not found</div>
            )
          )}
          <div className="feedback-form">
            <h3>Leave a Review</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your review here..."
                rows="4"
                required
              ></textarea>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <div className="Lspinner"></div> : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
