// Otp.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Otp() {
  const [servermsg, setServermsg] = useState("");
  const [success,setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "unicorn@gmail.com"; // email passed from signup

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleVerify = async (data) => {
    let res = await fetch(`${BACKEND_URL}/api/user/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: data.otp })
    });
    const serverData = await res.json();
    if (serverData.success) {
      setServermsg(serverData.message);
      setSuccess(true);

      //redirect after short delay:-
      setTimeout(()=>{
        navigate("/signin");
      },1000);
    } else {
      setServermsg(serverData.message);
      
    }
  };
  return (
    
      <form onSubmit={handleSubmit(handleVerify)}>
      <div className="w-full h-screen bg-[#020b1a] text-white flex justify-center items-center">
         <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}   // start smaller & invisible
                  animate={{ opacity: 1, scale: 1 }}     // grow to normal size
                  exit={{ opacity: 0, scale: 0.8 }}      // shrink when leaving
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex items-center justify-center w-full"
                >
                  {/* Success Animation */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="flex flex-col items-center gap-2"
              >
                <svg
                  className="w-16 h-16 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-green-400 text-lg font-semibold">
                  Verified!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/*Card*/}
        <div className="w-full m-1.5 sm:w-2/3 md:w-1/2 lg:w-1/3 bg-[#021732] backdrop-blur-md border border-[#34a755aa] p-3 flex flex-col justify-center items-center
         mb-5 gap-3 rounded-2xl">
          <div>
            <h2 className="text-xl font-bold text-center mb-4">
            Verify your email
          </h2>
              <p className="text-sm text-gray-400 text-center">
            Enter the 6-digit OTP sent to <span className="text-green-400">{email}</span>
          </p>
          </div>
          <div>
            <input
            placeholder="Enter OTP"
            {...register("otp", {
              required: { value: true, message: "This field is required.." },
              pattern: { value: /^[0-9]{6}$/, message: "Enter a valid 6-digit OTP." },
            })}
            className="bg-[#020f28f4] p-2 rounded-xl text-center border border-[#34a794aa] outline-none"
          />
          </div>
          {errors.otp && <div className="text-sm text-red-500">{errors.otp.message}</div>}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
            type="submit"
            className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition text-lg font-semibold"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </div>
        </motion.div>
      </div>
    </form>
  );
}
