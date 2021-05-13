import React, {useState, useEffect} from 'react'
import {getSub} from '../../functions/sub'
import ProductCard from '../../components/cards/ProductCard'



const SubHome = ({match}) => {
  const [sub, setSub] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const {slug} = match.params

  useEffect(() => {
    setLoading(true);
    getSub(slug)
    .then((res) => {
      setSub(res.data.sub)
      setProducts(res.data.products)
      setLoading(false)

    })
  },[])

  return (
    <div className="container-fluid">
     <div className="row">
       <div className="col">
       {loading ? (<h4 className="text-center">Loading</h4>) :
      (<h4 className="text-center">{products.length} Products in {sub.name} Sub Category</h4>)
      }
       </div>
     </div>

     <div className="row">
       {products.map((p)=> (
         <div key={p._id}>
           <ProductCard product={p} />
         </div>
       ))}
     </div>
    </div>
  )
}

export default SubHome
