import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import google from '../assets/google.svg'
import github from '../assets/github.svg'
import { useNavigate } from 'react-router-dom';

const SignIn = () => {

  let navigate = useNavigate();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("please enter the username and password feild.");
      return
    }

    signIn(email, password)
    .then(() => navigate("/"))
    .catch(() => alert("Invalid email or password"))
  };

  const [mode, setMode] = useState(true)
  const handleTheme = () => {
    setMode(!mode)
  }

  return (
    <div className={`${mode && "dark"}`}>
      <div className='h-screen bg-[#F0F2F5] dark:bg-[#101623] text-white flex flex-col'>
        <Navbar mode={mode} handleTheme={handleTheme} activeTab="SIGNIN" />
        <div className='w-screen h-screen flex justify-center pt-10'>
          <div className='bg-gray-800 w-[90%] md:w-[50%] lg:w-[30%] px-6 py-6 h-[95%]'>
            <h2 className='font-bold text-2xl'>Login to CoinXChange</h2>
            <div className='mt-8 bg-[#101623] flex justify-between h-12 rounded-sm'>
              <button className='bg-gray-800 w-[50%] my-1 mx-1 ml-1 font-bold rounded-sm'>Login</button>
              <button onClick={() => navigate('/signup')} className='w-[50%] my-1 mx-1 mr-1 font-bold text-[#9EB1BF]'>Sign Up</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='mt-6 flex flex-col justify-between gap-4'>
                <input type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-[#2D3446] rounded-md p-6 h-10 border-2 border-[#1e2636]' placeholder='Enter your email' />
                <input type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} className='bg-[#2D3446] rounded-md p-6 h-10 border-2 border-[#1e2636]' placeholder='Enter your password' />
                <h2 className='font-semibold text-sm'>Forgot Password?</h2>
                <button type="submit" className='bg-[#3067F0] mt-4 font-bold p-3 rounded-sm'>LOGIN</button>
              </div>
            </form>
            <h2 className='text-center mt-8 font-semibold text-[#9EB1BF]'>OR</h2>
            <div className='flex justify-center items-center gap-2 p-2 mt-6 border-[1px] border-gray-700 font-semibold'>
              <img src={google} alt="Logo" className='w-8' />
              Continue with Google
            </div>
            <div className='flex justify-center items-center gap-2 p-2 mt-4 border-[1px] border-gray-700 font-semibold'>
              <img src={github} alt="Logo" className='w-8' />
              Continue with GitHub
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
