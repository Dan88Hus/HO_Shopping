import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {updateSub, getSub} from '../../../functions/sub'
import {getCategories} from '../../../functions/category'

import CategoryForm from '../../../components/forms/CategoryForm'


function SubUpdate({history, match}) {
  const [name,setName] = useState("")
  const [loading,setLoading] = useState(false)
  const {user} = useSelector((state) => ({...state}))
  const [parent,setParent] = useState("")

  const [categories,setCategories] =useState("")


  useEffect(() => {
    loadCategories()
    loadSub()
  },[])

  const loadCategories = () => {
    getCategories().then((c) => {
      setCategories(c.data)} )
  }

  const loadSub = () => {
    getSub(match.params.slug).then((s) => {
      setName(s.data.name)
      setParent(s.data.parent)
    } )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await updateSub(match.params.slug, {name, parent}, user.token)
    .then((res) => {
      console.log("category create response ",res)
      setLoading(false)
      setName("")
      toast.success(`${res.data.name} is updated`)
      history.push("/admin/sub")
    })
    .catch(error => {
      console.log(error)
      setLoading(false)
      if(error.response.status === 400) {
        toast.error(error.response.data)}
    })
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
        <AdminNav />
        </div>

        <div className="col">
        {loading ? (<h4 className="text-danger">Loading</h4>) :
        (<h4>Update Sub Page</h4>)}

      <div className="form-group">
      <label>Parent Sub/Category</label>
      <select className="form-control" name="category" onChange={(e)=> setParent(e.target.value)}>
        <option>Parent Categoy for sub</option>
        {categories.length > 0 && categories.map((c) => (
          <option key={c._id} value={c._id} selected={c.id === parent}>{c.name}</option>
        ))}
      </select>
        </div>

        <CategoryForm
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        />

        <hr/>
        </div>
      </div>
    </div>
  )
}

export default SubUpdate
