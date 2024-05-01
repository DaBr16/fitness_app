import React, { useEffect, useState } from "react";
import "./exercise.css";
import { useMediaQuery } from "react-responsive";
import axios from "../axiosURL.js";
import { useDispatch, useSelector } from "react-redux";
import { loadExercises, createExercise, updateExercise } from "../Reducer/exercise.reducer.js";

const Exercise = () => {
    const isTabletOrMobile = useMediaQuery({query : '(max-width: 800px)'});
    
    const [modeCreate, setModeCreate] = useState(false);

    const exercises = useSelector((state) => {return state.exerciseReducer.exercise})
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(loadExercises());
    }, [])

    const attributeTranslation = {
        name: "Name",
        baseTime: "Zeit",
        energyBurned: "Kalorienverbrauch"
    }

    const measurements = {
        baseTime: "Minuten",
        energyBurned: "kcal",
    }

    const newExercise = { "name": "", "baseTime": 0, "energyBurned": 0 };


    const [selectedExercise, setSelectedExercise] = useState(exercises.length > 0 ? exercises[0] : newExercise);

    const handleFoodClick = (index) => {
        setSelectedExercise(prevSelectedExercise => (
            prevSelectedExercise === exercises[index] ? null : exercises[index]
        ));
    };

    const handleAttributeChange = (attribute, value) => {
        setSelectedExercise((selectedExercise) => ({
            ...selectedExercise,
            [attribute]: value
        }));
    };

    const handleNewExercise = () => {
        setSelectedExercise(newExercise)
        setModeCreate(true)
    }

    const handleSubmit = () => {
        if(modeCreate) {
        axios.post("/fitness/exercise", selectedExercise, {withCredentials:true})
            .then((res) => {
                console.log(res)
                dispatch(createExercise(selectedExercise))
                setModeCreate(false)
            }).catch((err) => {
                console.log(err)
            })
        }else {
        const updatedExercise = {
            exerciseId: selectedExercise._id,
            name: selectedExercise.name,
            baseTime: selectedExercise.baseTime,
            burnedEnergy: selectedExercise.burnedEnergy
        }
        axios.put("/fitness/exercise", {...updatedExercise}, {withCredentials: true})
            .then((res) => {
                console.log(res)
                dispatch(updateExercise(updatedExercise))
            }).catch((err) => {
                console.log(err)
            })
        }

    }

    const handleDelete = () => {
        axios.delete(`/fitness/exercise/${selectedExercise._id}`, {withCredentials: true})
            .then((res) => {
                console.log(res)
                dispatch(loadExercises())
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className={isTabletOrMobile ? ("Food__Container__Mobile") : ("Food__Container__Desktop")}>
            <div className="Food__Table__Button__Container">
            <button className="Food__AddButton" onClick={handleNewExercise}>Neue Übung hinzufügen</button>
            <div className="Food__Table__Container">
                {exercises.map((item, index) => (
                    <div key={index} onClick={() => handleFoodClick(index)} className={`Food__TableRow ${selectedExercise.name === item.name ? "selected" : ""}`}>
                        {item.name}
                    </div>
                ))}
            </div>
            </div>
            <div className="Food__SelectedFood__Container">
                <div className="Food__SelectedFood__Attributes">
                        {Object.keys(selectedExercise)
                        .filter(attribute => !['_id', '__v'].includes(attribute))
                        .map((attribute, index) => (
                            <div key={index}>
                                <strong>{attributeTranslation[attribute]}: </strong>
                                <input
                                    type="text"
                                    value={selectedExercise[attribute]}
                                    onChange={(e) => handleAttributeChange(attribute, e.target.value)}
                                />
                                <span> {measurements[attribute]}</span>
                            </div>
                        ))}
                </div>
            <button onClick={handleSubmit} className="Food__SaveButton">Speichern</button>
            <button onClick={handleDelete} className="Food__DeleteButton">Löschen</button>
            </div>
        </div>
    );
};

export default Exercise;