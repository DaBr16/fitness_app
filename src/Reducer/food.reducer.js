import {createAction, createReducer, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../axiosURL.js";

export const loadFoods = createAsyncThunk("fitness/loadFoods", async () => {
    const res = await axios.get("/fitness/food", {withCredentials: true})
    console.log("Load", res.data)
    return res.data
});

export const updateFood = createAction("fitness/updateFood")
export const createFood = createAction("fitness/createFood")

const initialState = {
    food: []
};

const foodReducer = createReducer(initialState, (builder) => {
    builder.addCase(loadFoods.fulfilled, (state, action) => {
        return{
            ...state,
            food: action.payload
        }
    })
    .addCase(createFood, (state, action) => {
        const foodCopy = [...state.food]
        const newFood = {
            name: action.payload.name, 
            baseAmount: action.payload.baseAmount, 
            energy: action.payload.energy,
            fat: action.payload.fat,
            carbohydrates: action.payload.carbohydrates,
            protein: action.payload.protein,
            salt: action.payload.salt,
            fiber: action.payload.fiber,
            drink: action.payload.drink
        }
        foodCopy.push(newFood)
        return {
            ...state,
            food: foodCopy
        }
    })
    .addCase(updateFood, (state, action) => {
        const foodIndex = state.food.findIndex(t => t._id === action.payload.foodId)
        const foodCopy = {...state.food[foodIndex]}
        const { foodId, ...rest } = action.payload;
        Object.assign(foodCopy, rest);
        const foodsArrayCopy = [...state.food]
        foodsArrayCopy[foodIndex] = foodCopy
        return{
            ...state,
            food: foodsArrayCopy
        }
    })
});

export default foodReducer;