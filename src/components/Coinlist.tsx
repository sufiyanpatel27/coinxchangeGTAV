import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { setCoins, setCurrCoin } from '../feature/coin/coinSlice';
import up from '../assets/up.svg'
import down from '../assets/down.svg'

import '../App.css'

export default function Coinlist() {

    const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:5000/";

    const dispatch = useDispatch<AppDispatch>();
    const allCoins = useSelector((state: RootState) => state.coin.allCoins);

    // const [latestData, setlatestData] = useState(true)
    const [selectedCoinId, setselectedCoinId] = useState(0)

    const pollForCompletion = () => {
        const interval = setInterval(async () => {
            axios.get(base_url + 'coins')
                .then((res) => {
                    if (res.data.isDataRetrieved) {
                        clearInterval(interval);
                        fetchData();
                        // setlatestData(true)
                        console.log("all coins loaded and reset data");
                    }
                });
        }, 10000); // Poll every 10 seconds
    };

    const fetchData = async () => {
        console.log("loading coins")
        axios.get(base_url + 'coins')
            .then((res) => {
                // setlatestData(res.data.isDataRetrieved);
                if (!res.data.isDataRetrieved) {
                    pollForCompletion();  // Poll for data generation completion
                }
                dispatch(setCoins(res.data.cleanedCoinsData))
                if (selectedCoinId) {
                    const coin = res.data.cleanedCoinsData.map((coin: any) => {
                        if (coin._id === selectedCoinId) {
                            return coin;
                        }
                    });
                    dispatch(setCurrCoin(coin[0]));
                }

            })
            .then(() => console.log("All coins loaded"))
            .catch((err) => { console.error('Failed to fetch coins:', err) })

        const interval = setInterval(() => {
            axios.get(base_url + 'coins')
                .then((res) => dispatch(setCoins(res.data.cleanedCoinsData)))
                .then(() => console.log("All coins loaded again after 60 seconds"))
                .catch((err) => { console.error('Failed to fetch coins:', err) })
        }, 60000);
        return () => clearInterval(interval);
    }

    useEffect(() => {
        fetchData();
    }, [])


    const [searchTerm, setSearchTerm] = useState('');

    interface dataObject {
        open: number;
        close: number;
        low: number;
        high: number;
    }
    interface Coin {
        _id: number;
        name: string;
        symbol: string;
        data: Array<dataObject>;
    }

    const handleCoinSelect = (coin: Coin) => {
        setselectedCoinId(coin._id)
        dispatch(setCurrCoin(coin))
    }





    return (
        <div className="bg-secondary dark:bg-secondary-dark ml-2 mr-2 m-1 rounded lg:m-1 lg:min-w-[250px]">
            <div className="flex flex-col justify-between mb-1">
                <div className="relative p-3 border-b-2 border-[#2C3240]">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-8 px-4 py-2 pl-5 text-[12px] dark:text-white dark:bg-[#2D3446] border-[1px] border-[#3A4152] rounded-[5px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <svg
                        className="absolute left-4 top-[22px] w-[12px] h-[12px] text-gray-300"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M10 2a8 8 0 105.293 14.293l5.414 5.414 1.414-1.414-5.414-5.414A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
                    </svg>
                </div>
                <div className="p-3">
                    <select className="w-full h-8 px-1 text-[14px] dark:bg-[#2D3446] dark:text-white border-[1px] border-[#3A4152] rounded-[5px] focus:outline-none">
                        <option>All Assets</option>
                        <option>Most Active</option>
                    </select>
                </div>
            </div>
            <div className="">
                <div className="flex justify-between h-8">
                    <div className="w-full h-full font-bold text-sm cursor-pointer hover:text-black dark:hover:text-white dark:text-white flex justify-center items-center dark:*:bg-[#1E2433] border-[#1E2433] border-r-2 border-t-[#66C37B]  border-t-4">USD</div>
                    <div className="w-full h-full font-bold text-sm cursor-pointer hover:text-black dark:hover:text-white text-[#818898] flex justify-center items-center dark:bg-[#161D2B] border-r-2 border-[#1E2433]">USDT</div>
                    <div className="w-full h-full font-bold text-sm cursor-pointer hover:text-black dark:hover:text-white text-[#818898] flex justify-center items-center dark:bg-[#161D2B] border-r-2 border-[#1E2433]">WRX</div>
                    <div className="w-full h-full font-bold text-sm cursor-pointer hover:text-black dark:hover:text-white text-[#818898] flex justify-center items-center dark:bg-[#161D2B]">BTC</div>
                </div>
                <div className="flex justify-between items-center h-5 px-4 border-b-2 border-[#2D3446]">
                    <div className="w-full text-[10px] font-semibold cursor-pointer flex justify-start text-[#66C37B]">Name</div>
                    <div className="w-full text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex justify-start">Vol</div>
                    <div className="w-full text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex justify-end">Change</div>
                </div>



                {allCoins.length === 0 &&
                    <div className="w-full pt-12 lg:pt-52 flex justify-center items-center">
                        <div className="loading-spinner"></div>
                    </div>
                }
                {allCoins.map((coin: Coin) => (
                    <div key={coin._id} onClick={() => handleCoinSelect(coin)} className="h-12 flex justify-between items-center border-b-2 px-4 border-[#2D3446] cursor-pointer hover:bg-[#ded7d7] dark:hover:bg-[#212f57]">
                        <div className="flex justify-center items-center">
                            <div className="mr-1 font-serif w-4 h-4 text-sm ">{coin.symbol[0]}</div>
                            <div>
                                <div className="flex">
                                    <div className="font-bold text-[12px]">{coin.symbol}</div>
                                    <div className="font-semibold text-[12px] text-[#9EB1BF]">/USD</div>
                                </div>
                                {Math.round(((coin.data[coin.data.length - 1].close - coin.data[coin.data.length - 2].close) / coin.data[coin.data.length - 2].close) * 100) < 0 && (
                                    <div className="flex">
                                        <img src={down} alt="Logo" className='pr-1' />
                                        <div className="text-red-300 font-bold text-[11px]">{Math.abs(Math.round(((coin.data[coin.data.length - 1].close - coin.data[coin.data.length - 2].close) / coin.data[coin.data.length - 2].close) * 100))}%</div></div>)}
                                {Math.round(((coin.data[coin.data.length - 1].close - coin.data[coin.data.length - 2].close) / coin.data[coin.data.length - 2].close) * 100) > 0 && (
                                    <div className="flex">
                                        <img src={up} alt="Logo" className='pr-1' />
                                        <div className="text-green-300 font-bold text-[11px]">{Math.abs(Math.round(((coin.data[coin.data.length - 1].close - coin.data[coin.data.length - 2].close) / coin.data[coin.data.length - 2].close) * 100))}%</div></div>)}

                            </div>
                        </div>
                        <div className="font-bold text-[12px]">$ {coin.data[coin.data.length - 1].close}</div>
                    </div>
                ))}
                {/* removed the loading spinner for latest data loading temporarily due to a bug */}
                {/* {latestData == false &&
                    <div className="w-full lg:pt-5 flex justify-center items-center gap-2">
                        Loading Latest Data <div className="loading-spinner"></div>
                    </div>
                } */}
            </div>
        </div>
    )
}