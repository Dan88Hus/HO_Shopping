import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {createSub, removeSub, getSubs} from '../../../functions/sub'
import {getCategories} from '../../../functions/category'

import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'


function SubCreate() {
  const [name,setName] = useState("")
  const [loading,setLoading] = useState(false)
  const {user} = useSelector((state) => ({...state}))
  const [categories,setCategories] = useState([])
  const [subs,setSubs] = useState([])

  const [category,setCategory] =useState("")
  const [keyword,setKeyword] = useState("")

  useEffect(() => {
    loadCategories()
    loadSubs()
  },[])

  const loadCategories = () => {
    getCategories().then((c) => {
      setCategories(c.data)} )
  }

  const loadSubs = () => {
    getSubs().then((c) => {
      setSubs(c.data)} )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(name)
    setLoading(true)
    await createSub({name, parent: category}, user.token)
    .then((res) => {
      console.log("category create response ",res)
      setLoading(false)
      setName("")
      toast.success(`${res.data.name} is created`)
      loadSubs()
    })
    .catch(error => {
      console.log(error)
      setLoading(false)
      if(error.response.status === 400) {
        toast.error(error.response.data)}
    })
    loadSubs()
  }

  const handleRemove = async (slug) =>{
    if(window.confirm("Delete?")){

      setLoading(true)
      await removeSub(slug, user.token)
      .then(()=> {
        setLoading(false)
        toast.success(`${slug} is DELETED`)
        loadSubs()
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
        (<h4>Create/Delete/Update/Search Sub Page</h4>)}

      <div className="form-group">
      <label>Parent Sub/Category</label>
      <select className="form-control" name="category" onChange={(e)=> setCategory(e.target.value)}>
        <option>Parent Categoy for sub</option>
        {categories.length > 0 && categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
        </div>

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

        {subs.filter(searched(keyword)).map((s) => (
          <div key={s._id} className="alert alert-secondary">
            {s.name}
            <span className="btn tn-sm float-right"><Link to={`/admin/sub/${s.slug}`}><EditOutlined/> Edit
            </Link></span>

            <span onClick={()=> handleRemove(s.slug)}
            className="btn tn-sm float-right"><Link className="text-danger" to={`/admin/sub`}><DeleteOutlined /> Delete
            </Link></span>
            
            </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default SubCreate
