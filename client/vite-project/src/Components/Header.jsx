import React, { useContext } from 'react'
import assets from '../assets/asset.js'
import { AppContext } from '../Context/AppContext.jsx';
const Header = () => {

  const { userData } = useContext(AppContext);

  return (
    <div className='flex flex-col  items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="Logo" className='w-36  h-36 rounded-full mb-6'/>
        <h1 className='flex items-center gap-2 text-xl s:text-3xl font-medium mb-2'> <h1 className="text-green-500">{userData.name}</h1> !Developer <img src={assets.hand_wave} alt="Developer Icon" className='w-8 aspect-square' /></h1>

        <h2 className='text-4xl sm:text-5xl font-semibold mb-4'>Welcome to Our App</h2>

        <p className='mb-8 max-w-md'>Let's Start with a Quick Product  tour and we will have you up and running in no time!</p>

        <button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all  rounded-full'>Get Started</button>
    </div>
  )
}

export default Header