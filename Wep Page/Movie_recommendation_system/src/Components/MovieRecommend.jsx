import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner";
import axios from 'axios';
import { auth } from '../firebase';  
import { onAuthStateChanged } from 'firebase/auth';  
import './MV.css';

const genres = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "Film-Noir", "History", "Horror", "Music", "Musical",
  "Mystery", "Romance", "Sci-Fi", "Short", "Sport", "Thriller", "War", "Western"
];

export default function MovieRecommend() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [recommend, setRecommend] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('asc'); // State for sort order
  const [suggestions, setSuggestions] = useState([]); // State for genre suggestions
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('movieRecommendations'));
    if (savedData && savedData.recommend && savedData.recommend.length > 0) {
      setInput(savedData.input || '');
      setRecommend(savedData.recommend || []);
      setPage(savedData.page || 1);
      setFilter(savedData.filter || 'asc'); // Load saved sort order
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movieRecommendations', JSON.stringify({ input, recommend, page, filter }));
  }, [input, recommend, page, filter]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const sortRecommendations = (recommendations, sortOrder) => {
    return recommendations.slice().sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.vote_average - b.vote_average;
      } else {
        return b.vote_average - a.vote_average;
      }
    });
  };

  const getMovies = async (newPage = 1) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/recommend', { input, page: newPage });
      let newRecommendations;
      if (newPage === 1) {
        newRecommendations = res.data;
      } else {
        newRecommendations = [...recommend, ...res.data];
      }
      newRecommendations = sortRecommendations(newRecommendations, filter); // Apply sorting
      setRecommend(newRecommendations);
      setPage(newPage);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const val = e.target.value;
    setFilter(val);
    setRecommend(recommend => sortRecommendations(recommend, val));
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    // Update genre suggestions based on input
    if (val.length > 0) {
      const filteredSuggestions = genres.filter((genre) =>
        genre.toLowerCase().startsWith(val.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (genre) => {
    setInput(genre);
    setSuggestions([]);
  };

  if (!user) {
    return <LoadingSpinner />;  
  }

  return (
    <div className="movies">
      <div className="datasheet">
        <div className="inputDetails">
          <label htmlFor="Movie">Movie Genre/IMDB</label>
          <input
            type="text"
            name="Movie"
            id="movie_n"
            placeholder="Enter Any word about movie"
            value={input}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((genre, index) => (
                <li key={index} onClick={() => handleSuggestionClick(genre)}>
                  {genre}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="Submit">
          <button onClick={() => getMovies(1)}>Submit</button>
          <div className="filter">
            <label htmlFor="Filter">Filter By: </label>
            <select name="Filter" id="filtered" value={filter} onChange={(e) => handleFilter(e)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>
      <div className="results">
        <div className="list">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ul className="ul">
              {recommend.map((Movie, index) => (
                <li key={index} className="items" onClick={() => handleMovieClick(Movie.movie_id)}>
                  {Movie.poster_url && (
                    <img src={Movie.poster_url} className="listImage fade-in" alt={Movie.title} />
                  )}
                  <div className="movie_d">
                    Title: {Movie.title} <br />
                    IMDb score: {Movie.vote_average}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {recommend.length > 0 && !loading && (
          <div className="show">
            <button className="more" onClick={() => getMovies(page + 1)}>Show More</button>
          </div>
        )}
      </div>
    </div>
  );
}
