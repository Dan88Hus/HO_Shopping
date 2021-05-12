import React, {useEffect, useState} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import {getProductByCount} from '../../../functions/product'
import AdminProductCard from '../../../components/cards/AdminProductCard'
import {removeProduct} from '../../../functions/product'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'

function AllProducts() {
const [products,setProducts] = useState([])
const [loading,setLoading] = useState(false)
const {user} = useSelector((state) => ({...state}))

useEffect(() => {
  loadAllProducts()
},[])

const loadAllProducts = () => {
  setLoading(true)
  getProductByCount(100)
  .then((res) => {
    setProducts(res.data)
    setLoading(false)
  })
  .catch((error) => {
    console.log("getProductsByCount error",error)
    setLoading(false)
  })
}

const handleRemove = (slug) => {
  let answer = window.confirm("Are you sure to DELETE?")
  if (answer) {
    removeProduct(slug, user.token)
    .then((res)=> {
      toast.success(`${slug} is Deleted`)
      loadAllProducts()
    })
    .catch((error) => {
      console.log(error)
      if(error.response.status === 400){
       toast.error(`${error.response.data} is NOT deleted`)
      }
    })
  
  }
}

  return (
    <div className="container-fluid">
      <div className="row">
      <div className="col-fluid">
        <AdminNav />
        </div>

        <div className="col ">
  {loading ? (<h4>Loading...</h4>) : (<h4>All Products</h4>) }
          <div className="row">
          {
            products.map((p) => ( 
              <div key={p._id} className="col-auto">
                <AdminProductCard product={p}
                handleRemove={handleRemove} />
              </div>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllProducts
