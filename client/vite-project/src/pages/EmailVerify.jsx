import React, { useContext, useEffect } from 'react'
import assets from '../assets/asset'
import axios from "axios"
import {AppContext} from "../Context/AppContext"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const EmailVerify = () => {
  
  axios.defaults.withCredentials = true
  const { backendURL, isLoggedin, userData, getUserData } = useContext(AppContext);

      const navigate = useNavigate()

    const inputRef = React.useRef([])
    const handleInput =(e, index)=>{
      if(e.target.value.length > 0 && index < inputRef.current.length - 1){
        inputRef.current[index + 1].focus();
      }
    }


    const handleKeyDown = (e, index)=>{
      if(e.key === "Backspace" && e.target.value === "" && index > 0){
        inputRef.current[index - 1].focus();
      }
    }

    const handlePaste = (e)=>{
      const paste = e.clipboardData.getData("text")
      const pastArray = paste.split("");
      pastArray.forEach((char, index)=>{
        if(inputRef.current[index]){
          inputRef.current[index].value = char
        }
      })
    }

    const onSubmitHandler = async(e)=>{
      try{
        e.preventDefault()
        const otpArray = inputRef.current.map(e=> e.value)
        const otp =  otpArray.join("")

        const {data} = await axios.post(backendURL + `/api/auth/verify-account`,{otp},
          { withCredentials: true })
        
        if(data.success){
          toast.success(data.message)
          getUserData()
          navigate("/")
        }else{
          toast.error(data.message)
        }
      }catch(error){
          toast.error(error.message)
      }
    }


useEffect(() => {
  if (isLoggedin && userData?.isAccountVerified) {
    navigate("/");
  }
}, [isLoggedin, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen  bg-[#000]">

        <img src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"/>

        <form onSubmit={onSubmitHandler} action="" className='bg-[#eee] p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-black text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
          <p className='text-black text-center '>Enter The 6 Digits Code Send to Your Email ID</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index)=>(
                <input type="text" maxLength="1" key={index} required className='w-12 h-12 bg-[#000] text-white text-center text-xl rounded-md'

                ref={e=> inputRef.current[index] = e}
                onInput={(e)=>handleInput(e,index)}
                onKeyDown={(e)=>handleKeyDown(e, index)}
                 
                />
              ))}
          </div>

          <button className='w-full py-3 bg-gradient-to-r from-indigo-100 to-indigo-900 text-black rounded-full'>Verify Email</button>
        </form>
    </div>
  )
}

export default EmailVerify