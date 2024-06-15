import React, { useContext, useState } from 'react';
import { Context } from "../index";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const {isAuthenticated, setIsAuthenticated} = useContext(Context);

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigateTo = useNavigate();

  // Handle Login
  const handleLogin = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/v1/user/login", 
        {email, password, confirmPassword, role : "Admin"}, 
        {
          withCredentials : true, 
          headers : {"Content-Type" : "application/json"}
        }
      )
        toast.success(response.data.message);
        setIsAuthenticated(true);
        navigateTo("/");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      
    } 
    catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if(isAuthenticated){
    return <Navigate to={"/"}/>
  }

  return (
    <>
      <div className='container form-component'>

        <img src='./logo.png' alt='logo' className='logo' />

        <h1 className='form-title'>
          WELCOME TO ZEECARE
        </h1>

        <p>
          Only Admins are allowed to access these resources !
        </p>

        <form onSubmit={handleLogin}>
          <input 
            type='text' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder='Email' 
          />
          <input 
            type='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder='Password' 
          />
          <input 
            type='password' 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder='Confirm Password' 
          />

          <div
            style={{
              justifyContent : "center",
              alignItems : "center"
            }}
          >
            <button type='submit'>Login</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login;