import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import './fitnesscontainer.css';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import CaloriesOverview from "../CaloriesOverview/caloriesOverview";
import MacrosOverview from "../MacrosOverview/macrosOverview";
import FoodTable from "../FoodTable/foodTable";
import ExerciseTable from "../ExerciseTable/exerciseTable";
import { loadProfiles } from "../Reducer/profile.reducer";
import { loadFoods } from "../Reducer/food.reducer";
import { loadExercises } from "../Reducer/exercise.reducer";
import { loadDays, createDay, updateDay } from "../Reducer/day.reducer";
import { useSelector, useDispatch } from "react-redux";
import axios from "../axiosURL";

const Fitnesscontainer = () => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' });

    const dispatch = useDispatch();

    const profiles = useSelector((state) => state.profileReducer.profile);
    const foods = useSelector((state) => state.foodReducer.food);
    const exercises = useSelector((state) => state.exerciseReducer.exercise);
    const day = useSelector((state) => state.dayReducer.day);

    useEffect (() => {
        dispatch(loadProfiles())
        dispatch(loadExercises())
        dispatch(loadFoods())
    }, [])

    console.log("Profiles", profiles)


    const [showPopupCreateFood, setShowPopupCreateFood] = useState(false);
    const [showPopupCreateExercise, setShowPopupCreateExercise] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [date, setDate] = useState(new Date());
    const [profile, setProfile] = useState(profiles.length > 0 ? profiles[0]._id : null);
    const [newFood, setNewFood] = useState();
    const [amount, setAmount] = useState();
    const [newExercise, setNewExercise] = useState();
    const [duration, setDuration] = useState();

    useEffect(() => {
    if (profiles.length > 0) {
        setProfile(profiles[0]._id);
    }
    }, [profiles]);


    const fetchDayData = async () => {
    const data = {
        profileId: profile,
        date: date.toLocaleDateString('de-DE'),
    };
    console.log("Data", data)
    dispatch(loadDays(data));
    };

    useEffect(() => {
        const newDay =  {
            profileId: profile,
            date: date.toLocaleDateString('de-DE'),
            exercises: [],
            food: []
        }
        axios.post("fitness/day", newDay, {withCredentials:true})
        .then((res) => {
            console.log(res)
            createDay(newDay)
            fetchDayData();
        }).catch((err) => {
            console.log(err)
        })
        if (profile) {
            fetchDayData();
        }
    }, [profile, date])

    console.log("Day", day)

    // ChatGPT
    if (!day || day.length === 0) {
        return <div>Loading</div>
    }

    const formattedDay = new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(date);
    const formattedDate = date.toLocaleDateString('de-DE');

    const handleChangeDate = (value) => {
        setDate(value);
        setShowCalendar(false);
    };

    const profileOptions = profiles.map((v) => (
        <option key={v._id} value={v._id}>{v.name}</option>
    ));

    const foodOptions = foods.map((v) => (
        <option key={v._id} value={v._id}>{v.name}</option>
    ));

    const exerciseOptions = exercises.map((v) => (
        <option key={v._id} value={v._id}>{v.name}</option>
    ));

    const onProfileChange = (e) => {
        setProfile(e.target.value);
    };

    const saveFood = () => {
        const updatedFoodArray = [
            ...(day[0]?.food || []),
            {
                foodId: newFood,
                amount: amount
            }
        ];

        const updatedDay = {
            dayId: day[0]?._id,
            profileId: day[0]?.profileId,
            date: day[0]?.date,
            exercise: day[0]?.exercise || [],
            food: updatedFoodArray
        };

        console.log("Updated", updatedDay);
        axios.put("/fitness/day", { ...updatedDay }, { withCredentials: true })
            .then((res) => {
                console.log(res);
                dispatch(updateDay(updatedDay));
                setAmount(null);
                setNewFood(null);
            }).catch((err) => {
                console.log(err);
            });

        setShowPopupCreateFood(false);
    };

    const saveExercise = () => {
        const updatedExerciseArray = [
            ...(day[0]?.exercise || []),
            {
                exerciseId: newExercise,
                timeInMinutes: duration
            }
        ];

        const updatedDay = {
            dayId: day[0]?._id,
            profileId: day[0]?.profileId,
            date: day[0]?.date,
            food: day[0]?.food || [],
            exercise: updatedExerciseArray
        };

        axios.put("/fitness/day", { ...updatedDay }, { withCredentials: true })
            .then((res) => {
                console.log(res);
                dispatch(updateDay(updatedDay));
                setDuration(null);
                setNewExercise(null);
            }).catch((err) => {
                console.log(err);
            });

        setShowPopupCreateExercise(false);
    };

    const handleAddFood = () => {
        setShowPopupCreateFood(true);
    };

    const handleAddExercise = () => {
        setShowPopupCreateExercise(true);
    };

    const editFood = (foodId, newAmount) => {
        const updatedFoodArray = day[0]?.food.map(item => 
          item.foodId === foodId ? { ...item, amount: newAmount } : item
        );

        const updatedDay = {
          dayId: day[0]?._id,
          profileId: day[0]?.profileId,
          date: day[0]?.date,
          exercise: day[0]?.exercise || [],
          food: updatedFoodArray,
        };

        axios.put("/fitness/day", { ...updatedDay }, { withCredentials: true })
          .then((res) => {
            console.log(res);
            dispatch(updateDay(updatedDay));
          })
          .catch((err) => {
            console.log(err);
        });
    };

    const editExercise = (exerciseId, newDuration) => {
        const updatedExerciseArray = day[0]?.exercise.map(item => 
          item.exerciseId === exerciseId ? { ...item, timeInMinutes: newDuration } : item
        );

        const updatedDay = {
          dayId: day[0]?._id,
          profileId: day[0]?.profileId,
          date: day[0]?.date,
          exercise: updatedExerciseArray,
          food: day[0]?.food || [],
        };

        axios.put("/fitness/day", { ...updatedDay }, { withCredentials: true })
          .then((res) => {
            console.log(res);
            dispatch(updateDay(updatedDay));
          })
          .catch((err) => {
            console.log(err);
        });
    };

    return (
            <>
              {isTabletOrMobile ? (
                <div className="Fitnesscontainer__Mobile">
                  <div className="Fitnesscontainer__Calendar__Mobile">
                    <p>{formattedDay}. {formattedDate}</p>
                    <img onClick={() => setShowCalendar(true)} className="Fitnesscontainer__CalendarIcon" src="/icons/icons8-calendar-24.png" alt="Calendar Icon"/>
                  </div>
                  {showCalendar && <Calendar value={date} onChange={handleChangeDate}/>}
                  <div className="Fitnesscontainer__Profile__Mobile">
                    <p>Profil: </p>
                    <select value={profile} onChange={onProfileChange}>{profileOptions}</select>
                  </div>
                  <CaloriesOverview food={ day[0].food } allFoods={foods} exercise={ day[0].exercise } allExercises={exercises} profileId={ day[0].profileId } profiles={profiles}/>
                  <h3>Makros</h3>
                  <MacrosOverview food={ day[0].food } allFoods={foods} profileId={ day[0].profileId } profiles={profiles}/>
                  <FoodTable food={ day[0].food } allFoods={foods} onEditFood={editFood} />
                  <button onClick={handleAddFood}>Neues Essen hinzufügen</button>
                  <ExerciseTable exercise={ day[0].exercise } allExercises={exercises} onEditExercise={editExercise}/>
                  <button onClick={handleAddExercise}>Neue Übung hinzufügen</button>
                </div>
              ) : (
                <div className="Fitnesscontainer__Desktop">
                  <div className="Fitnesscontainer__Calender__Profile__Desktop">
                    <Calendar value={date} onChange={handleChangeDate}/>
                    <div className="Fitnesscontainer__Profile__Mobile">
                      <p>Profil: </p>
                      <select value={profile} onChange={onProfileChange}>{profileOptions}</select>
                    </div>
                    <CaloriesOverview food={ day[0].food } allFoods={foods} exercise={ day[0].exercise } allExercises={exercises} profileId={ day[0].profileId } profiles={profiles}/>
                    <h3>Makros</h3>
                    <MacrosOverview food={ day[0].food } allFoods={foods} profileId={ day[0].profileId } profiles={profiles}/>
                  </div>
                  <div className="Fitnesscontainer__Tables__Desktop">
                    <FoodTable food={ day[0].food } allFoods={foods} onEditFood={editFood}/>
                    <button className="Fitnesscontainer__Button__Desktop" onClick={handleAddFood}>Neues Essen hinzufügen</button>
                    <ExerciseTable exercise={ day[0].exercise } allExercises={exercises} onEditExercise={editExercise}/>
                    <button className="Fitnesscontainer__Button__Desktop" onClick={handleAddExercise}>Neue Übung hinzufügen</button>
                  </div>
                </div>
              )}
      
              {showPopupCreateFood && (
                <div className="popup-overlay">
                  <div className="popup">
                    <h3>Essen hinzufügen</h3>
                    <label>
                      Name:
                      <select value={newFood} onChange={(e) => setNewFood(e.target.value)}>{foodOptions}</select>
                    </label>
                    <label>
                      Menge:
                      <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
                      <span> g</span>
                    </label>
                    <button onClick={saveFood}>Essen hinzufügen</button>
                  </div>
                </div>
              )}
      
              {showPopupCreateExercise && (
                <div className="popup-overlay">
                  <div className="popup">
                    <h3>Übung hinzufügen</h3>
                    <label>
                      Name:
                      <select value={newExercise} onChange={(e) => setNewExercise(e.target.value)}>{exerciseOptions}</select>
                    </label>
                    <label>
                      Dauer:
                      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                      <span> min</span>
                    </label>
                    <button onClick={saveExercise}>Übung hinzufügen</button>
                  </div>
                </div>
              )}
            </>
      );
}

export default Fitnesscontainer;