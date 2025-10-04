import { createContext,  useEffect, useState } from "react";
import App from "../App";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();


export const AppProvider = (props) => {

    axios.defaults.withCredentials = true
    
    const backendURL= import.meta.env.VITE_BACKEND_URL
    const [isLoggedin,setIsLoggedin]=useState(false)
    const [userData,setUserData]=useState(false)

    const getAuthState =async ()=>{
        try{
            const {data}= await axios.get(`${backendURL}/api/auth/is-auth`, {withCredentials:true});
            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }
        }
        catch(error){
          toast.error(error.message);
        }
    }

    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/user/data`, { withCredentials: true });
          response.data.success ?  setUserData(response.data.userData) : toast.error(response.data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(()=>{
        getAuthState();
    },[])

    const value={
        backendURL,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


// export default 