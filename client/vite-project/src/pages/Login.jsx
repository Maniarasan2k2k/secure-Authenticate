import { useContext, useState } from "react";
import assets from "../assets/asset";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendURL, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendURL}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await getUserData();

          // ✅ OTP send pannura API call
          const otpRes = await axios.post(
            `${backendURL}/api/auth/send-verify-otp`,
            {},
            { withCredentials: true }
          );

          if (otpRes.data.success) {
            toast.success("OTP sent to your email!");
            navigate("/email-verify"); // OTP page ku redirect
          } else {
            toast.error(otpRes.data.message);
          }
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          await getUserData();

          // ✅ User already verified check
          if (!data.user?.isAccountVerified) {
            navigate("/email-verify");
          } else {
            navigate("/");
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[#000]">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-[#eee] p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-black text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-black mb-6">
          {state === "Sign Up"
            ? "Create Your account?"
            : "Login To Your account?"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#000]">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none flex-1"
                type="text"
                placeholder="Full name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#000]">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none flex-1"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#000]">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none flex-1"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password
          </p>

          <button className="w-full py-2.5 rounded-full  text-black  bg-gradient-to-r from-gray-500 to-cyan-500 font-semibold">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an Account?
            <span
              onClick={() => setState("Login")}
              className="text-indigo-500 cursor-pointer underline"
            >
              {" "}
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an Account?
            <span
              onClick={() => setState("Sign Up")}
              className="text-indigo-500 cursor-pointer underline"
            >
              {" "}
              Sign Up Here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
