import React, {useState, useEffect} from 'react'
import {auth} from '../../components/firebase'
import {toast} from 'react-toastify'
import {useDispatch} from 'react-redux'
import {createOrUpdateUser} from '../../functions/auth'


const RegisterComplete = ({history}) => {

  const [email,setEmail] = useState('huseyinozdogan@gmail.com')
  const [password,setPassword] = useState('212121')
  // const {user} = useSelector(state => ({...state})) 
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and Password is required')
      return
    }

    if (password.length < 5) {
      toast.error('Password must be longer than 5 characters')
      return

    }
    try {
      const result = await auth.signInWithEmailLink(email, window.location.href)
      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistraion')
        let user = auth.currentUser
        await user.updatePassword(password)
        const idTokenResult = await user.getIdTokenResult()
        //redux
        await createOrUpdateUser(idTokenResult.token)
      // .then((res) => console.log("createOrUpdate Response for token from frontend to backend", res))
      .then((res) => {
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            name: res.data.name,
            email: res.data.email,
            token: idTokenResult.token,
            role: res.data.role,
            _id: res.data._id,
          }
        })
        toast.success('Login Successful')
      })
      .catch((error) => console.log(error))


        //
        toast.success(`User with ${email} updated with password`)
        history.push('/')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    
  }


  const completeRegistrationForm = () => ( 

    <form onSubmit={handleSubmit}>
      <input type="email"
      className="form-control"
      value={email} disabled/>
      <br/>
  
      <input type="password" placeholder="Please enter password"
      className="form-control" onChange={e => setPassword(e.target.value)}
      value={password} autoFocus/>
      <br/>
  
      <button type="submit" className="btn btn-outline-success">Complete Registration</button>
    </form> 
  )

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  )
}

export default RegisterComplete
