import React,{useState, useEffect} from 'react'
import {auth, googleAuthProvider} from '../../components/firebase'
import {Link} from 'react-router-dom'
import {Button} from 'antd'
import { LoginOutlined, GoogleOutlined } from '@ant-design/icons';
import {createOrUpdateUser} from '../../functions/auth'
import {toast} from 'react-toastify'
import {useDispatch, useSelector} from 'react-redux'

function Login({history}) {
  const dispatch = useDispatch()
  const {user} = useSelector(state => ({...state})) 

  useEffect(() => {
    let intended = history.location.state
    if (intended) {
      return
    } else {
      if(user && user.token) {
        history.push("/")
      }
    }
  },[user, history])

  const [email,setEmail] = useState('huseyinozdogan@gmail.com')
  const [password,setPassword] = useState('212121')
  const [loading, setLoading] = useState(false)


  
  const roleBasedRedirect = (res) => {
    let intended = history.location.state
    if (intended){
      history.push(intended.from)
      } else{
      if (res.data.role === "admin") { 
      history.push('/admin/dashboard')

      }else{     
      history.push('/user/history')
      }
      }
    }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const result = await auth.signInWithEmailAndPassword(email,password)
      const {user} = result
      const idTokenResult = await user.getIdTokenResult()

      await createOrUpdateUser(idTokenResult.token)
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
        roleBasedRedirect(res)
      })
      .catch((error) => console.log(error))
      
      

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.message)
    }

  }

  const googleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const result = await auth.signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        console.log("popuo google", result)
        const {user} = result
        const idTokenResult = await user.getIdTokenResult()
    
        await createOrUpdateUser(idTokenResult.token)
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
          roleBasedRedirect(res)
        })
        .catch((error) => console.log(error))



      } )
      

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.message)
    }

  }

  const loginForm = () => ( 
    
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input type="email" placeholder="Please enter email"
        className="form-control" onChange={e => setEmail(e.target.value)}
        value={email} autoFocus/>

        
      </div>
      
      <div className="form-group">
      
        <input type="password" placeholder="Please enter password"
        className="form-control" onChange={e => setPassword(e.target.value)}
        value={password} />
      </div>
      

      <Button 
      onClick={handleSubmit}
      type="primary" className="mb-3"
      block
      shape="round"
      icon={<LoginOutlined/>}
      disabled={!email || password.length < 5}
      size="large"
      >Login with Email</Button>
    </form> 
  )

  const googleLoginButton = () => ( 
    <Button 
      onClick={googleLogin}
      type="danger" className="mb-3"
      block
      shape="round"
      icon={<GoogleOutlined/>}
      disabled={!email || password.length < 5}
      size="large"
      >Login with Google
      </Button>

  )

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? <h4 className="text-danger">Loading</h4> : <h4>Loading...</h4>}
          
          {loginForm()}
          {googleLoginButton()}
          <Link to="/forgot/password"
          className="float-right">Forgot password
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login