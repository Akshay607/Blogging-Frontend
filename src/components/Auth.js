import react from 'react'
import { useState,useContext } from 'react'
import '../css/Auth.css'
import '../styles.css'
import { DomainURL } from '../constants'
import axios from 'axios'
import { Profile } from './profile'
import { BrowserRouter,Route, Routes, useNavigate,useLocation } from 'react-router-dom'
//import { localStorage } from "../App";

function Login() {
  const [res, setRes] = useState({isError:false, mass:''});
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate();
  //const [state,setState] =useContext(localStorage)
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setRes((ps)=>({...ps,mess:''}));

    const userId = e.target.loginId.value;
    const password = e.target.password.value;

    try {
      const loginRes = await axios.post(`${DomainURL}/auth/login`, {
        email: userId,
        password: password
      });

      if (loginRes.data.status === 200) {
        setRes((ps)=>({...ps,mess:loginRes.data.message}));
        console.log("res",res)
       // setState({...loginRes.data.data})
        localStorage.setItem('loginInfo',JSON.stringify({...loginRes.data.data}))
        navigate('/tweets');
      } else {
        setRes({isError:true, mess:loginRes.data.message});
      }
    } catch (error) {
      
      setRes({isError:true, mess:error});
    }
    finally{
      console.log("login",localStorage.getItem('loginInfo'))
      setIsLoading(false)
    }
  };

  const handleSignup = () => {
    navigate('/register');
  };

  return (
    <div className='flex items-center justify-center h-screen '>
    <form className='form-container bg-white p-6 rounded-lg shadow-lg' onSubmit={handleSubmit}>
      <h2 className='text-2xl font-semibold mb-4'>Login</h2>
      {/* {res.mess && (
        <div className={res.isError ? 'text-red-500 mb-4' : 'text-green-600 mb-4'}>
          {res.mess}
        </div>
      )} */}
      <div className='flex flex-col space-y-4'>
        <label htmlFor='loginId' className='text-sm font-medium'>Username or Email</label>
        <input
          type='text'
          id='loginId'
          name='loginId'
          className='input p-2 border border-gray-300 rounded-md'
          placeholder='Enter username or email'
          required
        />
        <label htmlFor='password' className='text-sm font-medium'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          className='input p-2 border border-gray-300 rounded-md'
          placeholder='Enter password'
          required
        />
      </div>
      <div className='flex justify-between items-center mt-4'>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={isLoading}
        >
          {isLoading ? <div className="spinner"></div> : 'Login'}
        </button>
        <button
          type='button'
          className='text-blue-500 hover:text-blue-600 focus:outline-none'
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
    </form>
  </div>
  

  );
}



function Register() {
  const [res, setRes] = useState({isError:false, mess:''});
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setRes(prevState => ({
      ...prevState,
      mess: '' // Update the specific property
    }))
    setIsLoading(true);
    const form = e.target;
    const name = form.name.value || 'a';
    const username = form.username.value;
    const email = form.email.value || 'aaa@g.v';
    const phone = form.phone.value || '1234567890';
    const password = form.password.value;

    try {
      const registerRes = await axios.post(`${DomainURL}/auth/register`, {
        data: {
          name,
          username,
          email,
          phone,
          password,
        }
      });

      if (registerRes && registerRes.data.status === 200) {
        
        setRes({isError:false,mess:registerRes.data.message})
       
        
      } else {
        
        setRes({isError:true,mess:registerRes.data.message});
      }
    } catch (error) {
      setRes({isError:true,mess:error});
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form className='form-container' onSubmit={handleRegister}>
        <h2 className='text-3xl mb-4 text-center font-bold text-gray-800'>Signup</h2>
        {res.mess &&  <p className={res.isError ?'flex justify-center text-red-500':'flex justify-center text-green-500'}>{res.mess}</p>}
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>Name</label>
          <input
            className='input'
            id='name'
            name='name'
            type='text'
            placeholder='Enter your name'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>Username</label>
          <input
            className='input'
            id='username'
            name='username'
            type='text'
            placeholder='Choose a username'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
          <input
            className='input'
            id='email'
            name='email'
            type='email'
            placeholder='Enter your email'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>Phone</label>
          <input
            className='input'
            id='phone'
            name='phone'
            type='text'
            placeholder='Enter your phone number'
            required
          />
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>Password</label>
          <input
            className='input'
            id='password'
            name='password'
            type='password'
            placeholder='Enter your password'
            required
          />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <button  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
           type='submit'
           disabled={isLoading} >
            {isLoading ? <><div className="spinner"></div></> : 'Signup'}
          </button>
          <p className='mt-4'>Already have an account? <a className='text-blue-600' href='/login'>Login</a></p>
        </div>
      </form>
    </div>
  );
}

export default Register;

function Logout(){
  const navigate = useNavigate();
const handleLogin=async(e)=>{
  
  e.preventDefault()
  try {
  const res = await axios.post(`${DomainURL}/auth/logout`)

  }
  catch(err){
    console.log(err)
  }
  navigate('/login')
}

  return(
    <div className="flex flex-col items-center justify-center h-screen">
    <div >
      {/* This empty div helps to vertically center the content */}
      
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">You have successfully logged out</h2>
        <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300">
          Login
        </button>
      </div>
      <div className="h-1/5"></div>
    </div>
  </div>
  
  
  )
}

export {Login, Register,Logout}