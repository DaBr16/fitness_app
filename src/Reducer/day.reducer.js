import {createAction, createReducer, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../axiosURL.js";

export const loadDays = createAsyncThunk("fitness/loadDays", async (data) => {
    const res = await axios.get(`/fitness/day/${data.profileId}/${data.date}`, {withCredentials: true})
    console.log(res.data)
    return res.data
});

export const updateDay = createAction("fitness/updateDay")
export const createDay = createAction("fitness/createDay")

const initialState = {
    day: []
};

const dayReducer = createReducer(initialState, (builder) => {
    builder.addCase(loadDays.fulfilled, (state, action) => {
        return{
            ...state,
            day: action.payload
        }
    })
    .addCase(createDay, (state, action) => {
    const dayCopy = [...state.day];
    
    const newDay = {
        date: action.payload.date, 
        food: [
            {
                foodId: action.payload.foodId,
                amount: action.payload.amount
            }
        ],
        exercise: [
            {
                exerciseId: action.payload.exerciseId,
                timeInMinutes: action.payload.timeInMinutes
            }
        ],
        profileId: action.payload.profileId 
    };

    dayCopy.push(newDay);

    return {
        ...state,
        day: dayCopy
    };
    })
    .addCase(updateDay, (state, action) => {
        const dayIndex = state.day.findIndex(t => t._id === action.payload.dayId)
        const dayCopy = {...state.day[dayIndex]}
        const { dayId, ...rest } = action.payload;
        Object.assign(dayCopy, rest);
        const dayArrayCopy = [...state.day]
        dayArrayCopy[dayIndex] = dayCopy
        return{
            ...state,
            day: dayArrayCopy 
        }
    })
});

export default dayReducer;