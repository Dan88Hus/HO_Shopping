import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {createCategory, removeCategory, getCategories} from '../../../functions/category'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'

function CategoryCreate() {
  const [name,setName] = useState("")
  const [loading,setLoading] = useState(false)
  const {user} = useSelector((state) => ({...state}))
  const [categories,setCategories] = useState([])
  const [keyword,setKeyword] = useState("")

  useEffect(() => {
    loadCategories()
  },[])

  const loadCategories = () => {
    getCategories().then((c) => {
      setCategories(c.data)} )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(name)
    setLoading(true)
    await createCategory(name, user.token)
    .then((res) => {
      console.log("category create response ",res)
      setLoading(false)
      setName("")
      toast.success(`${res.data.name} is created`)
      loadCategories()
    })
    .catch(error => {
      console.log(error)
      setLoading(false)
      if(error.response.status === 400) {
        toast.error(error.response.data)}
    })
  }

  const handleRemove = async (slug) =>{
    if(window.confirm("Delete?")){

      setLoading(true)
      await removeCategory(slug, user.token)
      .then(()=> {
        setLoading(false)
        toast.success(`${slug} is DELETED`)
      loadCategories()

      })
      .catch((error) => {
        if(error.response.status === 400){
          setLoading(false)
          toast.error(`${error.response.data} is NOT deleted`)
        }
      })
    }
  }

const handleSearchChange = (e) => {
  e.preventDefault()
  setKeyword(e.target.value.toLowerCase())
}
  const searched = (keyword) => (cat) => cat.name.toLowerCase().includes(keyword)

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
        <AdminNav />
        </div>

        <div className="col">
        {loading ? (<h4 className="text-danger">Loading</h4>) :
        (<h4>Create/Delete/Update/Search Category Page</h4>)}
        {/* {categoryForm()} */}
        <CategoryForm
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        />
        <LocalSearch
        keyword={keyword}
        setKeyword={setKeyword}
        />
        <hr/>
        {categories.filter(searched(keyword)).map((c) => (
          <div key={c._id} className="alert alert-secondary">
            {c.name}
            <span className="btn tn-sm float-right"><Link to={`/admin/category/${c.slug}`}><EditOutlined/> Edit
            </Link></span>

            <span onClick={()=> handleRemove(c.slug)}
            className="btn tn-sm float-right"><Link className="text-danger" to={`/admin/category`}><DeleteOutlined /> Delete
            </Link></span>
            </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryCreate
