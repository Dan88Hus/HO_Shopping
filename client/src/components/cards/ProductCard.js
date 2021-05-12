import React, {useState} from 'react'
import {Card, Tooltip} from 'antd'
import {EyeOutlined, ShoppingCartOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'
import {showAverage} from '../../functions/rating'
import _ from 'lodash'
import {useDispatch, useSelector} from 'react-redux'

const {Meta} = Card


const ProductCard = ({product}) => {
  const {title, description, images, slug, price} = product
  const [tooltip, setTooltip] = useState("Click to add")
  const dispatch = useDispatch()
  const {user, cart} = useSelector((state) => ({...state}))


  const handleAddToCart = () => {
    let cart = []
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"))
      }
      cart.push({...product, count:1}) 
      let unique = _.uniqWith(cart, _.isEqual)
      localStorage.setItem("cart", JSON.stringify(unique))
     setTooltip("Added")
     dispatch({
       type: "ADD_TO_CART",
       payload: unique,
     })
    }
  }

  return ( 
<div className="mr-13">

{product && product.rating && product.rating.length>0 ?
     ( showAverage(product)) : (
       <div className="text-center pt-1 pb-3">No rating yet</div>
     )}

      <Card hoverable cover={
      <img src={ images && images.length ? images[0].url : "" }/>
       } style={{width: 130}}
       actions={[
        <Link to={`/product/${slug}`}
        ><EyeOutlined key="edit" className="text-warning"/>
        <br/>
         View Product</Link>,

      <Tooltip title={tooltip}
      >
        <a
         onClick={handleAddToCart}
         disabled={product.quantity < 1}
         >
        <ShoppingCartOutlined key="Delete" className="text-danger"
        /><br/>{product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
        </a>
          
      </Tooltip>
      ]}
       >
        <Meta title={`${title}-$${price}`}
        description={`${description && description.substring(0,15)}...`}
      />
    </Card>
</div>
   
  )
}

export default ProductCard
