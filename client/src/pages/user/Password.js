import React, {useState} from 'react'
import UserNav from '../../components/nav/UserNav'
import {auth} from '../../components/firebase'
import {toast} from 'react-toastify'

function Password() {
const [password,setPassword] = useState()
const [loading,setLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  // console.log(password)
  setLoading(true)
  await auth.currentUser.updatePassword(password)
  .then(() => {
  setLoading(false)
  toast.success("Password is updated")
  setPassword("")
  //
  })
  .catch((err) => {
    console.log(err)
    setLoading(false)
    toast.error(err.message)
    setPassword("")

  })
}

const passwordUpdateForm = () => {
 return (
 <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Your Password</label>
      <input type="password" 
      className="form-control"
      placeholder="Enter new password"
      autoFocus
      disabled={loading}
      value={password}
      onChange={(e) => setPassword(e.target.value)}/>
      <br/>

      <button type="submit" className="btn btn-primary"
      disabled={!password || loading}>Submit</button>
    </div>
  </form>)
}

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
        <UserNav />
        </div>


        <div className="col-auto">
          {loading ? (<h4 className="text-danger">Loading...</h4>) : (<h4>Password Update</h4>)}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  )
}

export default Password
