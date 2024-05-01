import React, { useEffect, useState } from "react";
import "./profile.css";
import { useMediaQuery } from "react-responsive";
import axios from "../axiosURL.js";
import { useDispatch, useSelector } from "react-redux";
import { loadProfiles, createProfile, updateProfile } from "../Reducer/profile.reducer.js";

const Profile = () => {
    const isTabletOrMobile = useMediaQuery({query : '(max-width: 800px)'});
    
    const [modeCreate, setModeCreate] = useState(false);

    const profiles = useSelector((state) => {return state.profileReducer.profile})
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(loadProfiles());
    }, [])

    const attributeTranslation = {
        name: "Name",
        age: "Alter",
        height: "Größe",
        weight: "Gewicht",
        sex: "Geschlecht",
    }

    const measurements = {
        age: "Jahre",
        height: "cm",
        weight: "kg"
    }

    const sexOptions = [
          { value: 0, label: 'Male' },
          { value: 1, label: 'Female' },
          { value: 2, label: 'Other' },
        ];

    const newProfile = { "name": "", "age": 0, "height": 0, "weight": 0, "sex": sexOptions[0] };


    const [selectedProfile, setSelectedProfile] = useState(profiles.length > 0 ? profiles[0] : newProfile);

    const handleProfileClick = (index) => {
        // Toggle selection when a row is clicked
        setSelectedProfile(prevSelectedProfile => (
            prevSelectedProfile === profiles[index] ? null : profiles[index]
        ));
    };

    const handleAttributeChange = (attribute, value) => {
        // Update the selected food's attribute when an input field is changed
        setSelectedProfile((selectedProfile) => ({
            ...selectedProfile,
            [attribute]: value
        }));
    };


    const handleNewExercise = () => {
    setSelectedProfile({
      ...newProfile,
      sex: sexOptions[0].value
    });
    setModeCreate(true);
    }

    const handleSubmit = () => {
        if(modeCreate) {
        axios.post("/fitness/profile", selectedProfile, {withCredentials:true})
            .then((res) => {
                console.log(res)
                dispatch(createProfile(selectedProfile))
                setModeCreate(false)
            }).catch((err) => {
                console.log(err)
            })
        }else {
        const updatedProfile = {
            profileId: selectedProfile._id,
            name: selectedProfile.name,
            height: selectedProfile.height,
            weight: selectedProfile.weight,
            sex: selectedProfile.sex
        }
        axios.put("/fitness/profile", {...updatedProfile}, {withCredentials: true})
            .then((res) => {
                console.log(res)
                dispatch(updateProfile(updatedProfile))
            }).catch((err) => {
                console.log(err)
            })
        }

    }

    const handleDelete = () => {
        axios.delete(`/fitness/exercise/${selectedProfile._id}`, {withCredentials: true})
            .then((res) => {
                console.log(res)
                dispatch(loadProfiles())
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className={isTabletOrMobile ? ("Food__Container__Mobile") : ("Food__Container__Desktop")}>
            <div className="Food__Table__Button__Container">
            <button className="Food__AddButton" onClick={handleNewExercise}>Neues Profil hinzufügen</button>
            <div className="Food__Table__Container">
                {profiles.map((item, index) => (
                    <div key={index} onClick={() => handleProfileClick(index)} className={`Food__TableRow ${selectedProfile.name === item.name ? "selected" : ""}`}>
                        {item.name}
                    </div>
                ))}
            </div>
            </div>
            <div className="Food__SelectedFood__Container">
                <div className="Food__SelectedFood__Attributes">
                    {Object.keys(selectedProfile)
                      .filter(attribute => !['_id', '__v', 'userId'].includes(attribute))
                      .map((attribute, index) => (
                        <div key={index}>
                          <strong>{attributeTranslation[attribute]}: </strong>
                          {attribute === 'sex' ? (
                            <select
                              value={selectedProfile[attribute]}
                              onChange={(e) => handleAttributeChange(attribute, e.target.value)}
                            >
                              {sexOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={selectedProfile[attribute]}
                                onChange={(e) => handleAttributeChange(attribute, e.target.value)}
                              />
                              <span> {measurements[attribute]}</span>
                            </>
                          )}
                        </div>
                    ))}
                </div>
            <button onClick={handleSubmit} className="Food__SaveButton">Speichern</button>
            <button onClick={handleDelete} className="Food__DeleteButton">Löschen</button>
            </div>
        </div>
    );
};

export default Profile;