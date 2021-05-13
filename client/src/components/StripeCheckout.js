import React, {useState, useEffect} from 'react'
import {CardElement,useStripe,useElements} from '@stripe/react-stripe-js';
import {useSelector, useDispatch} from 'react-redux'
import {createPaymentIntent} from '../functions/stripe'
import {Link} from 'react-router-dom'
import {Card} from 'antd'
import {DollarOutlined, CheckOutlined} from '@ant-design/icons'
import {toast} from 'react-toastify'
import {createOrder, emptyUserCart} from '../functions/user'
import {useHistory} from 'react-router-dom'

const StripeCheckout = () => {

  const dispatch = useDispatch()
  const {user, coupon} = useSelector((state) => ({...state}))
 
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const [cartTotal, setCartTotal] = useState(0)
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [payable, setPayable] = useState(0)
  const history = useHistory()


  useEffect(() => {
    createPaymentIntent(user.token, coupon) //redux ta couupon true/false diye kayitli serverda coupon Applied diye gidiyor
      .then(res => {
        setClientSecret(res.data.clientSecret);
        //set variables from backend
        setCartTotal(res.data.cartTotal)
        setTotalAfterDiscount(res.data.totalAfterDiscount)
        setPayable(res.data.payable)
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        }
      }
    });
    if(payload.error){
      setError(`Payment failed ${payload.error.message}`)
    } else {
      //create order and save DB
      createOrder(payload, user.token)
      .then((res)=> {
        if(res.data.ok){
          //empty localstorage
          if (typeof window !== undefined){
            localStorage.removeItem("cart")
          } 
          dispatch({
            type: 'ADD_TO_CART',
            payload: []
          })
          dispatch({
            type: 'COUPON_APPLIED',
            payload: false,
          })
          // console.log("USER", user)
          emptyUserCart(user.token)
        }
      })
      setError(null)
      setProcessing(false)
      setSucceeded(true)
      toast.success("Thank you, Payment is successful")
      history.push("/")
    }
  }

  const handleChange = async (e) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };


  return (
    <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
      <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      <button className="stripe-button"
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment succeeded,
        <Link to="/user/history" 
        > see your cart history
          {" "}
        </Link> 
        <br/> Refresh the page to pay again.
      </p>
      <div className="text-center">
        <Card actions={[
          <>
          <DollarOutlined className="text-info"/><br/>Total: ${cartTotal}
          </>,
          <>
          <CheckOutlined className="text-success"/><br/>Total Payable: ${(payable/ 100).toFixed(2)}
          </>,
          

        ]}
        >

        </Card>

      </div>
    </form> 
  )
}

export default StripeCheckout
