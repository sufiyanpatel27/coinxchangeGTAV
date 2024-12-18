import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoinState {
  allCoins: any[];
  currCoin: Object;
}

const initialState: CoinState = {
  allCoins: [],
  currCoin: {},
};

const coinSlice = createSlice({
  name: 'allCoins',
  initialState,
  reducers: {
    setCoins: (state, action: PayloadAction<any[]>) => {
      state.allCoins = action.payload;
    },
    setCurrCoin: (state, action: PayloadAction<Object>) => {
      state.currCoin = action.payload;
    }
  },
});

export const { setCoins, setCurrCoin } = coinSlice.actions;

export default coinSlice.reducer;
