import React from 'react'
import {useDispatch} from 'react-redux'
import ModalImage from 'react-modal-image'
import { toast } from 'react-toastify'
import {CheckCircleOutlined, CloseCircleOutlined, CloseOutlined} from '@ant-design/icons'

// color: {
//   type: String,
//   enum: ["Black", "Brown", "Silver", "White", "Blue"]

const ProductCardInCheckout = ({p}) => {

  const colors  = ["Black", "Brown", "Silver", "White", "Blue"]
  let dispatch = useDispatch()

  const handleColorChange = (e) => {
    let cart = []
    if (typeof window !== "undefined") {
      if(localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"))
      }
      cart.map((product, i)=> {
        if (product._id === p._id){ 
          cart[i].color = e.target.value
        }
      })
      localStorage.setItem("cart", JSON.stringify(cart))
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      })
    }
  }

  const handleQuantityChange = (e) => {
    console.log("Product quantity in Stock", p.quantity)
    let countValue = e.target.value < 1 ? 1 : e.target.value
    let cart = []

    if (countValue > p.quantity){
      toast.error(`Max available quantity: ${p.quantity}`)
      return
    }
    if (typeof window !== "undefined") {
      if(localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"))
      }
      cart.map((product, i)=> {
        if (product._id === p._id){ //p,_id is belongs to cart component , actual product
          cart[i].count = countValue
        }
      })
      localStorage.setItem("cart", JSON.stringify(cart))
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      })
    }
  }

  const handleRemove = () => {
    let cart = []

    if (typeof window !== "undefined") {
      if(localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"))
      }
      cart.map((product, i)=> {
        if (product._id === p._id){ 
          cart.splice(i, 1) 
        }
      })
      localStorage.setItem("cart", JSON.stringify(cart))
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      })
    }
  }

  return (
    <tbody>
      <tr>
        <td>
          <div style={{width: "100px" , height: "auto"}}>
            {p.images.length ? (<ModalImage small={p.images[0].url}
            large={p.images[0].url} /> ) 
            : ("No Image")}
          </div>
        </td>
        <td>{p.title}</td>
        <td>${p.price}</td>
        <td>{p.brand}</td>
        <td>
          <select onChange={handleColorChange} className="form-control"> 
              {p.color ? (<option value={p.color}>{p.color}</option>) : (<option>Select</option>)}
             {colors.filter((c) => c !== p.color).map ((c) => <option key={c} value={c}>{c}</option> )}
          </select>
        </td>
        <td className="text-center">
          <input type="number" className="form-control" 
          value={p.count} onChange={handleQuantityChange}
          />
        </td>
        <td>
          {p.shipping === "Yes" ? (<CheckCircleOutlined className="text-success" />) : 
          (<CloseCircleOutlined className="text-danger" />) }
        </td>
        <td>
          <CloseOutlined  onClick={handleRemove}
          className="text-danger" style={{cursor: "pointer"}}
          />
        </td>


      </tr>
    </tbody>
  )
}

export default ProductCardInCheckout
