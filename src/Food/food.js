import React, { useEffect, useState } from "react";
import "./food.css";
import { useMediaQuery } from "react-responsive";
import axios from "../axiosURL.js";
import { useDispatch, useSelector } from "react-redux";
import { createFood, loadFoods, updateFood } from "../Reducer/food.reducer.js";

const Food = () => {
    const isTabletOrMobile = useMediaQuery({query : '(max-width: 800px)'});
    
    const [modeCreate, setModeCreate] = useState(false);

    const foods = useSelector((state) => {return state.foodReducer.food})

    useEffect(() => {
        dispatch(loadFoods());
    }, [])


    const dispatch = useDispatch();

    const attributeTranslation = {
        name: "Name",
        baseAmount: "Basismenge",
        energy: "Kalorien",
        fat: "Fett",
        carbohydrates: "Kohlenhydrate",
        protein: "Protein",
        salt: "Salz",
        fiber: "Balaststoffe",
        drink: "Getränk"
    }

    const measurements = {
        baseAmount: "g",
        energy: "kcal",
        fat: "g",
        carbohydrates: "g",
        protein: "g",
        salt: "g",
        fiber: "g",
    }

    const newFood = { "name": "", "baseAmount": 0, "energy": 0, "fat": 0, "carbohydrates": 0, "protein": 0, "salt": 0, "fiber": 0, "drink": false };


    const [selectedFood, setSelectedFood] = useState(foods.length > 0 ? foods[0] : newFood);

    const handleFoodClick = (index) => {
        setSelectedFood(prevSelectedFood => (
            prevSelectedFood === foods[index] ? null : foods[index]
        ));
    };

    const handleAttributeChange = (attribute, value) => {
        setSelectedFood((selectedFood) => ({
            ...selectedFood,
            [attribute]: value
        }));
    };

    const handleNewFood = () => {
        setSelectedFood(newFood);
        setModeCreate(true)
    }

    const handleSubmit = () => {
        if(modeCreate) {
        axios.post("/fitness/food", selectedFood, {withCredentials:true})
            .then((res) => {
                console.log(res)
                dispatch(createFood(selectedFood))
                setModeCreate(false)
            }).catch((err) => {
                console.log(err)
            })
        }else {
        const updatedFood = {
            foodId: selectedFood._id,
            name: selectedFood.name,
            baseAmount: selectedFood.baseAmount,
            fat: selectedFood.fat,
            carbohydrates: selectedFood.carbohydrates,
            protein: selectedFood.protein,
            salt: selectedFood.salt,
            fiber: selectedFood.fiber,
            drink: selectedFood.drink, 
        }
        axios.put("/fitness/food", {...updatedFood}, {withCredentials: true})
            .then((res) => {
                console.log(res)
                dispatch(updateFood(updatedFood))
            }).catch((err) => {
                console.log(err)
            })
        }

    }

    const handleDelete = () => {
        axios.delete(`/fitness/food/${selectedFood._id}`, {withCredentials: true})
            .then((res) => {
                console.log(res)
                dispatch(loadFoods())
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className={isTabletOrMobile ? ("Food__Container__Mobile") : ("Food__Container__Desktop")}>
            <div className="Food__Table__Button__Container">
            <button className="Food__AddButton" onClick={handleNewFood}>Neues Essen hinzufügen</button>
            <div className="Food__Table__Container">
                {foods.map((item, index) => (
                    <div key={index} onClick={() => handleFoodClick(index)} className={`Food__TableRow ${selectedFood.name === item.name ? "selected" : ""}`}>
                        {item.name}
                    </div>
                ))}
            </div>
            </div>
            <div className="Food__SelectedFood__Container">
                <div className="Food__SelectedFood__Attributes">
                    {Object.keys(selectedFood)
                      .filter(attribute => !['_id', '__v'].includes(attribute))
                      .map((attribute, index) => (
                        <div key={index}>
                          <strong>{attributeTranslation[attribute]}: </strong>
                          {attribute === 'drink' ? (
                            <input
                              type="checkbox"
                              checked={selectedFood[attribute]}
                              onChange={() => handleAttributeChange(attribute, !selectedFood[attribute])}
                            />
                          ) : (
                            <>
                              <input
                                type="text"
                                value={selectedFood[attribute]}
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

export default Food;