import React from 'react'
import './DishItem.css'

const DishItem = ({
  dishDetails,
  cartItems,
  addItemToCart,
  removeItemFromCart,
}) => {
  const {
    dishId,
    dishName,
    dishType,
    dishPrice,
    dishCurrency,
    dishDescription,
    dishImage, // Use the API field name here
    dishCalories,
    addonCat,
    dishAvailability,
  } = dishDetails

  const getQuantity = () => {
    const cartItem = cartItems.find(item => item.dishId === dishId)
    return cartItem ? cartItem.quantity : 0
  }

  return (
    <li className="dish-item-container">
      <div>
        <img src={dishImage} alt={dishName} className="dish-image" />
      </div>
      <div className="dish-details">
        <h1>{dishName}</h1>
        <p>
          {dishCurrency} {dishPrice}
        </p>
        <p>{dishDescription}</p>
        {dishAvailability ? (
          <div className="quantity-controller">
            <button onClick={() => removeItemFromCart(dishDetails)}>-</button>
            <p>{getQuantity()}</p>
            <button onClick={() => addItemToCart(dishDetails)}>+</button>
          </div>
        ) : (
          <p>Out of Stock</p>
        )}
      </div>
    </li>
  )
}

export default DishItem
