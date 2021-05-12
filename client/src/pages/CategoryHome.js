import React, {useState, useEffect} from 'react'
import {getCategory} from '../functions/category'
import ProductCard from '../components/cards/ProductCard'



const CategoryHome = ({match}) => {
  const [category, setCategory] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const {slug} = match.params

  useEffect(() => {
    setLoading(true);
    getCategory(slug)
    .then((res) => {
      setCategory(res.data.category)
      setProducts(res.data.products)
      setLoading(false)

    })
  },[])

  return (
    <div className="container-fluid">
     <div className="row">
       <div className="col">
       {loading ? (<h4 className="text-center">Loading</h4>) :
      (<h4 className="text-center ">{products.length} Products {category.name}</h4>)
      }
       </div>
     </div>

     <div className="row">
       {products.map((p)=> (
         <div key={p._id} className="pl-5">
           <ProductCard product={p} />
         </div>
       ))}
     </div>
    </div>
  )
}

export default CategoryHome
