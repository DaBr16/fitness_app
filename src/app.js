import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/sidebar";
import "./app.css";

const App = () => {
    return(
        <>
            <Sidebar/>
            <div className="App__Outlet__Container"> 
                <Outlet />
            </div>
        </>
    )
}

export default App;