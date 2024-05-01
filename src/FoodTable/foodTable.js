import { useMediaQuery } from 'react-responsive'
import './foodTable.css'
import React, { useState } from 'react'

const FoodTable = ({ allFoods, food, onEditFood }) => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width:800px)' });
    const [editIndex, setEditIndex] = useState(null);
    const [editedAmount, setEditedAmount] = useState(null);

    const handleEdit = (index, amount) => {
        setEditIndex(index);
        setEditedAmount(amount);
    };

    const handleSaveEdit = (foodId) => {
        onEditFood(foodId, editedAmount);
        setEditIndex(null);
        setEditedAmount(null);
    };

    return (
        <>
            <div className={isTabletOrMobile ? ("FoodTable__Container__Mobile") : ("FoodTable__Container__Desktop")}>
                <h3>Heutige Mahlzeiten</h3>
                <table className='FoodTable__Table'>
                    <tbody>
                        {food.map((item, index) => (
                            <tr key={index}>
                                <td style={{ width: '60%' }}>
                                    {allFoods.find((foodItem) => foodItem._id === item.foodId)?.name}
                                </td>
                                <td style={{ width: '20%' }}>{item.amount}g</td>
                                <td style={{ width: '20%' }}>
                                    {editIndex === index ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedAmount}
                                                onChange={(e) => setEditedAmount(e.target.value)}
                                            />
                                            <button onClick={() => handleSaveEdit(item.foodId)}>Save</button>
                                        </>
                                    ) : (
                                            <>
                                                <button onClick={() => handleEdit(index, item.amount)}>Edit</button>
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

export default FoodTable;