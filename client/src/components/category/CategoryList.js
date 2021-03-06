import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {getCategories} from '../../functions/category'

const CategoryList = () => {

  const [categories, setCategories] =useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    getCategories().then((res)=>{
      setCategories(res.data)
      setLoading(false)} )
    },[])

    const showCategories = () =>{
  return (categories.map((c)=> 
        (<div key={c._id} className="col btn btn-outlined-primary btn-raised btn-block">
          <Link to={`/category/${c.slug}`}>
          {c.name}
          </Link>
        </div>)
        
      ))
    }
    

  return (
    <div className="container-fluid">
      <div  className="row">
      {loading ? (<h4 className="text-danger">Loading</h4>) :
      (showCategories())
      }

      </div>
    </div>
  )
}

export default CategoryList
