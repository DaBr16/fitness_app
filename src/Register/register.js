import "./register.css"
import { useState } from "react";
import axios from "../axiosURL.js";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    // states for firstname, lastname, street, postcode, city, country, phone, email, password, savedRecipes?
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [street, setStreet] = useState("");
    const [postcode, setPostcode] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // register function which makes a axios post to "/signup"
    const onSignup = () => {
        axios.post("/signup", {firstname, lastname, street, postcode, city, country, phone, email, password}, {withCredentials: true})
        .then((res) => {
            console.log(res)
            navigate("/account")
        }).catch((err) => {
            console.log(err)
        })
    }

    return(
        <div className="Register__Container">
            <h3>Registrieren</h3>
            <div className="Register__Input">
                <label>Vorname: </label>                
                <input type="text" value={firstname} onChange={(e) => {setFirstname(e.target.value)}}/>
                <label>Nachname: </label>                
                <input type="text" value={lastname} onChange={(e) => {setLastname(e.target.value)}}/>
                <label>Straße: </label>                
                <input type="text" value={street} onChange={(e) => {setStreet(e.target.value)}}/>
                <label>Postleitzahl: </label>                
                <input type="text" value={postcode} onChange={(e) => {setPostcode(e.target.value)}}/>
                <label>Stadt: </label>                
                <input type="text" value={city} onChange={(e) => {setCity(e.target.value)}}/>
                <label>Land: </label>                
                <input type="text" value={country} onChange={(e) => {setCountry(e.target.value)}}/>
                <label>Telefonnummer: </label>                
                <input type="text" value={phone} onChange={(e) => {setPhone(e.target.value)}}/>
                <label>E-Mail: </label>                
                <input type="text" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                <label>Passwort: </label>                
                <input type="text" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            </div>
            <div className="Register__Buttons">
                <button className="Register__OnSignUpButton" onClick={onSignup}>Registrieren</button>
            </div>
            <p>Zurück zum <Link to={"/account"}>Login</Link>?</p>
        </div>
    )
};

export default Register;