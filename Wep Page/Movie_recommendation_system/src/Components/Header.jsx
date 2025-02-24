import React, { useEffect, useState } from 'react';
import { Link, useResolvedPath, useMatch, useNavigate } from "react-router-dom";
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function CompoCustom({ children, to, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      style={{ fontWeight: match ? "bold" : "normal", display: 'flex', justifyContent: 'center' }}
      className={match ? "active" : ""}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate(); // Add useNavigate hook

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setProfilePic(userDoc.data().profilePic); // Assuming you have 'profilePic' field in your Firestore document
        }
      } else {
        setUser(null);
        setProfilePic('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setProfilePic('');
    alert('You have been logged out.');
    navigate('/'); // Navigate to the home page after logout
  };

  return (
    <header className="head">
      <div className="left">
        <div>
          <CompoCustom to="/" className="an">
            <img className="logo" src="https://img.freepik.com/premium-vector/cinema-logo-vector-roll-film-vector-white-background_472355-306.jpg?w=2000" alt="Logo" />
            <h3>Movie Recommendation System!</h3>
          </CompoCustom>
        </div>
      </div>
      <div className="right">
        <ul>
          <li><CompoCustom to="/">Home</CompoCustom></li>
          <li><CompoCustom to="/About">About</CompoCustom></li>
          <li><CompoCustom to="/Movies">Movies</CompoCustom></li>
          {user ? (
            <>
              <li>
                <CompoCustom to="/Users">
                  <img
                    className="profile"
                    src={profilePic || "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg"}
                    alt="User Profile"
                    style={{ cursor: 'pointer' }}
                  />
                </CompoCustom>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </li>
            </>
          ) : (
            <li><CompoCustom to="/login">Login</CompoCustom></li>
          )}
        </ul>
      </div>
    </header>
  );
}
