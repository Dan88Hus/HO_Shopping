import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getUserCart, saveUserAddress, applyCoupon} from '../functions/user'
import { Input } from 'antd';
// import ReactQuill from 'react-quill'
// import "react-quill/dist/quill.snow.css"
import { toast } from 'react-toastify'

const { TextArea } = Input;


const Checkout = ({history}) => {

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const {user, cart} = useSelector((state) => ({...state}))
  const dispatch = useDispatch()
  const [address, setAddress] = useState("")
  const [addressSaved, setAddressSaved] = useState(false)
  const [coupon, setCoupon] = useState ("") // this is used for user coupon input
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [discountError, setDiscountError] = useState("")



useEffect(() => {
  getUserCart(user.token)
  .then((res) => {
    console.log("user cart response", res.data)
    setProducts(res.data.products)
    setTotal(res.data.cartTotal)
  })
},[])


  const saveAdressToDb = () => {
    console.log("save adress")
    saveUserAddress(address, user.token)
    .then((res)=>{
      if(res.data.ok){
        setAddressSaved(true)
        toast.success("Address Saved")
      }
    })
  }

  const applyDiscountCoupon = () => {
    applyCoupon(coupon, user.token)
    .then((res)=>{
      console.log("res coupon applied", res.data)
      setTotalAfterDiscount(res.data)
      dispatch({
        type: "COUPON_APPLIED",
        payload: true
      })
      if (res.data.err){
        setDiscountError(res.data.err)
        dispatch({
          type: "COUPON_APPLIED",
          payload: false
        })
      }
    })
  }

  const showApplyCoupon = () => ( 
    <>
    <input type="text" className="form-control"
    onChange={(e)=> {
      setCoupon(e.target.value)
      setDiscountError("")
    }}
    value={coupon}
    />
    <button onClick={applyDiscountCoupon}
    className="btn btn-primary mt-2">Apply</button>
    </>
  )

  return (
    <div className="row">
      <div className="col-md-8">
        Delivery adfress
        <br/>
        {/* <ReactQuill theme="snow" value={address}
        onChange={setAddress} 
        /> */}
        <TextArea row={1} showCount bordered value={address} onChange={(e)=> setAddress(e.target.value)}/>
        <button className="btn btn-primary mt-2"
        onClick={saveAdressToDb}
        >Save</button>
        <hr/>
        Coupon
        <br/>
        {showApplyCoupon()}
        <br></br>
        {discountError && <p className="text-danger">{discountError}</p>}
      </div>

      <div className="col md-6">
        Order Summary 
        <hr/>
        Products {products.length}
        {/* {JSON.stringify(products)} */}
        <hr/>
        {products.map((p, i )=> (
          <div key={i}>
            <p>{p.product.title} ({p.color}) * {p.count} = {""}
            {p.product.price*p.count}</p>
          </div>
        ))}
        <hr/>
        <p>Cart Total: { total } </p>
        {totalAfterDiscount > 0 && <p className="text-success">After Discount Price:{totalAfterDiscount}</p>}
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary"
            disabled={!addressSaved}
            onClick={()=> history.push("/payment")}
            >Place Order</button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Checkout
