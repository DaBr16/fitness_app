import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import './sidebar.css';
import axios from "../axiosURL"

const Sidebar = () => {

    const handleLogout = () => {
        axios.post("/logout", {withCredentials: true})
        .then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return(
        <div className="Sidebar__Container">
        <Menu>
            <Link to={"/"}>Übersicht</Link>
            <Link to={"/food"}>Essen</Link>
            <Link to={"/exercise"}>Übungen</Link>
            <Link to ={"/profile"}>Profile</Link>
            <Link to={"/account"}>Login</Link>
            <span onClick={handleLogout}>Logout</span>
        </Menu>
        </div>
    )
}

export default Sidebar;