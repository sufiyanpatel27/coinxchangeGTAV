import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import axios from "axios";
import { setUserInfo } from "../feature/coin/userSlice";


export default function TradeInfo() {

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:5000/";

    const currCoin: any = useSelector((state: RootState) => state.coin.currCoin);

    const allCoins: any = useSelector((state: RootState) => state.coin.allCoins);

    const userInfo: any = useSelector((state: RootState) => state.userInfo);


    let coinPrice: number = 0;
    if (currCoin.name) {
        coinPrice = currCoin.data[currCoin.data.length - 1].close
    }

    const [coinAmount, setCoinAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleCoinAmountChange = (value: any) => {
        setCoinAmount(value)
        const rounded = Math.round((value * coinPrice) * 10000) / 10000;
        setTotalAmount(rounded)
    }

    const handleTotalAmountChange = (value: any) => {
        setTotalAmount(value)
        const rounded = Math.round((value / coinPrice) * 10000) / 10000;
        setCoinAmount(rounded)
    }

    useEffect(() => {
        setCoinAmount(0);
        setTotalAmount(0);
    }, [currCoin])

    const { email } = useAuth();

    const [loggedIn] = useState(email ? false : true)

    const [activeTab, setActiveTab] = useState('buy');


    const [activeOrder, setaAtiveOrder] = useState('open');

    const [isToggled, setIsToggled] = useState(false);
    const [isToggledcancel, setIsToggledCancel] = useState(false);

    const toggle = () => {
        setIsToggled(!isToggled);
    };
    const toggleCancel = () => {
        setIsToggledCancel(!isToggledcancel);
    };

    const handleBuyCoin = () => {

        if (totalAmount > userInfo.userInfo.balance) {
            alert("Insufficient Balance!")
        } else if (totalAmount <= 0 || coinAmount <= 0) {
            alert("Invalid Coin Amount or Total Amount!")
        }

        else {
            console.log("buying ", currCoin.symbol, " coin")
            if (confirm("Do you want to proceed the Transaction?")) {
                axios.post(base_url + 'buyCoin/' + userInfo.userInfo.userId,
                    {
                        coinName: currCoin.name,
                        coinSymbol: currCoin.symbol,
                        coinAmount: coinAmount,
                        totalAmount: totalAmount
                    }
                )
                    .then((res) => {
                        dispatch(setUserInfo(res.data.newUserInfo));
                        alert(`${currCoin.name} bought successfully of $${totalAmount}`)
                    })
                    .catch((err) => alert(err.response.data.error))
            } else {
                console.log("transactino canceled")
            }
        }


    }


    const handleSellCoin = () => {
        if (confirm("Do you want to proceed the Transaction?")) {
            axios.post(base_url + 'sellCoin/' + userInfo.userInfo.userId,
                {
                    coinName: currCoin.name,
                    coinSymbol: currCoin.symbol,
                    coinAmount: coinAmount,
                    totalAmount: totalAmount
                }
            )
                .then((res) => {
                    dispatch(setUserInfo(res.data.newUserInfo));
                    alert(`${currCoin.name} sold successfully of $${totalAmount}`)
                })
                .catch((err) => alert(err.response.data.message))
        } else {
            console.log("transactino canceled")
        }
    }




    return (
        <div className="flex flex-col-reverse lg:flex-col justify-between mr-2 m-1 lg:max-w-[330px]">
            <div className="bg-secondary dark:bg-secondary-dark mb-1 rounded h-[300px] lg:h-[60%] flex flex-col text-[#9EB1BF]">
                <div className="flex justify-between">
                    <button
                        className={`w-full focus:outline-none font-bold text-[11px] px-4 py-2 ${activeOrder === 'open' ? 'dark:bg-[#1E2433] dark:text-white border-t-4 border-[#66C37B] rounded-s-[4px]' : 'dark:bg-[#161D2B] rounded-s-[4px]'}`}
                        onClick={() => setaAtiveOrder('open')}
                    >
                        OPEN ORDERS
                    </button>
                    <button
                        className={`w-full focus:outline-none font-bold text-[11px] px-4 py-2 ${activeOrder === 'completed' ? 'dark:bg-[#1E2433] dark:text-white border-t-4 border-[#66C37B] rounded-e-[4px]' : 'dark:bg-[#161D2B] rounded-e-[4px]'}`}
                        onClick={() => setaAtiveOrder('completed')}
                    >
                        COMPLETED ORDERS
                    </button>
                </div>
                {activeOrder == "open" &&
                    <div className="flex items-center px-2 border-b-[1px] border-[#141822] pb-1">
                        <div
                            className={`relative inline-block w-6 h-3 transition duration-200 ease-in ${isToggled ? 'bg-blue-500' : 'bg-gray-300'
                                } rounded-full cursor-pointer`}
                            onClick={toggle}
                        >
                            <span
                                className={`absolute left-0 top-0 bottom-0 w-3 h-3 bg-white rounded-full shadow-md transform transition duration-200 ease-in-out ${isToggled ? 'translate-x-3' : ''
                                    }`}
                            />
                        </div>
                        <h2 className="text-[12px] pl-2">{currCoin.symbol}-USD Orders</h2>
                    </div>
                }
                {activeOrder == "completed" &&
                    <div className="flex items-center justify-between px-2  border-b-[1px] border-[#141822] pb-1">
                        <div className="flex  items-center">
                            <div
                                className={`relative inline-block w-6 h-3 transition duration-200 ease-in ${isToggled ? 'bg-blue-500' : 'bg-gray-300'
                                    } rounded-full cursor-pointer`}
                                onClick={toggle}
                            >
                                <span
                                    className={`absolute left-0 top-0 bottom-0 w-3 h-3 bg-white rounded-full shadow-md transform transition duration-200 ease-in-out ${isToggled ? 'translate-x-3' : ''
                                        }`}
                                />
                            </div>
                            <h2 className="text-[12px] pl-2">{currCoin.symbol}-USD Orders</h2>
                        </div>
                        <div className="flex">
                            <div
                                className={`relative inline-block w-6 h-3 transition duration-200 ease-in ${isToggledcancel ? 'bg-blue-500' : 'bg-gray-300'
                                    } rounded-full cursor-pointer`}
                                onClick={toggleCancel}
                            >
                                <span
                                    className={`absolute left-0 top-0 bottom-0 w-3 h-3 bg-white rounded-full shadow-md transform transition duration-200 ease-in-out ${isToggledcancel ? 'translate-x-3' : ''
                                        }`}
                                />
                            </div>
                            <h2 className="text-[12px] pl-2">Hide Cancelled Orders</h2>
                        </div>
                    </div>
                }
                <div className="flex justify-between items-center h-5 pl-2 border-b-[1px] border-[#2C3240] ">
                    <div className="w-full text-[10px] cursor-pointer text-[#9EB1BF] flex">ASSET</div>
                    <div className="w-full text-[10px] cursor-pointer text-[#9EB1BF] flex">BALANCE</div>
                    <div className="w-full text-[10px] cursor-pointer text-[#9EB1BF] flex">INVESTED USD</div>
                    <div className="w-full text-[10px] cursor-pointer text-[#9EB1BF] flex">PORTFOLIO</div>
                </div>
                {activeOrder == "open" &&
                    userInfo.userInfo.holdings?.map((coin: any) => {

                        if (allCoins[0]) {


                            const coinInfo = allCoins.find((obj: any) => obj.symbol === coin.symbol);
                            const coinPrice = coinInfo.data[coinInfo.data.length - 1].close;
                            const currentPortfolio = coin.totalBalance * coinPrice;

                            // const difference = Math.abs(coin.invested - currentPortfolio);
                            // const average = (coin.invested + currentPortfolio) / 2;
                            // const percentageDiff = (difference / average) * 100;
                            const trade = coin.invested < currentPortfolio ? "profit" : "loss";
                            // const allTimeGains = percentageDiff.toFixed(4);

                            return (
                                <div key={coin.symbol} className={`flex justify-between items-center h-12 pl-2 text-black dark:text-white ${trade === "profit" ? 'dark:bg-[rgba(30,55,50,1.0)] bg-[#DAEFE1] border-l-4 border-green-400' : 'dark:bg-[rgba(62,31,39,1.0)] bg-[#FAE9EA] border-l-4 border-red-400'}`}>
                                    <div className="w-full text-[12px] font-bold cursor-pointer flex">{coin.symbol}</div>
                                    <div className="w-full text-[12px] font-bold cursor-pointer flex">{coin.totalBalance.toFixed(4)}</div>
                                    <div className="w-full text-[12px] font-bold cursor-pointer flex">{coin.invested}</div>
                                    <div className="w-full text-[12px] font-bold cursor-pointer flex">{currentPortfolio.toFixed(4)}</div>
                                </div>
                            )
                        }
                    })
                }
            </div>


            <div className="bg-secondary dark:bg-secondary-dark h-[300px] lg:h-[40%] mt-1 rounded flex flex-col text-[#9EB1BF]">
                <div className="flex justify-between border-b-2 border-[#2D3446]">
                    <button
                        className={`w-full focus:outline-none font-bold text-[11px] px-4 py-2 ${activeTab === 'buy' ? 'dark:bg-[#1E2433] dark:text-white border-t-4 border-[#66C37B] rounded-s-[4px]' : 'dark:bg-[#161D2B] rounded-s-[4px]'}`}
                        onClick={() => setActiveTab('buy')}
                    >
                        BUY
                    </button>
                    <button
                        className={`w-full focus:outline-none font-bold text-[11px] px-4 py-2 ${activeTab === 'sell' ? 'dark:bg-[#1E2433] dark:text-white border-t-4 border-[#F6685E] rounded-e-[4px]' : 'dark:bg-[#161D2B] rounded-e-[4px]'}`}
                        onClick={() => setActiveTab('sell')}
                    >
                        SELL
                    </button>
                </div>

                {loggedIn &&
                    <div className="flex flex-col items-center mt-20 gap-2">
                        <button onClick={() => navigate('/signin')} className="text-[12px] font-bold w-[60%] bg-[#66C37B] px-6 py-3 rounded-md text-white">LOGIN</button>
                        <span className="text-white text-[12px]">OR</span>
                        <button onClick={() => navigate('/signup')} className="text-[12px] font-bold w-[60%] border-[#66C37B] px-6 py-3 rounded-md text-white bg-transparent border">CREATE AN ACCOUNT</button>
                    </div>
                }
                {!loggedIn &&
                    <div className="flex flex-col px-2 items-center mt-2 gap-2">
                        {activeTab === "buy" &&
                            <div className="px-3 text-[#9EB1BF] flex flex-col gap-4">
                                <div className="flex justify-between items-center dark:bg-[#2D3446] rounded-md">
                                    <div className="w-[20%]">
                                        <label className="block text-[11px] text-end">AT PRICE</label>
                                        <h2 className="text-[11px] text-end font-bold">USD</h2>
                                    </div>
                                    <div className="flex items-center w-[50%] ">
                                        <input
                                            type="text"
                                            value={coinPrice}
                                            readOnly
                                            className="dark:bg-[#2D3446] dark:text-white font-bold focus:outline-none w-[90%] px-4 py-2"
                                        />
                                    </div>
                                    <span className="w-[35%] text-[12px] font-bold text-[#66C37B]">LOWEST PRICE</span>
                                </div>

                                <div className="flex justify-between items-center dark:bg-[#2D3446] rounded-md">
                                    <div className="w-[20%]">
                                        <label className="block text-[11px] text-end">AMOUNT</label>
                                        <h2 className="text-[11px] text-end font-bold">{currCoin.symbol}</h2>
                                    </div>
                                    <div className="flex items-center w-[80%] ">
                                        <input
                                            type="number"
                                            value={coinAmount}
                                            // defaultValue={0}
                                            onChange={(e) => handleCoinAmountChange(e.target.value)}
                                            className="dark:bg-[#2D3446] dark:text-white font-bold focus:outline-none w-[90%] px-4 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center dark:bg-[#2D3446] rounded-md">
                                    <div className="w-[20%]">
                                        <label className="block text-[11px] text-end">TOTAL</label>
                                        <h2 className="text-[11px] text-end font-bold">USD</h2>
                                    </div>
                                    <div className="flex items-center w-[80%] ">
                                        <input
                                            type="number"
                                            value={totalAmount}
                                            onChange={(e) => handleTotalAmountChange(e.target.value)}
                                            className="dark:bg-[#2D3446] dark:text-white font-bold focus:outline-none w-[90%] px-4 py-2"
                                        />
                                    </div>
                                </div>


                                <button onClick={() => handleBuyCoin()} className="text-sm font-bold w-full bg-[#66C37B] px-6 py-3 rounded-md text-white">BUY {currCoin.symbol}</button>
                            </div>
                        }

                        {activeTab === "sell" &&
                            <div className="px-3 text-[#9EB1BF] flex flex-col gap-4">
                                <div className="flex justify-between items-center dark:bg-[#2D3446] rounded-md">
                                    <div className="w-[20%]">
                                        <label className="block text-[11px] text-end">AT PRICE</label>
                                        <h2 className="text-[11px] text-end font-bold">USD</h2>
                                    </div>
                                    <div className="flex items-center w-[50%] ">
                                        <input
                                            type="text"
                                            value={coinPrice}
                                            readOnly
                                            className="dark:bg-[#2D3446] dark:text-white font-bold focus:outline-none w-[90%] px-4 py-2"
                                        />
                                    </div>
                                    <span className="w-[35%] text-[12px] font-bold text-[#F6685E]">HIGHEST PRICE</span>
                                </div>

                                <div className="flex justify-between items-center dark:bg-[#2D3446] rounded-md">
                                    <div className="w-[20%]">
                                        <label className="block text-[11px] text-end">AMOUNT</label>
                                        <h2 className="text-[11px] text-end font-bold">{currCoin.symbol}</h2>
                                    </div>
                                    <div className="flex items-center w-[80%] ">
                                        <input
                                            type="number"
                                            value={coinAmount}
                                            onChange={(e) => handleCoinAmountChange(e.target.value)}
                                            className="dark:bg-[#2D3446] dark:text-white font-bold focus:outline-none w-[90%] px-4 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center dark:bg-[#2D3446] rounded-md">
                                    <div className="w-[20%]">
                                        <label className="block text-[11px] text-end">TOTAL</label>
                                        <h2 className="text-[11px] text-end font-bold">USD</h2>
                                    </div>
                                    <div className="flex items-center w-[80%] ">
                                        <input
                                            type="number"
                                            value={totalAmount}
                                            onChange={(e) => handleTotalAmountChange(e.target.value)}
                                            className="dark:bg-[#2D3446] dark:text-white font-bold focus:outline-none w-[90%] px-4 py-2"
                                        />
                                    </div>
                                </div>


                                <button onClick={() => handleSellCoin()} className="text-sm font-bold w-full bg-[#F6685E] px-6 py-3 rounded-md text-white">SELL {currCoin.symbol}</button>
                            </div>
                        }

                    </div>
                }
            </div>
        </div>
    )
}
