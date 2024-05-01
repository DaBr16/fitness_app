import React from "react";
import {createRoot} from "react-dom/client";
import App from "./app";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Fitnesscontainer from "./FitnessContainer/fitnesscontainer";
import Food from "./Food/food";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Account from "./Account/account";
import Register from "./Register/register";
import Exercise from "./Exercise/exercise";
import { rootReducer } from "./Reducer/reducer";
import Profile from "./Profile/profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {
                index:true,
                element: <Fitnesscontainer />
            },
            {
                path: "/food",
                element: <Food />
            },
            {
                path: "/account",
                element: <Account />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/exercise",
                element: <Exercise />
            },
            {
                path: "/profile",
                element: <Profile />
            }
        ]
    }
])


const root = createRoot(document.getElementById("root"))

const store = configureStore({ reducer: rootReducer})

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);