import {Switch, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Header from './components/nav/Header'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RegisterComplete from './pages/auth/RegisterComplete'
import ForgotPassword from './pages/auth/ForgotPassword'
import {auth} from './components/firebase'
import {useDispatch} from 'react-redux'
import { useEffect } from 'react';
import {currentUser} from './functions/auth'
import History from './pages/user/History'
import UserRoute from './components/routes/UserRoute'
import AdminRoute from './components/routes/AdminRoutte'
import Password from './pages/user/Password'
import Wishlist from './pages/user/Wishlist'
import AdminDashboard from './pages/admin/AdminDashboard'
import CategoryCreate from './pages/admin/category/CategoryCreate'
import CategoryUpdate from './pages/admin/category/CategoryUpdate'

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        // console.log('user',user)
        
        await currentUser(idTokenResult.token)
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
          // toast.success('Login Successful')
        })
        .catch((error) => console.log(error))
      }
    })
    return ()=> unsubscribe()
  }, [dispatch])

  return (
    <div >
      <Header/>
      <ToastContainer />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate} />

      </Switch>
      


    </div>
  );
}

export default App;
