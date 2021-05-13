import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
// import ProductCard from '../components/cards/ProductCard'
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout'
import {userCart} from '../functions/user'


const Cart = ({history}) => {

  const {cart, user} = useSelector(state => ({...state}))
  const dispatch = useDispatch()

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price
    },0) 
  }

  const saveOrderToDb = () => {
    userCart(cart, user.token).then((res) =>{
      console.log("res from save order to back", res.data)
      if (res.data.ok) {
        history.push('/checkout')
      }
    }).catch((err) => {
      console.log("cart save DB error",err.message)
    })
  }

  const showCartItems = () => ( 
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Titile</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((p) => ( 
        <ProductCardInCheckout key={p._id} p={p}/>
  ))}
    </table>
  )
  return (
    <div className="container-fluid pt-2">


      <div className="row">
        <div className="col-md-8">
        <h4>Cart / {cart.length} product</h4>
          {
            !cart.length ? (<p>No Products in cart.  <Link to='/shop'>Continue to shopping</Link></p>)
            : (showCartItems())
          }
        </div>


        <div className="col-md-4"><h4>Order Summary</h4>
        <hr/>
        <p>Products</p>
        {cart.map((c,i) => (
          <div key={i}> <p>{c.title}*{c.count} = ${c.price * c.count}</p>
          </div>
        ))}
        <hr/>
        Total: <b>${getTotal()}</b>
        <hr/>
        {
          user ? (
            <button onClick={saveOrderToDb} 
            disabled={!cart.length}
            className="btn btn-primary">
                Proceed to Checkout
            </button>
          ) : (
            <button 
            className="btn btn-primary"
            >
              <Link to={{
                pathname: "/login",
                state: {from: "cart"}
              }}>
              Login to checkout
              </Link>
            </button>
          )
        }
        </div>
      </div>
    </div>
  )
}

export default Cart
