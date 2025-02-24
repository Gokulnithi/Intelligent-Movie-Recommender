import React from 'react'
import './InfiniteScrolling.css'
import image1 from '../Images/image1.jpg'
import image2 from '../Images/image2.jpg'
import image3 from '../Images/image3.jpg'
import image4 from '../Images/image4.jpg'
import image5 from '../Images/image5.jpg'
import image6 from '../Images/image6.jpg'
import image7 from '../Images/image7.jpg'
import image8 from '../Images/image8.jpg'
function InfiniteScrolling() {
  return (
    <div className='scroll-c'> 
        <div className='item'>
        <img src={image1} className='item1' alt="image8" />
        </div>
        <div className='item'>
        <img src={image2} className='item2' alt="image8" />
        </div>
        <div className='item'>
        <img src={image3} className='item3' alt="image8" />
        </div>
        <div className='item'>
        <img src={image4} className='item4' alt="image8" />
        </div>
        <div className='item'>
        <img src={image5} className='item5' alt="image8" />
        </div>
        <div className='item'>
        <img src={image6} className='item6' alt="image8" />
        </div>
        <div className='item'>
        <img src={image7} className='item7' alt="image8" />
        </div>
        <div className='item'>
        <img src={image8} className='item8' alt="image8" />
        </div>
    </div>
  )
}

export default InfiniteScrolling
