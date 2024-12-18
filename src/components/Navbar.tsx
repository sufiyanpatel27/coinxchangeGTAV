import logo from '../assets/logo.svg';
import download from '../assets/download.svg';
import theme from '../assets/theme.svg';
import theme_light from '../assets/theme_light.svg';
import help from '../assets/help.svg';
import user from '../assets/user.svg';
import wallet from '../assets/wallet.svg';
import logout from '../assets/logout.svg';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUserInfo } from '../feature/coin/userSlice';
import { AppDispatch } from '../app/store';


export default function Navbar({ mode, handleTheme, activeTab }: { mode: boolean, handleTheme: () => void, activeTab: string }) {
    let navigate = useNavigate();
    const { email, signOut } = useAuth();
    const [loggedIn] = useState(email ? false : true);
    const [userSettings, setUserSettings] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();


    const handleLogOut = () => {
        signOut();
        const newUserInfo = {};
        dispatch(setUserInfo(newUserInfo))
        navigate('/signin');
    };

    useEffect(() => {
        if (userSettings) {
            setTimeout(() => {
                setUserSettings(false);
            }, 5500);
        }
    }, [userSettings]);

    return (
        <div className="bg-primary dark:bg-primary-dark h-[45px] flex justify-between items-center px-4 md:px-8">
            <div className='flex items-center h-full'>
                <img src={logo} alt="Logo" className='w-24 md:w-36 cursor-pointer' onClick={() => navigate('/')} />
                <div className='hidden h-full md:flex items-center gap-4 ml-4'>
                    <div className={`font-bold cursor-pointer hover:bg-gray-800 px-4 h-full flex justify-center items-center ${activeTab === "EXCHANGE" ? 'dark:bg-[#1F2531] border-b-[3px] border-[#FAED9B]' : ''}`}
                        onClick={() => navigate('/')}>EXCHANGE</div>
                    <div className={`font-bold cursor-pointer hover:bg-gray-800 px-4 h-full flex justify-center items-center ${activeTab === "P2P" ? 'dark:bg-[#1F2531] border-b-[3px] border-[#FAED9B]' : ''}`}
                        onClick={() => navigate('/')}>P2P</div>
                    {!loggedIn &&
                        <div className={`font-bold cursor-pointer hover:bg-gray-800 px-4 h-full flex justify-center items-center ${activeTab === "FUNDS" ? 'dark:bg-[#1F2531] border-b-[3px] border-[#FAED9B]' : ''}`}
                            onClick={() => navigate('/funds')}>FUNDS</div>
                    }
                </div>
            </div>
            <div className='hidden h-full md:flex items-center gap-6'>
                <div className='font-semibold cursor-pointer hover:bg-gray-800 px-4 h-full flex items-center' onClick={() => navigate('/')}>INVITE & EARN</div>
                {!loggedIn &&
                    <div className='relative h-full'>
                        <div className='font-semibold h-full cursor-pointer hover:bg-gray-800 flex w-10 justify-center'
                            onClick={() => setUserSettings(!userSettings)}>
                            <img src={user} alt="User" className='w-5' />
                        </div>
                        {userSettings &&
                            <div className='bg-[#2D3446] flex flex-col z-10 py-2 gap-2 border-t-2 border-[#404a64] absolute top-10 right-0 w-48 '>
                                <div className='flex px-2 gap-2 cursor-pointer hover:bg-[#1c2130]'
                                    onClick={() => navigate('/funds')}>
                                    <img src={wallet} alt="Funds" className='w-5' />
                                    <h2>Funds</h2>
                                </div>
                                <div className='flex px-2 gap-2 cursor-pointer hover:bg-[#1c2130]'
                                    onClick={handleLogOut}>
                                    <img src={logout} alt="Logout" className='w-5' />
                                    <h2>Logout</h2>
                                </div>
                            </div>
                        }
                    </div>
                }
                <div className='font-semibold h-full cursor-pointer hover:bg-gray-800 flex w-10 justify-center'>
                    <img src={download} alt="Download" className='w-5' />
                </div>
                <div className='font-semibold h-full cursor-pointer hover:bg-gray-800 flex w-10 justify-center' onClick={handleTheme}>
                    {!mode && <img src={theme_light} alt="Light Theme" className='w-5' />}
                    {mode && <img src={theme} alt="Dark Theme" className='w-5' />}
                </div>
                <div className='font-semibold h-full cursor-pointer hover:bg-gray-800 flex w-16 justify-between items-center'>
                    <img src={help} alt="Help" className='w-5' />
                    HELP
                </div>
            </div>
            <div className='flex md:hidden items-center'>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-white focus:outline-none'>
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
                    </svg>
                </button>
            </div>
            {isMenuOpen && (
                <div className='md:hidden flex flex-col bg-[#3067F0] dark:bg-[#2D3446] absolute top-[45px] left-0 right-0 z-10'>
                    <div className='flex flex-col items-center'>
                        <div className='font-bold cursor-pointer hover:bg-gray-800 px-4 py-2 w-full text-center'
                            onClick={() => { navigate('/'); setIsMenuOpen(false); }}>EXCHANGE</div>
                        <div className='font-bold cursor-pointer hover:bg-gray-800 px-4 py-2 w-full text-center'
                            onClick={() => { navigate('/'); setIsMenuOpen(false); }}>P2P</div>
                        {!loggedIn &&
                            <div className='font-bold cursor-pointer hover:bg-gray-800 px-4 py-2 w-full text-center'
                                onClick={() => { navigate('/funds'); setIsMenuOpen(false); }}>FUNDS</div>
                        }
                        <div className='font-semibold cursor-pointer hover:bg-gray-800 px-4 py-2 w-full text-center'
                            onClick={() => { navigate('/'); setIsMenuOpen(false); }}>INVITE & EARN</div>
                        {!loggedIn &&
                            <div className='font-semibold cursor-pointer hover:bg-gray-800 px-4 py-2 w-full text-center flex items-center justify-center'
                                onClick={() => setUserSettings(!userSettings)}>
                                <img src={user} alt="User" className='w-5 mr-2' /> User Settings
                                {userSettings &&
                                    <div className='bg-[#2D3446] flex flex-col z-10 py-2 gap-2 border-t-2 border-[#404a64] absolute top-10 w-48'>
                                        <div className='flex px-2 gap-2 cursor-pointer hover:bg-[#1c2130]'
                                            onClick={() => { navigate('/funds'); setUserSettings(false); }}>
                                            <img src={wallet} alt="Funds" className='w-5' />
                                            <h2>Funds</h2>
                                        </div>
                                        <div className='flex px-2 gap-2 cursor-pointer hover:bg-[#1c2130]'
                                            onClick={() => { handleLogOut(); setUserSettings(false); }}>
                                            <img src={logout} alt="Logout" className='w-5' />
                                            <h2>Logout</h2>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        <div className='font-semibold cursor-pointer hover:bg-gray-800 px-4 py-2 w-full text-center'
                            onClick={handleTheme}>
                            {!mode ? <img src={theme_light} alt="Light Theme" className='w-5 inline mr-2' /> : <img src={theme} alt="Dark Theme" className='w-5 inline mr-2' />}
                            Theme
                        </div>
                        <div className='font-semibold cursor-pointer hover:bg-gray-800 px-4 py-2 w-full text-center flex items-center justify-center'>
                            <img src={help} alt="Help" className='w-5 mr-2' />
                            HELP
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
