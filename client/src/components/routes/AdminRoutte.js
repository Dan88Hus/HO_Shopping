import React, {useEffect, useState} from 'react'
import {Route} from 'react-router-dom'
import {useSelector} from 'react-redux'
import LoadingToRedirect from './LoadingToRedirect'
import {currentAdmin} from '../../functions/auth'


export default function AdminRoute({children, ...rest}) {

  const {user} = useSelector((state) => ({...state}))
  const [ok,setOk] = useState(false)

  useEffect(()=> {
    if (user && user.token) {
      currentAdmin(user.token)
      .then((res) => {
        console.log("current admin has token")
        setOk(true)
      })
      .catch((err) =>{
        console.log("admin route error", err)
        setOk(false)
      })
    }
  },[user])

  return ok ? (
    <Route {...rest} />
  ) : (
  <LoadingToRedirect />
  )
}
