import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { setUserInfo } from "../feature/coin/userSlice";
import { useAuth } from '../hooks/useAuth';



export default function Funds() {

    const dispatch = useDispatch<AppDispatch>();

    const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:5500/";

    const userInfo: any = useSelector((state: RootState) => state.userInfo);
    const allCoins = useSelector((state: RootState) => state.coin.allCoins);

    const [mode, setMode] = useState(true);
    const handleTheme = () => {
        setMode(!mode);
    };

    const [cryptoHoldings, setCryptoHoldings] = useState(0);
    const [investedValue, setInvestedValue] = useState(0);
    const [totalPortfolio, setTotalPortfolio] = useState(0);
    const [allTimeGains, setAllTimeGains] = useState(0);
    const [trade, setTrade] = useState("");

    const [Amount, setAmount] = useState(0);

    const withdrawUSD = (Amount: number, username: string) => {
        console.log(Amount);
        console.log(username);
        axios.post(base_url + 'withdrawUSD',
            {
                Amount: Amount,
                username: username
            }
        ).then((res) => {
            dispatch(setUserInfo(res.data.newUserInfo))
        }).catch((err) => {
            console.log(err)
        })
    }

    const depositUSD = (Amount: number, username: string) => {
        console.log(Amount);
        console.log(username);
        axios.post(base_url + 'depositUSD',
            {
                Amount: Amount,
                username: username
            }
        ).then((res) => {
            dispatch(setUserInfo(res.data.newUserInfo))
        }).catch((err) => {
            console.log(err)
        })
    }

    const formatNumber = (num: any) => {
        if (Math.abs(num) >= 1.0e+9) {
            return (num / 1.0e+9).toFixed(2) + "B"; // Billions
        } else if (Math.abs(num) >= 1.0e+6) {
            return (num / 1.0e+6).toFixed(2) + "M"; // Millions
        } else if (Math.abs(num) >= 1.0e+3) {
            return (num / 1.0e+3).toFixed(2) + "K"; // Thousands
        } else {
            return num.toString(); // Less than 1000
        }
    }

    useEffect(() => {
        document.title = "CoinXchange";
        let tempCryptoHoldings = 0;
        let tempInvestedValue = 0;
        let tempTotalPortfolio = 0;

        userInfo.userInfo.holdings?.forEach((coin: any) => {
            const coinInfo = allCoins.find((obj) => obj.symbol === coin.symbol);
            const coinPrice = coinInfo.data[coinInfo.data.length - 1].close;
            const currentPortfolio = coin.totalBalance * coinPrice;

            tempCryptoHoldings += currentPortfolio;
            tempInvestedValue += coin.invested;
            tempTotalPortfolio += currentPortfolio;
        });

        const difference = Math.abs(tempCryptoHoldings - tempInvestedValue);
        // const average = (tempInvestedValue + tempCryptoHoldings) / 2;
        const percentageDiff = (difference / tempInvestedValue) * 100;
        const trade = tempInvestedValue < tempCryptoHoldings ? "+" : "-";
        setTrade(trade);

        setCryptoHoldings(tempCryptoHoldings);
        setInvestedValue(tempInvestedValue);
        setTotalPortfolio(tempTotalPortfolio);
        setAllTimeGains(percentageDiff);
    }, [userInfo, allCoins]);

    const { userId, email, token } = useAuth();

    useEffect(() => {
        document.title = "CoinXchange";
        if (email) {
            axios.get(base_url + 'userinfo/' + userId, {
                headers: {
                    Authorization: token
                }
            })
                .then((res) => dispatch(setUserInfo(res.data)))
                .catch((err) => console.log("error here:", err))
        }
    }, [email])


    const handleSellCoin = (coin: any, currentPortfolio: any) => {
        if (confirm("Do you want to proceed the Transaction?")) {
            console.log(coin)
            axios.post(base_url + 'sellCoin/' + userInfo.userInfo.userId,
                {
                    coinName: coin.name,
                    coinSymbol: coin.symbol,
                    coinAmount: coin.totalBalance,
                    totalAmount: currentPortfolio
                }
            )
                .then((res) => {
                    dispatch(setUserInfo(res.data.newUserInfo));
                    alert(`${coin.name} sold successfully.`)
                })
                .catch((err) => alert(err))
        } else {
            console.log("transactino canceled")
        }
    }

    return (
        <div className={`${mode && "dark"}`}>
            <div className='min-h-screen bg-[#F0F2F5] dark:bg-[#101623] text-white flex flex-col'>
                <Navbar mode={mode} handleTheme={handleTheme} activeTab="FUNDS" />
                <h2 className='absolute mt-12 mx-4 lg:mt-20 lg:mx-24 text-xl text-black dark:text-white font-semibold'>Hi {userInfo.userInfo.name}</h2>
                <h2 className='mt-12 mx-4 lg:mt-16 lg:mx-24 text-sm text-black dark:text-[#9EB1BF]'>{userInfo.userInfo.email}</h2>
                <div className='w-full h-full text-black dark:text-white flex flex-col items-center pt-10 px-4 sm:px-6 lg:px-24'>
                    <div className='w-full flex justify-between border-b-[1px] border-[#3A4152] pb-4'>
                        <div className='flex'>
                            <div className='px-2 sm:px-4 border-b-2 border-[#3067F0]'>
                                <h2 className='text-[#3067F0] font-bold text-sm'>BALANCES</h2>
                            </div>
                            <div className='px-2 sm:px-4'>
                                <h2 className='text-[#9EB1BF] font-bold text-sm'>TRANSFER HISTORY</h2>
                            </div>
                        </div>
                        <div className='flex gap-2 sm:gap-4'>
                            <input
                                type="number"
                                placeholder="Amount"
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="px-4 pl-5 text-[12px] dark:text-white dark:bg-[#2D3446] border-[1px] border-[#3A4152] rounded-[5px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div>
                                <button onClick={() => withdrawUSD(Amount, userInfo.userInfo.name)} className='dark:bg-[#1E2433] text-[12px] font-bold px-2 py-2 sm:px-3 sm:py-2 rounded-md border-[1px] border-[#3A4152] dark:text-[#9EB1BF]'>Withdraw USD</button>
                            </div>
                            <div>
                                <button onClick={() => depositUSD(Amount, userInfo.userInfo.name)} className='bg-[#66C37B] text-[12px] font-bold px-2 py-2 sm:px-3 sm:py-2 rounded-md'>Deposit USD</button>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-wrap justify-center gap-3 w-full mt-10 text-sm'>
                        <div className='w-full sm:w-1/2 lg:w-[24%] rounded-md bg-secondary dark:bg-secondary-dark px-4 py-4 flex flex-col gap-2 justify-center'>
                            <h2 className='font-bold text-sm'>Total portfolio value</h2>
                            <h2 className='font-bold text-xl'>${formatNumber(totalPortfolio.toFixed(4))}</h2>
                        </div>
                        <div className='w-full sm:w-1/2 lg:w-[24%] rounded-md bg-secondary dark:bg-secondary-dark px-4 py-4 flex flex-col gap-2 justify-center'>
                            <div className='flex justify-between'>
                                <h2 className='dark:text-[#cdd2df]'>Crypto Holdings</h2>
                                <h2 className='font-bold'>${formatNumber(cryptoHoldings.toFixed(4))}</h2>
                            </div>
                            <div className='flex justify-between'>
                                <h2 className='dark:text-[#cdd2df]'>Invested Value</h2>
                                <h2 className='font-bold'>${formatNumber(investedValue.toFixed(4))}</h2>
                            </div>
                        </div>
                        <div className='w-full sm:w-1/2 lg:w-[24%] rounded-md bg-secondary dark:bg-secondary-dark px-4 py-4 flex justify-between items-center'>
                            <div className='dark:text-[#cdd2df] flex'>
                                All time Gains
                                <h2 className={`font-bold text-[12px] ml-2 px-1 ${trade === '+' ? 'text-[#66C37B]' : 'text-[#F6685E] bg-[#f6685e28]'}`}>{trade}{allTimeGains.toFixed(2)}%</h2>
                            </div>
                            <h2 className={`font-bold ${trade === '+' ? 'text-[#66C37B]' : 'text-[#F6685E]'}`}>${formatNumber((cryptoHoldings - investedValue).toFixed(4))}</h2>
                        </div>
                        <div className='w-full sm:w-1/2 lg:w-[24%] rounded-md bg-secondary dark:bg-secondary-dark px-4 py-4 flex justify-between items-center'>
                            <h2 className='dark:text-[#cdd2df]'>USD Balance</h2>
                            <h2 className='font-bold'>${formatNumber(userInfo.userInfo.balance)}</h2>
                        </div>
                    </div>

                    <div className='mt-10 w-full'>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="dark:bg-[#161D2B] dark:text-[#ABB1BF]">
                                    <tr>
                                        <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider">
                                            Assets
                                        </th>
                                        <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider">
                                            Total Balance
                                        </th>
                                        <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider">
                                            invested USD
                                        </th>
                                        <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider">
                                            Current Portfolio
                                        </th>
                                        <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider">
                                            All - Time Gains
                                        </th>
                                        <th scope="col" className="px-2 sm:px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userInfo.userInfo.name && userInfo.userInfo.holdings.map((coin: any, index: number) => {

                                        const coinInfo = allCoins.find((obj) => obj.symbol === coin.symbol);
                                        const coinPrice = coinInfo.data[coinInfo.data.length - 1].close;
                                        const currentPortfolio = coin.totalBalance * coinPrice;
                                        const difference = Math.abs(currentPortfolio - coin.invested);
                                        // const average = (coin.invested + currentPortfolio) / 2;
                                        const percentageDiff = (difference / coin.invested) * 100;
                                        const trade = coin.invested < currentPortfolio ? "profit" : "loss";
                                        const allTimeGains = percentageDiff.toFixed(2);

                                        return (
                                            <tr key={index} className={`${index % 2 === 0 ? 'dark:bg-[#1E2433]' : 'dark:bg-[#161D2B]'} hover:bg-[#1E2433] hover:border-y border-[#6f717560]`}>
                                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                                                    <h2 className='font-bold'>{coin.name}</h2>
                                                    <h2 className='font-thin pt-1 text-sm text-[#ABB1BF]'>{coin.symbol}</h2>
                                                </td>
                                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{formatNumber(coin.totalBalance.toFixed(4))} {coin.symbol}</td>
                                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap">$ {formatNumber(coin.invested)}</td>
                                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap">$ {formatNumber(currentPortfolio.toFixed(4))}</td>
                                                <td className={`px-2 sm:px-6 py-4 whitespace-nowrap ${trade === 'profit' ? 'text-[#66C37B]' : 'text-[#F6685E]'}`}>
                                                    <h2>{formatNumber((currentPortfolio - coin.invested).toFixed(4))}</h2>
                                                    <h2 className='font-bold pt-1 text-[12px]'>{trade === "profit" ? "+" : "-"} {allTimeGains}%</h2>
                                                </td>
                                                <td className="px-2 sm:px-6 py-4 whitespace-nowrap flex justify-evenly">
                                                    <button className='border rounded-md px-2 sm:px-4 py-1 font-bold text-[#ABB1BF] border-[#51545a] text-sm hover:bg-[#66C378] hover:text-white'>Deposit</button>
                                                    <button onClick={() => handleSellCoin(coin, currentPortfolio)} className='border rounded-md px-2 sm:px-4 py-1 font-bold text-[#ABB1BF] border-[#51545a] text-sm hover:bg-[#F6685E] hover:text-white'>Withdraw</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
