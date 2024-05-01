import { useMediaQuery } from 'react-responsive'
import './macrosOverview.css'

const MacrosOverview = ({food, allFoods, profileId, profiles}) => {

    console.log(profileId)

    const profil = profiles.find((item) => item._id === profileId)

    const caloriesFormal = (bla) => {
        if(bla.sex===0){
            return (10 * bla.weight) + (6.25 * bla.height) - (5 * bla.age) + 5
        } else {
            return (10 * bla.weight) + (6.25 * bla.height) - (5 * bla.age) - 161
        }
    }

    let caloriesPerDay;

    if(profil) {
        caloriesPerDay = caloriesFormal(profil)
    } else {
        console.error("Profile is undefined")
    }

    const recommendedProteins = (0.79 * profil.weight).toFixed(2); 
    const recommendedCarbohydrates = ((caloriesPerDay / 2) / 4).toFixed(2);
    const recommendedFat = ((caloriesPerDay * 0.30) / 9).toFixed(2);

    const calculateProteins = (food, allFoods) => {
        let proteins = 0;

        food.forEach((item) => {
            const foodItem = allFoods.find((food) => food._id === item.foodId);
            if (foodItem) {
                let amountDiff = item.amount / foodItem.baseAmount
                proteins += foodItem.protein * amountDiff;
            }
        });

        return proteins;
    }

    const calculateCarbohydrates = (food, allFoods) => {
        let carbohydrates = 0;

        food.forEach((item) => {
            const foodItem = allFoods.find((food) => food._id === item.foodId);
            if (foodItem) {
                let amountDiff = item.amount / foodItem.baseAmount
                carbohydrates += foodItem.carbohydrates * amountDiff;
            }
        });

        return carbohydrates;
    }

    const calculateFat = (food, allFoods) => {
        let fat = 0;

        food.forEach((item) => {
            const foodItem = allFoods.find((food) => food._id === item.foodId);
            if (foodItem) {
                let amountDiff = item.amount / foodItem.baseAmount
                fat += foodItem.fat * amountDiff;
            }
        });

        return fat;
    }

    return (
        <>
                <div className='macrosOverview__Container__Mobile'>
                    <div className='macrosOverview__Values__Mobile'>
                        <p className='macrosOverview__Title'>Eiweiß:</p>
                        <p className='macrosOverview__Value'>{calculateProteins(food, allFoods)}/{recommendedProteins}g</p>
                    </div>
                    <div className='macrosOverview__Values__Mobile'>
                        <p className='macrosOverview__Title'>Kohlenhydrate:</p>
                        <p className='macrosOverview__Value'>{calculateCarbohydrates(food, allFoods)}/{recommendedCarbohydrates}g</p>
                    </div>
                    <div className='macrosOverview__Values__Mobile'>
                        <p className='macrosOverview__Title'>Fett:</p>
                        <p className='macrosOverview__Value'>{calculateFat(food, allFoods)}/{recommendedFat}g</p>
                    </div>
                </div>
        </>
    )
}

export default MacrosOverview;