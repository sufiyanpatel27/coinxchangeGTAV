import { useEffect } from 'react';
import star from '../assets/star.svg'
import maximize from '../assets/maximize.svg'
import formula from '../assets/formula.svg'
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useDispatch } from 'react-redux';
import { setCoins } from '../feature/coin/coinSlice';
import { createChart, ColorType, CrosshairMode } from "lightweight-charts";
import axios from 'axios';

import * as customTechnicalIndicators from '../feature/CustomTechnicalIndicators';


export default function CoinInfoUp({ mode }: { mode: string }) {

    const userInfo: any = useSelector((state: RootState) => state.userInfo);

    const dispatch = useDispatch();
    const allCoins = useSelector((state: RootState) => state.coin.allCoins); // Assuming allCoins is in your Redux store
    const currCoin: any = useSelector((state: RootState) => state.coin.currCoin);


    const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:5500/";

    useEffect(() => {
        if (currCoin.name) {
            document.title = `CoinXchange - ${currCoin.name}`;
            const chartOptions = {
                layout: { textColor: '#9EB1BF', background: { type: ColorType.Solid, color: `${mode}` } }, grid: {
                    vertLines: { color: '#2C3240' },
                    horzLines: { color: '#2C3240' },
                },
            };
            const body = document.getElementById("container")
            if (body) {
                body.innerHTML = ""

                const chart = createChart(body, chartOptions);
                const candlestickSeries = chart.addCandlestickSeries({ upColor: '#66C37B', downColor: '#F6685E', borderVisible: false, wickUpColor: '#66C37B', wickDownColor: '#F6685E' });


                candlestickSeries.setData(currCoin.data);


                // SMA Only for Franklin
                if (userInfo.userInfo.name === 'Franklin') {
                    // SMA graph
                    const smaShort = customTechnicalIndicators.calculateSMA(currCoin.data, 50); // Short-term SMA
                    const smaLong = customTechnicalIndicators.calculateSMA(currCoin.data, 200); // Long-term SMA

                    const shortSmaSeries = chart.addLineSeries({
                        color: 'blue',
                        lineWidth: 2,
                    });
                    const longSmaSeries = chart.addLineSeries({
                        color: 'orange',
                        lineWidth: 2,
                    });

                    shortSmaSeries.setData(smaShort);
                    longSmaSeries.setData(smaLong);

                    const crossovers = customTechnicalIndicators.findCrossovers(smaShort, smaLong);

                    longSmaSeries.setMarkers(crossovers.map((marker: any) => ({
                        time: marker.time,
                        position: marker.position,
                        color: marker.color,
                        shape: marker.shape,
                        size: marker.size,
                        text: marker.text,
                    })));
                }


                chart.priceScale("right").applyOptions({
                    borderColor: '#818898',
                });

                chart.timeScale().applyOptions({
                    borderColor: '#818898',
                });

                chart.applyOptions({
                    crosshair: {
                        mode: CrosshairMode.Normal,
                        vertLine: {
                            color: '#9EB1BF',
                            labelBackgroundColor: '#4B4F57',
                        },
                        horzLine: {
                            color: '#9EB1BF',
                            labelBackgroundColor: '#4B4F57',
                        },
                    },
                });



                let isFetching = false; // Flag to check if API call is in progress

                let updatedData = currCoin.data;

                function myVisibleTimeRangeChangeHandler(newVisibleTimeRange: any) {
                    if (newVisibleTimeRange === null) {
                        // handle null
                        return;
                    }

                    // Check if an API call is in progress
                    if (isFetching) {
                        return; // Prevent making a new API call if one is already in progress
                    }

                    if (newVisibleTimeRange.from <= currCoin.data[0].time) {
                        // console.log(newVisibleTimeRange.from);

                        // Set flag to indicate API call is in progress
                        isFetching = true;

                        // Fetch the additional data for the current coin
                        axios
                            .get(`${base_url}coins/${currCoin._id}?time=${newVisibleTimeRange.from}`)
                            .then((res) => {
                                const fetchedData = res.data;

                                const updatedCoins = allCoins.map((coin: any) => {
                                    if (coin._id === currCoin._id) {
                                        return {
                                            ...coin,
                                            data: [...fetchedData, ...coin.data],
                                        };
                                    }
                                    return coin;
                                });

                                dispatch(setCoins(updatedCoins));



                                updatedData = [...fetchedData, ...updatedData];
                                candlestickSeries.setData(updatedData);


                                console.log("coins updated")
                            })
                            .catch((error) => {
                                console.error("Error fetching data:", error);
                            })
                            .finally(() => {
                                // Reset flag and set timeout
                                setTimeout(() => {
                                    isFetching = false;
                                }, 5500); // 5 seconds
                            });
                    }
                }



                chart.timeScale().subscribeVisibleTimeRangeChange(myVisibleTimeRangeChangeHandler);


                let symbolName = currCoin.symbol + "/USD"
                let timeFrame = "1M"
                let open = currCoin.data[currCoin.data.length - 1].open
                let high = currCoin.data[currCoin.data.length - 1].high
                let low = currCoin.data[currCoin.data.length - 1].low
                let close = currCoin.data[currCoin.data.length - 1].close
                let currCoinData = `O: ${open} H: ${high} L: ${low} C: ${close}`;

                const legend = document.createElement('div');
                legend.setAttribute('style', `color: #9EB1BF; display: flex; position: absolute; left: 12px; top: 12px; z-index: 1; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`);
                body.appendChild(legend);


                const firstRow = document.createElement('div');
                firstRow.innerHTML = symbolName;
                firstRow.style.paddingRight = '10px';
                firstRow.style.fontWeight = 'bold'; // Note: Corrected 'semibold' to 'bold' for correct CSS value
                legend.appendChild(firstRow);

                const secondElement = document.createElement('div');
                secondElement.innerHTML = timeFrame;
                secondElement.style.paddingRight = '10px'; // Set padding-right using style property
                legend.appendChild(secondElement);

                const thirdElement = document.createElement('div');
                thirdElement.innerHTML = currCoinData;
                // No need to set an empty style, you can skip this line
                legend.appendChild(thirdElement);


                chart.subscribeCrosshairMove(param => {
                    let open = currCoin.data[currCoin.data.length - 1].open
                    let high = currCoin.data[currCoin.data.length - 1].high
                    let low = currCoin.data[currCoin.data.length - 1].low
                    let close = currCoin.data[currCoin.data.length - 1].close
                    if (param.time) {
                        param.seriesData.forEach((value: any) => {
                            open = value.open;
                            high = value.high;
                            low = value.low;
                            close = value.close;
                        })
                    }
                    firstRow.innerHTML = `${symbolName}`;
                    secondElement.innerHTML = `${timeFrame}`
                    thirdElement.innerHTML = `O: ${open} H: ${high} L: ${low} C: ${close}`
                });


                // code block for live data update in the Graph
                const interval = setInterval(async () => {
                    axios.get(base_url + 'singlecoins/' + currCoin._id)
                        .then((res) => res.data[0].data[0])
                        .then((res) => {
                            candlestickSeries.update(res);
                            console.log("graph updated after 1 minute");
                        })
                }, 60000)


                chart.timeScale().scrollToPosition(5, true)
                chart.timeScale().applyOptions({ timeVisible: true })


                return () => clearInterval(interval);


            }
        }
    }, [currCoin])

    let lastPrice: number = 0;
    let highPrice: number = 0;
    let lowPrice: number = 0;
    let openPrice: number = 0;
    if (currCoin.name) {
        lastPrice = currCoin.data[currCoin.data.length - 1].close
        highPrice = currCoin.data[currCoin.data.length - 1].high
        lowPrice = currCoin.data[currCoin.data.length - 1].low
        openPrice = currCoin.data[currCoin.data.length - 1].open
    }

    return (
        <div className="bg-secondary dark:bg-secondary-dark h-full lg:h-[60%] mb-1 rounded w-full
            flex flex-col">
            <div className="flex justify-between p-1 pl-4 h-8 border-b-2 border-[#2D3446] cursor-pointer">
                <div className="flex">
                    <div className="flex">
                        <div className="font-bold text-sm">{currCoin.symbol}/USD</div>
                        <div className="text-sm text-[#9EB1BF] pl-1">{currCoin.name}</div>
                    </div>
                </div>
                <div className="flex pr-1">
                    <div className="flex pr-4">
                        <div className="text-sm text-[#9EB1BF] pr-2">LAST PRICE</div>
                        <div className="font-bold text-sm">$ {lastPrice}</div>
                    </div>
                    <div className='flex'>
                        <img src={star} alt="Logo" className='w-[15px]' />
                    </div>
                </div>
            </div>
            <div className="flex justify-between p-1 pl-4 h-8 border-b-2 border-[#2D3446] ">
                <div className="flex text-[#9EB1BF] text-[11px] gap-2 justify-center items-center">
                    <div className='flex justify-center items-center cursor-pointer text-white border-b-2 border-[#EAC808] h-8'>1M</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>5M</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>15M</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>30M</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>1H</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>2M</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>4M</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>6M</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>12H</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>1D</div>
                    <div className='flex justify-center items-center cursor-pointer hover:text-white hover:border-b-2 hover:border-[#EAC808] h-8'>1W</div>
                </div>
                <div className="flex pr-1 justify-center items-center">
                    <div className="flex pr-4 gap-2">
                        <div className="text-[11px] text-[#9EB1BF]">OPEN</div>
                        <div className="font-semibold text-[11px]">{openPrice}</div>
                        <div className="text-[11px] text-[#9EB1BF]">HIGH</div>
                        <div className="font-semibold text-[11px]">{highPrice}</div>
                        <div className="text-[11px] text-[#9EB1BF]">LOW</div>
                        <div className="font-semibold text-[11px]">{lowPrice}</div>
                    </div>
                    <div className='hidden md:flex md:gap-4'>
                        <div className='border-l-2 cursor-pointer border-[#2D3446] flex justify-center items-center w-6'>
                            <img src={formula} alt="Logo" className='w-[15px]' />
                        </div>
                        <div className='border-l-2 cursor-pointer border-[#2D3446] flex justify-center items-center w-6'>
                            <img src={maximize} alt="Logo" className='w-[15px]' />
                        </div>
                    </div>
                </div>
            </div>
            <div id='container' className='w-full relative h-[300px] lg:h-full flex justify-center items-center cursor-crosshair font-semibold text-xl text-[#9EB1BF]'>
                select a Coin from the Coin list
            </div>
        </div>
    )
}
