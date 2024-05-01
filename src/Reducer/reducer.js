import { combineReducers } from "redux";

import foodReducer from "./food.reducer";
import exerciseReducer from "./exercise.reducer";
import profileReducer from "./profile.reducer";
import dayReducer from "./day.reducer";

export const rootReducer = combineReducers({foodReducer, exerciseReducer, profileReducer, dayReducer})