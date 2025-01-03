interface Candlestick {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
}

// Function to check if a candlestick is a hammer
export function isHammerCandlestick(candlestick: Candlestick): boolean {
    const { open, high, low, close } = candlestick;

    // Calculate the real body, upper shadow, and lower shadow
    const realBody = Math.abs(open - close);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;

    // Determine if the candlestick satisfies hammer conditions
    const isHammer =
        realBody <= (high - low) * 0.2 &&  // Real body is small (less than 20% of total range)
        lowerShadow >= realBody * 2 &&    // Lower shadow is at least twice the real body
        upperShadow <= realBody * 0.1;    // Upper shadow is very small

    return isHammer; // Return true if it's a hammer, false otherwise
}


// Function to check if a candlestick is an inverted hammer
export function isInvertedHammerCandlestick(candlestick: Candlestick): boolean {
    const { open, high, low, close } = candlestick;

    // Calculate the real body, upper shadow, and lower shadow
    const realBody = Math.abs(open - close);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;

    // Determine if the candlestick satisfies inverted hammer conditions
    const isInvertedHammer =
        realBody <= (high - low) * 0.2 &&  // Real body is small (less than 20% of total range)
        upperShadow >= realBody * 2 &&      // Upper shadow is at least twice the real body
        lowerShadow <= realBody * 0.1;     // Lower shadow is very small

    return isInvertedHammer; // Return true if it's an inverted hammer, false otherwise
}


export function calculateSMA(data: Candlestick[], period: number) {
    const smaData = [];
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, cur) => acc + cur.close, 0);
        const sma = sum / period;
        smaData.push({ time: data[i].time, value: sma });
    }
    return smaData;
}


export function findCrossovers(
    smaShort: { time: number; value: number }[],
    smaLong: { time: number; value: number }[]
) {
    const crossovers = [];

    // Align the two datasets based on their starting times
    const alignedShort = smaShort.filter(short =>
        smaLong.some(long => long.time === short.time)
    );
    const alignedLong = smaLong.filter(long =>
        smaShort.some(short => short.time === long.time)
    );

    const minLength = Math.min(alignedShort.length, alignedLong.length);

    for (let i = 1; i < minLength; i++) {
        const prevShort = alignedShort[i - 1].value;
        const prevLong = alignedLong[i - 1].value;
        const currShort = alignedShort[i].value;
        const currLong = alignedLong[i].value;

        if (prevShort <= prevLong && currShort > currLong) {
            // Golden Cross
            crossovers.push({
                type: "Golden Cross",
                time: alignedShort[i].time,
                text: 'Golden Cross',
                position: "aboveBar",
                color: 'lightgreen',
                shape: "circle",
                size: 2,
            });
        } else if (prevShort >= prevLong && currShort < currLong) {
            // Death Cross
            crossovers.push({
                type: "Death Cross",
                time: alignedShort[i].time,
                text: 'Death Cross',
                position: "aboveBar",
                color: 'red',
                shape: "circle",
                size: 2,
            });
        }
    }

    return crossovers;
}


