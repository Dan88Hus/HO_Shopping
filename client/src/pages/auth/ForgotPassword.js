import React, {useState, useEffect} from 'react'
import {auth} from '../../components/firebase'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'

const ForgotPassword = ({history}) => {

  const [email,setEmail] = useState("huseyinozdogan@gmail.com")
  const [loading,setLoading] = useState(false)
  const {user} = useSelector(state => ({...state}))

  useEffect(() => {
    if(user && user.token) {
      history.push("/")
    }
  },[user, history])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
      handleCodeInApp: true
    }

    await auth.sendPasswordResetEmail(email,config)
   .then(()=> {
    toast.success(`Email Reset link is sent to ${email}.`)
    setEmail("");
    setLoading(false)
    history.push("/login")
  })
    .catch ((error) => {
      setLoading(false)
      toast.error(error.message)
      console.log("error in forgot password", error)
   })
  }

  return (
<div className="container col-md-6 offset-md-3 p-5">
      {loading ? 
      (<h4 className="text-danger">Loading...</h4>) : (<h4>Forgot Password</h4>)}

      <form onSubmit={handleSubmit}>
        <input type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        autoFocus
        ></input>
        <br/>
        <button className="btn btn-raised"
        disabled={!email}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
