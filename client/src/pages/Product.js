import React, {useEffect, useState} from 'react'
import {getProduct, productStar, getRelated} from '../functions/product'
import SingleProduct from '../components/cards/SingleProduct'
import {useSelector} from 'react-redux'
import ProductCard from '../components/cards/ProductCard'


const Product = ({match}) => {
  const [product,setProduct] = useState({})
  const {slug} = match.params
  const [star, setStar] = useState(0);
  const {user} = useSelector((state)=> ({...state}))
  const [related, setRelated] = useState([])



  useEffect(()=> {
    loadSingleProduct()
    if (!product.rating){
    }

  },[slug])

  useEffect(()=> {
    if (!product.rating){
    }
    if(product.rating && user) {
      let existingRatingObject = product.rating.find(
        (elem) => elem.postedBy.toString() === user._id.toString()
        );
        existingRatingObject && setStar(existingRatingObject.star)
    }
    
  },[])

  const loadSingleProduct = async () => {
    await getProduct(slug)
    .then((res)=> {
      setProduct(res.data)
      getRelated(res.data._id)
      .then((res)=>{
        setRelated(res.data)
      })

    })
  }

  const onStartClick = async (newRating, name) => {
   setStar(newRating);
   await productStar(name, newRating, user.token)
   .then((res) => {
    loadSingleProduct() 
  })
  }

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct product={product}
        onStartClick={onStartClick}
        star = {star}
        /> 

      </div>
      <div className="row">
        <div className="col text-muted text-center pt-5 pb-5">
          Related Products
          <hr></hr>
        </div>

      </div>
      <div className="row mr-20 pb-5">
        {related.length ?
        (related.map((r) => ( 
          <div className="mr-20 col md-4" key={r._id}>
            <ProductCard
              product={r}
            />
          </div>
        )
        )) :
        (<div className="text-center col">No Related Products Found</div>)
        }
      </div>
    </div>
  )
}

export default Product
