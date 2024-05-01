import {createAction, createReducer, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../axiosURL.js";

export const loadProfiles = createAsyncThunk("fitness/loadProfiles", async () => {
    const res = await axios.get("/fitness/profiles", {withCredentials: true})
    return res.data
});

export const updateProfile = createAction("fitness/updateProfile")
export const createProfile = createAction("fitness/createProfile")

const initialState = {
    profile: []
};

const profileReducer = createReducer(initialState, (builder) => {
    builder.addCase(loadProfiles.fulfilled, (state, action) => {
        return{
            ...state,
            profile: action.payload
        }
    })
    .addCase(createProfile, (state, action) => {
        const profileCopy = [...state.profile]
        const newProfile = {
            name: action.payload.name, 
            age: action.payload.age,
            height: action.payload.height,
            weight: action.payload.weight,
            sex: action.payload.sex,
            userId: action.payload.userId
        }
        profileCopy.push(newProfile)
        return {
            ...state,
            profile: profileCopy
        }
    })
    .addCase(updateProfile, (state, action) => {
        const profileIndex = state.profile.findIndex(t => t._id === action.payload.profileId)
        const profileCopy = {...state.profile[profileIndex]}
        const { profileId, ...rest } = action.payload;
        Object.assign(profileCopy, rest);
        const profileArrayCopy = [...state.profile]
        profileArrayCopy[profileIndex] = profileCopy
        return{
            ...state,
            profile: profileArrayCopy 
        }
    })
});

export default profileReducer;