import React, {useState, useEffect} from 'react'
import {auth} from '../../components/firebase'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'


function Register({history}) {

  const [email,setEmail] = useState('huseyinozdogan@gmail.com')

  const {user} = useSelector(state => ({...state})) 

  useEffect(() => {
    if(user && user.token) {
      history.push("/")
    }
  },[user, history])


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("email written", email)
    console.log(process.env.REACT_APP_REGISTER_REDIRECT_URL)
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true
    }
      await auth.sendSignInLinkToEmail(email, config)
      toast.success(`Email is sent to ${email}. Click link to complete registration`)
      window.localStorage.setItem('emailForRegistration', email)
      setEmail("");
  }

  const registerForm = () => ( 
    
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Please enter email"
      className="form-control" onChange={e => setEmail(e.target.value)}
      value={email} autoFocus/>
      <br/>

      <button type="submit" className="btn btn-outline-success">Register</button>
    </form> 
  )


  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          
          {registerForm()}
        </div>
      </div>
    </div>
  )
}

export default Register