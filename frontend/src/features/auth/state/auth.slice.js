import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "auth",
    //state initially
    initialState : {
        user : null,
        loading : false,
        error : null,
    },
    reducers : {
        //setUser replaces the old user with the new user data.
        //action.payload is simply the data you send to Redux 📦
        setUser : (state,action) => {
            state.user = action.payload
        },
        setLoading : (state,action) => {
            state.loading = action.payload
        },
        setError : (state,action) => {
            state.error = action.payload
        }
    }
})

export const {setError,setLoading,setUser} = authSlice.actions //“Take these out of authSlice.actions and make them usable anywhere.”
export default authSlice.reducer //reducer = the thing that actually updates state.