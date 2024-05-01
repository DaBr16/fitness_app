import "./account.css"
import { useState } from "react";
import axios from "../axiosURL";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Account = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onLogin = () => {
        axios.post("/login", {email, password}, {withCredentials: true})
        .then((res) => {
            console.log(res)
            navigate("/")
        }).catch((err) => {
            console.log(err)
        })
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    return(
        <div className="Account__Container">
            <h2>Login</h2>
            <div className="Account__Input">
                <div>
                    <label>E-Mail</label>
                    <input type="text" value={email} onChange={onChangeEmail}></input>
                </div>
                <div>
                    <label>Passwort</label>
                    <input type="text" value={password} onChange={onChangePassword}></input>
                </div>    
            </div>
            <div className="Account__Buttons">
                <button className="Account__Button" onClick={onLogin}>Anmelden</button>
            </div>
            <p>Hier <Link to={"/register"}>registrieren</Link>.</p>
        </div>
    )
}

export default Account;