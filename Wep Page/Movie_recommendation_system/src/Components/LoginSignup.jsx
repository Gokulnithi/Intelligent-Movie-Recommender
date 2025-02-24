import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './LoginSignup.css';
import MessageModal from './MessageModal';

function LoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          username: username,
          age: age,
          email: email,
          profilePic: '' // Add a default profile picture URL if needed
        });
        setModalMessage('Signup successful! You can now log in.');
        setModalType('success');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setModalMessage('Login successful');
        setModalType('success');
      }
    } catch (err) {
      console.error(err);
      setModalMessage(isSignup ? 'Signup failed' : 'Login failed');
      setModalType('error');
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
    setUsername('');
    setAge('');
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const handleProceed = () => {
    navigate('/Movies');
  };

  const handleRetry = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  if (user) {
    return (
      <div>
        <div>
          {modalMessage && (
            <MessageModal
              message={modalMessage}
              type={modalType}
              onClose={handleModalClose}
            />
          )}
        </div>
        {modalType === "success" ? (
          <div>
            <div>Welcome, {user.email}! You are logged in.</div>
            <button onClick={handleProceed} className='check'>Proceed</button>
            <button onClick={handleRetry} className='retry'>Retry</button>
          </div>
        ) : (
          <div>Log in errored.</div>
        )}
      </div>
    );
  }

  return (
    <div className='contf'>
      <div className="contf2">
        <h2>{isSignup ? 'Signup' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className='formL'>
          {isSignup && (
            <>
              <div>
                <label>Username: </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div>
                <label>Age: </label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
            </>
          )}
          <div>
            <label>Email: </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password: </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className='btn' type="submit">{isSignup ? 'Signup' : 'Login'}</button>
        </form>
        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"} 
          <button className='btn' onClick={toggleForm}>
            {isSignup ? 'Login' : 'Signup'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
