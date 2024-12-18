import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userInfoState {
    userInfo: Object
}

const initialState: userInfoState = {
    userInfo: {}
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<any>) => {
            state.userInfo = action.payload;
        },
    },
});

export const { setUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
