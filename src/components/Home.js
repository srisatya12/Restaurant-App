import React from 'react'
import Header from './Header'
import DishItem from './DishItem'
import './Home.css'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      response: [],
      activeCategoryId: '',
      cartItems: [],
    }
    this.fetchRestaurantApi()
  }

  fetchRestaurantApi = () => {
    fetch('https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details')
      .then(res => res.json())
      .then(data => {
        const updatedData = this.getUpdatedData(data[0].table_menu_list)
        this.setState({
          response: updatedData,
          activeCategoryId: updatedData[0].menuCategoryId,
          isLoading: false,
        })
      })
  }

  getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  addItemToCart = dish => {
    const {cartItems} = this.state
    const updatedCartItems = [...cartItems]
    const itemIndex = updatedCartItems.findIndex(
      item => item.dishId === dish.dishId,
    )
    if (itemIndex === -1) {
      updatedCartItems.push({...dish, quantity: 1})
    } else {
      updatedCartItems[itemIndex].quantity += 1
    }
    this.setState({cartItems: updatedCartItems})
  }

  removeItemFromCart = dish => {
    const {cartItems} = this.state
    const updatedCartItems = cartItems
      .map(item =>
        item.dishId === dish.dishId
          ? {...item, quantity: item.quantity - 1}
          : item,
      )
      .filter(item => item.quantity > 0)
    this.setState({cartItems: updatedCartItems})
  }

  onUpdateActiveCategoryId = menuCategoryId =>
    this.setState({activeCategoryId: menuCategoryId})

  renderTabMenuList = () => {
    const {response, activeCategoryId} = this.state
    return response.map(eachCategory => (
      <li
        className={`each-tab-item ${
          eachCategory.menuCategoryId === activeCategoryId
            ? 'active-tab-item'
            : ''
        }`}
        key={eachCategory.menuCategoryId}
        onClick={() =>
          this.onUpdateActiveCategoryId(eachCategory.menuCategoryId)
        }
      >
        <button type="button" className="tab-category-button">
          {eachCategory.menuCategory}
        </button>
      </li>
    ))
  }

  renderDishes = () => {
    const {response, activeCategoryId, cartItems} = this.state
    const {categoryDishes} = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    return (
      <ul className="dishes-list-container">
        {categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cartItems}
            addItemToCart={this.addItemToCart}
            removeItemFromCart={this.removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status" />
    </div>
  )

  render() {
    const {isLoading, cartItems} = this.state
    return isLoading ? (
      this.renderSpinner()
    ) : (
      <div className="home-background">
        <Header cartItems={cartItems} />
        <ul className="tab-container">{this.renderTabMenuList()}</ul>
        {this.renderDishes()}
      </div>
    )
  }
}

export default Home
