import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import './caloriesOverview.css'

const CaloriesOverview = ({food, allFoods, exercise, allExercises, profileId, profiles}) => {
    const isTabletOrMobile = useMediaQuery({ query : '(max-width: 800px' })

    const profil = profiles.find((item) => item._id === profileId)

    const caloriesFormal = (bla) => {
        if(bla.sex===0){
            return (10 * bla.weight) + (6.25 * bla.height) - (5 * bla.age) + 5
        } else {
            return (10 * bla.weight) + (6.25 * bla.height) - (5 * bla.age) - 161
        }
    }

    const calculateTakenCalories = (food, allFoods) => {
        let calories = 0;

        food.forEach((item) => {
            const foodItem = allFoods.find((food) => food._id === item.foodId);
            if (foodItem) {
                let amountDiff = item.amount / foodItem.baseAmount
                calories += foodItem.energy * amountDiff;
            }
        });

        return calories;
    };

    const calculateBurnedCalories = (exercise, allExercises) => {
        let calories = 0;

        exercise.forEach((item) => {
            const exerciseItem = allExercises.find((exercise) => exercise._id === item.exerciseId);
            if (exerciseItem) {
                let timeDiff = item.timeInMinutes / exerciseItem.baseTime
                calories += exerciseItem.energyBurned * timeDiff;
            }
        });

        return calories;
    };

    const caloriesSum = calculateTakenCalories(food, allFoods) - calculateBurnedCalories(exercise, allExercises)

    let caloriesDeficit;

    if(profil) {
        caloriesDeficit = caloriesSum - caloriesFormal(profil)
    } else {
        console.error("Profile is undefined");
    }
    
    return(
        <>
            <div className={isTabletOrMobile ? ("CaloriesOverview__Container__Mobile") : ("CaloriesOverview__Container__Desktop")}>
                <p>Konsumierte Kalorien: {calculateTakenCalories(food, allFoods)} kcal</p>
                <p>Verbrannte Kalorien: {calculateBurnedCalories(exercise, allExercises)} kcal</p>
                <p>Kaloriendefizit: {caloriesDeficit} kcal</p>
            </div>
        </>
    )
}

export default CaloriesOverview;