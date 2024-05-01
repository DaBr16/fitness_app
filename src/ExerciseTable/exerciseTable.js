import { useMediaQuery } from 'react-responsive'
import './exerciseTable.css'
import React, { useState } from 'react'

const ExerciseTable = ({ exercise, allExercises, onEditExercise }) => {
    const isTabletOrMobile = useMediaQuery({query: '(max-width:800px)'});
    const [editIndex, setEditIndex] = useState(null);
    const [editedDuration, setEditedDuration] = useState(null);

    const handleEdit = (index, duration) => {
        setEditIndex(index);
        setEditedDuration(duration);
    };

    const handleSaveEdit = (exerciseId) => {
        onEditExercise(exerciseId, editedDuration);
        setEditIndex(null);
        setEditedDuration(null);
    };

    return (
        <>
            <div className={isTabletOrMobile ? ("ExerciseTable__Container__Mobile") : ("ExerciseTable__Container__Desktop")}>
                <h3>Heutige Trainings</h3>
                <table className='ExerciseTable__Table'>
                    <tbody>
                        {exercise.map((item, index) => (
                            <tr key={index}>
                                <td style={{width: '60%'}}>
                                    {allExercises.find((exerciseItem) => exerciseItem._id === item.exerciseId)?.name}
                                </td>
                                <td style={{width: '20%'}}>{item.timeInMinutes}min</td>
                                <td style={{width: '20%'}}>
                                    {editIndex === index ? (
                                        <>
                                            <input
                                                type="number"
                                                value={editedDuration}
                                                onChange={(e) => setEditedDuration(e.target.value)}
                                            />
                                            <button onClick={() => handleSaveEdit(item.exerciseId)}>Save</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(index, item.timeInMinutes)}>Edit</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ExerciseTable;