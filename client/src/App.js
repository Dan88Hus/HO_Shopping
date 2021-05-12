import {Switch, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Header from './components/nav/Header'
import Login from './pages/auth/Login'

function App() {
  return (
    <div >
      <Header/>
      <ToastContainer />
      <Switch>
        <Route exact path="/login" component={Login} />

      </Switch>
      


    </div>
  );
}

export default App;
