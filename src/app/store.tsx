import { configureStore } from '@reduxjs/toolkit';
import coinReducer from '../feature/coin/coinSlice'
import userInfoReducer from '../feature/coin/userSlice'

export const store = configureStore({
  reducer: {
    coin: coinReducer,
    userInfo: userInfoReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
