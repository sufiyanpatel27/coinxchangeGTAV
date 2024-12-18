import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import down_arrow from '../assets/down_arrow.svg'
import arrow_up_green from '../assets/arrow_up_green.svg'
import arrow_down_red from '../assets/arrow_down_red.svg'


export default function CoininfoDown() {

    const currCoin: any = useSelector((state: RootState) => state.coin.currCoin);


    return (
        <div className="mt-1 hidden lg:flex justify-between h-[40%]">
            <div className="w-[63%] mr-1 bg-white dark:bg-[#1E2433] rounded flex flex-col">
                <div className="flex justify-between items-center pl-4 h-8 border-b-2 border-[#2D3446] cursor-pointer">
                    <div className="flex h-full">
                        <div className="flex pr-2 justify-center items-center"><img src={down_arrow} alt="Logo" className='w-[10px]' /></div>
                        <div className="text-[11px] flex justify-center items-center">ORDER BOOK</div>
                    </div>
                    <div className="flex h-full">
                        <div className="text-[11px] flex justify-center items-center px-3 font-semibold border-t-4 border-t-[#66C37B] border-x-2 border-x-[#2D3446]">MARKET DEPTH</div>
                        <div className="text-[11px] flex justify-center items-center px-3 font-semibold text-[#9EB1BF] bg-[#161D2B] ">ORDER VOLUME</div>
                    </div>
                </div>
                <div className="flex justify-between items-center h-5">
                    <div className="flex w-[50%] px-4">
                        <div className="w-full pl-20 justify-end items-center text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex">VOLUME</div>
                        <div className="w-full justify-end items-center text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex">BUY PRICE</div>
                    </div>
                    <div className="flex w-[50%] px-4">
                        <div className="w-full justify-start items-center text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex">SELL PRICE</div>
                        <div className="w-full justify-start pr-20 items-center text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex">VOLUME</div>
                    </div>
                </div>
                {currCoin.name &&
                    currCoin.trades.map((_trade:any, i: number) => {
                        if (i < 8) {
                            const coinBought = currCoin.trades[currCoin.trades.length - 1 - i].bought;
                            const coinSold = currCoin.trades[currCoin.trades.length - 1 - i].sold;
                            const coinBoughtStyle = (coinBought / currCoin.users) * 100
                            const coinSoldStyle = (coinSold / currCoin.users) * 100
                            const highValue = currCoin.data[currCoin.data.length - 1 - i].high;
                            const lowValue = currCoin.data[currCoin.data.length - 1 - i].low;

                            return (
                                <div key={i} className="flex h-[27px]">
                                    <div className="flex w-[50%] h-full px-4" style={{
                                        background: `linear-gradient(to left, rgba(30,55,50,1.0) ${coinBoughtStyle}%, transparent ${coinBoughtStyle}%)`,
                                    }}>
                                        <div className="w-full pl-20 justify-end items-center text-[12px] font-semibold cursor-pointer flex">{coinBought / currCoin.users}</div>
                                        <div
                                            className="w-full hover:text-white justify-end items-center text-[12px] font-semibold cursor-pointer text-[#66C37B] flex"

                                        >
                                            {highValue}
                                        </div>
                                    </div>
                                    <div className="flex w-[50%] px-4" style={{
                                        background: `linear-gradient(to right, rgba(62,31,39, 1.0) ${coinSoldStyle}%, transparent ${coinSoldStyle}%)`
                                    }}>
                                        <div
                                            className="w-full hover:text-white justify-start items-center text-[12px] font-semibold cursor-pointer text-[#F6685E] flex"

                                        >

                                            {lowValue}
                                        </div>
                                        <div className="w-full pr-20 justify-start items-center text-[12px] font-semibold cursor-pointer flex">{coinSold / currCoin.users}</div>
                                    </div>
                                </div>
                            );

                        }
                    })
                }
            </div>
            <div className="w-[37%] ml-1 bg-white dark:bg-[#1E2433] rounded flex flex-col">
                <div className="flex justify-between items-center pl-4 h-8 border-b-2 border-[#2D3446] cursor-pointer">
                    <div className="flex h-full">
                        <div className="flex pr-2 justify-center items-center"><img src={down_arrow} alt="Logo" className='w-[10px]' /></div>
                        <div className="text-[11px] flex justify-center items-center">TRADE HISTORY</div>
                    </div>
                </div>
                <div className="flex justify-between items-center h-5">
                    <div className="w-full justify-center text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex">PRICE</div>
                    <div className="w-full justify-center text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex">VOLUME</div>
                    <div className="w-full justify-center text-[10px] font-semibold cursor-pointer text-[#9EB1BF] flex">TIME</div>
                </div>
                {currCoin.name &&
                    currCoin.data.map((_data: any, i: number) => {
                        if (i < 8) {
                            const coinBought = currCoin.trades[currCoin.trades.length - 1 - i].bought;
                            const coinSold = currCoin.trades[currCoin.trades.length - 1 - i].sold;
                            const highValue = currCoin.data[currCoin.data.length - 1 - i].high;
                            const lowValue = currCoin.data[currCoin.data.length - 1 - i].low;

                            let price: number;
                            let volume: number;
                            let style: any;
                            let textStyle: any;
                            if (coinBought > coinSold) {
                                price = highValue
                                volume = coinBought / currCoin.users
                                style = "up"
                                textStyle = "#66C37B"
                            } else {
                                price = lowValue
                                volume = coinSold / currCoin.users
                                style = "down"
                                textStyle = "#F6685E"
                            }

                            const tradeTime = currCoin.data[currCoin.data.length - 1 - i].time;

                            const time = new Date(tradeTime * 1000).toLocaleTimeString().split(" ")[0];

                            return (
                                <div key={i} className={`flex h-[27px] justify-center items-center ${style == "up" ? 'dark:bg-[#1E3732] bg-[#DAEFE1]' : 'dark:bg-[#3E1F27]  bg-[#FAE9EA]'}`}>
                                    <div className="w-full justify-center items-center text-[12px] font-semibold cursor-pointer flex" style={{ color: `${textStyle}` }}>
                                        {textStyle == "#66C37B" &&
                                            <img src={arrow_up_green} alt="Logo" className='w-[14px]' />
                                        }
                                        {textStyle == "#F6685E" &&
                                            <img src={arrow_down_red} alt="Logo" className='w-[14px]' />
                                        }
                                        {price}
                                    </div>
                                    <div className="w-full justify-center items-center text-[12px] font-semibold cursor-pointer flex">{volume}</div>
                                    <div className="w-full justify-center items-center text-[12px] fontc-semibold cursor-pointer flex">{time}</div>
                                </div>
                            );

                        }
                    })
                }
            </div>
        </div >
    )
}