import {createAction, createReducer, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../axiosURL.js";

export const loadExercises = createAsyncThunk("fitness/loadExercises", async () => {
    const res = await axios.get("/fitness/exercises", {withCredentials: true})
    return res.data
});

export const updateExercise = createAction("fitness/updateExercise")
export const createExercise = createAction("fitness/createExercise")

const initialState = {
    exercise: []
};

const exerciseReducer = createReducer(initialState, (builder) => {
    builder.addCase(loadExercises.fulfilled, (state, action) => {
        return{
            ...state,
            exercise: action.payload
        }
    })
    .addCase(createExercise, (state, action) => {
        const exerciseCopy = [...state.exercise]
        const newExercise = {
            name: action.payload.name, 
            baseTime: action.payload.baseTime,
            energyBurned: action.payload.energyBurned 
        }
        exerciseCopy.push(newExercise)
        return {
            ...state,
            exercise: exerciseCopy
        }
    })
    .addCase(updateExercise, (state, action) => {
        const exerciseIndex = state.exercise.findIndex(t => t._id === action.payload.exerciseId)
        const exerciseCopy = {...state.exercise[exerciseIndex]}
        const { exerciseId, ...rest } = action.payload;
        Object.assign(exerciseCopy, rest);
        const exerciseArrayCopy = [...state.exercise]
        exerciseArrayCopy[exerciseIndex] = exerciseCopy
        return{
            ...state,
            exercise: exerciseArrayCopy 
        }
    })
});

export default exerciseReducer;