import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {updateCategory, getCategory} from '../../../functions/category'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import CategoryForm from '../../../components/forms/CategoryForm'


function CategoryUpdate({history, match }) {
  const [name,setName] = useState("")
  const [loading,setLoading] = useState(false)
  const {user} = useSelector((state) => ({...state}))


  useEffect(() => {
    loadCategory()
  },[])

  const loadCategory = () => {
    getCategory(match.params.slug).then((c) => {
      setName(c.data.name)
      } )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(name)
    setLoading(true)
    await updateCategory(match.params.slug, {name} ,user.token)
    .then((res) => {
      console.log("category update response ",res)
      setLoading(false)
      setName("")
      toast.success(`${res.data.name} is updated`)
      history.push('/admin/category')
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
        (<h4>Update Category Page</h4>)}
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

export default CategoryUpdate
