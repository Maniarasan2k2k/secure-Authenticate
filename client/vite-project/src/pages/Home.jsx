import React from 'react'
import Navbar from '../Components/Navbar'
import Header from '../Components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
        <Navbar />
        <Header />
    </div>
  )
}

export default Home