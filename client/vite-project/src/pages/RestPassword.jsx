import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios  from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';
const RestPassword = () => {

    const { backendURL } = useContext (AppContext);  
          axios.defaults.withCredentials = true;
    

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [newPassword, setNewPasword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState('')
    const [otp, setOtp] = useState(0)
    const [isOtpSumbmit, setIsOtpSumbmit] = useState(false)


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
    
        const onSubmitEmail = async(e)=>{
          e.preventDefault();
          try{
            const {data} = await axios.post(backendURL + '/api/auth/send-reset-otp',{email})

            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
          }catch(error){
            toast.error(error.message)
          }

        }

        const onSubmitOTP = async(e)=>{
          e.preventDefault()
          const otpArray = inputRef.current.map(e=>e.value)
          setOtp(otpArray.join(''))
          setIsOtpSumbmit(true)
        }

        const onSubmitNewPassword = async (e) => {
          e.preventDefault()
          try {
            const {data} = await axios.post(backendURL + '/api/auth/resetPassword',{email, otp, newPassword})

            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate('/login')
          } catch (error) {
            toast.error(error.message)
          }
        }

  return (
        <div className="flex items-center justify-center min-h-screen  bg-[#000]">
          {/* enter Email id  */}

          {!isEmailSent && 
            <form action="" onSubmit={onSubmitEmail} className='bg-[#eee] p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-black text-2xl font-semibold text-center mb-4'>Reset Password</h1>
                <p className='text-black text-center'>Enter Your Registered Email address</p>

                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#000] text-black'>
                  <input type="email" placeholder='Email Id' className='bg-transparent outline-none text-white' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>

                <button className='w-full py-2.5 bg-[#000] text-white rounded-full mt-3'>Submit</button>
            </form>
}
    {/* otp input form  */}

{!isOtpSumbmit && isEmailSent && 
<form onSubmit={onSubmitOTP} action="" className='bg-skate-100 p-8 rounded-lg shadow-lg w-96 text-sm bg-[#000]'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-white text-center text-indigo-300'>Enter The 6 Digits Code Send to Your Email ID</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index)=>(
                <input type="text" maxLength="1" key={index} required className='w-12 h-12  text-black text-center text-xl rounded-md'

                ref={e=> inputRef.current[index] = e}
                onInput={(e)=>handleInput(e,index)}
                onKeyDown={(e)=>handleKeyDown(e, index)}
                 
                />
              ))}
          </div>

          <button className='w-full py-2.5  bg-[#eee] text-black rounded-full'>Submit</button>
        </form>
}


        {/* enter new Password  */}
          {isOtpSumbmit && isEmailSent && 
  
                 <form action="" onSubmit={onSubmitNewPassword} className='bg-[#000] p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
                <p className='text-white text-center text-indigo-300'>Enter The Password Below</p>

                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#eee] text-black'>
                  <input type="password" placeholder='Password' className='bg-transparent outline-none text-black' value={newPassword} onChange={(e)=>setNewPasword(e.target.value)} required/>
                </div>

                <button className='w-full py-2.5 bg-[#eee] text-black rounded-full mt-3'>Submit</button>
            </form>
  }
        </div>
  )
}

export default RestPassword