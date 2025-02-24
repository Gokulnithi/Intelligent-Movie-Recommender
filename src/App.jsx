import { useState } from 'react'
import Header from './Components/Header'
import Section from './Components/Section'
import UserDetails from './Components/UserDetails'
import LoginSignup from './Components/LoginSignup'
import Movies from './Pages/Movies'
import About from './Pages/About'
import Home from './Pages/Home'
import MovieDetails from './Components/MovieDetails'
import ReviewDetailPage from './Components/ReviewDetailPage'
import './App.css'
import InfiniteScrolling from './Components/InfiniteScrolling'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Header></Header>
    <div className='container'>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Movies" element={<Movies />}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Login" element={<LoginSignup />}/>
        <Route path='/Users' element={<UserDetails/>}/>
        <Route path="/movie/:movieId" element={<MovieDetails />}/>
        <Route path="/review/:id" element={<ReviewDetailPage />} />
      </Routes>
    </div>
    <Routes> 
      <Route path="/" element={<>
        <InfiniteScrolling />
        <Section />
      </>} /> 
    </Routes>
    </BrowserRouter>
  )
}

export default App
