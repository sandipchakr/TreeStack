import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Loader from './Loader';
import defaultpng from "../assets/default.png"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Signup() {
  const navigate = useNavigate();
  const [servermsg, setservermsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const postForm = async (data) => {
    try {
      let r = await fetch(`${BACKEND_URL}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
        })
      });

      let res = await r.json();
      setservermsg(res.message);

      if (res.success) {
        setTimeout(()=>{
          navigate("/otp", { state: { email: data.email } });
        },1000);
      }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (

    <form onSubmit={handleSubmit(postForm)} className='align-middle'>
      {servermsg && (
        <div className='bg-[#020b1a] inline-block text-white p-4 w-full'>
          <span>{servermsg}</span>
        </div>
      )}
      
      

      <div className="w-full flex justify-center items-start bg-[#020b1a]] text-white h-screen
      bg-gradient-to-bl from-[#020b1a] to-[#340152]">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}   // start smaller & invisible
          animate={{ opacity: 1, scale: 1 }}     // grow to normal size
          exit={{ opacity: 0, scale: 0.8 }}      // shrink when leaving
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex items-center justify-center w-full"
        >
          <div className="relative w-full m-1.5 sm:w-2/3 md:w-1/2 lg:w-1/3 min-h-[55vh] flex flex-col gap-2 
          justify-evenly items-center mt-5 rounded-xl bg-[#021732] backdrop-blur-md border border-[#1c345faa] p-3">

            {isSubmitting && <Loader />}
            
            <div className="flex justify-center items-center p-1 ">

              <img src={defaultpng}
                crossOrigin="anonymous"
                alt="profile"
                className="h-20 w-20 rounded-full object-cover"
              />

            </div>

            <div className="w-[7rem] px-3 py-2 rounded-xl ">
              <span className='text-xl font-bold text-cyan-300'>SignUp</span>
            </div>

            {/* Firstname */}
            <div className='w-full gap-2 flex flex-col justify-center items-center'>
              <span >Enter Firstname</span>
              <input type="text" placeholder='Firstname'
                className="w-3/4 p-1.5 text-lg rounded-xl border border-gray-600 bg-[#080126ea]"
                {...register("firstname", {
                  required: { value: true, message: "This field is required.." },
                  minLength: { value: 2, message: "Minimum 2 characters" }
                })}
              />
              {errors.firstname && <div className='text-red-500'>{errors.firstname.message}</div>}
            </div>

            {/* Lastname */}
            <div className='w-full gap-2 flex flex-col justify-center items-center'>
              <span>Enter Lastname</span>
              <input type="text" placeholder='Lastname'
                className="w-3/4 p-1.5 text-lg rounded-xl border border-gray-600 bg-[#080126ea]"
                {...register("lastname", {
                  required: { value: true, message: "This field is required.." },
                  minLength: { value: 2, message: "Minimum 2 characters" }
                })}
              />
              {errors.lastname && <div className='text-red-500'>{errors.lastname.message}</div>}
            </div>

            {/* Email */}
            <div className='w-full gap-2 flex flex-col justify-center items-center'>
              <span>Enter Email</span>
              <input type="email" placeholder='Email'
                className="w-3/4 p-1.5 text-lg rounded-xl border border-gray-600 bg-[#080126ea]"
                {...register("email", {
                  required: { value: true, message: "This field is required.." }
                })}
              />
              {errors.email && <div className='text-red-500'>{errors.email.message}</div>}
            </div>

            {/* Password */}
            <div className='w-full gap-2 flex flex-col justify-center items-center'>
              <span>Enter Password</span>
              <input type="password" placeholder='Password'
                className="w-3/4 p-1.5 text-lg rounded-xl border border-gray-600 bg-[#080126ea]"
                {...register("password", {
                  required: { value: true, message: "This field is required.." },
                  minLength: { value: 6, message: "Minimum length is 6" }
                })}
              />
              {errors.password && <div className='text-red-500'>{errors.password.message}</div>}
            </div>

            {/* Submit Button */}
            <div className="bg-green-500 rounded-xl px-8 py-2 text-lg text-white font-bold ">
              <input disabled={isSubmitting} type="submit" value="Submit" className='hover:cursor-pointer' />
            </div>

            {/* Link to Login */}
            <div>
              <span>Already have an account?</span>
              <Link to="/login" className='text-blue-400 underline ml-3'>Login</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </form>

  );
}

export default Signup;
