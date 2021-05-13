import React, {useState} from 'react'
import {Card, Tooltip, Tabs} from 'antd'
import {HeartOutlined, ShoppingCartOutlined} from '@ant-design/icons'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ProductListItems from './ProductListItems'
import StarRatings from 'react-star-ratings';
import RatingModal from '../modal/RatingModal'
import _ from 'lodash'
import {showAverage} from '../../functions/rating'
import {useDispatch, useSelector} from 'react-redux'
import {addToWishlist} from '../../functions/user'
import { toast } from 'react-toastify';
import {useHistory} from 'react-router-dom'


const {TabPane} = Tabs
const SingleProduct = ({product, onStartClick, star}) => {
  const {title, description , images, slug, _id} = product

  const [tooltip, setTooltip] = useState("Click to add")
  const dispatch = useDispatch()
  const {user, cart} = useSelector((state) => ({...state}))
  let history = useHistory()


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

  const handleAddToWishList = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token)
    .then((res) => {
      toast.success("Added to Wishlisht")
      history.push("/user/wishlist")
    })
  }

  return (
    <>
    <div className="col-md-7">
    {images && images.length ? (<Carousel showArroes={true} autoPlay infiniteLoop>
      {images && images.map((i) => <img key={i.public_id} src={i.url}></img>)}
    </Carousel>) : "No Image"}
    
    <Tabs type="card">
       <TabPane tab="Description" key="1">
        {description}
       </TabPane>
       <TabPane tab="More" key="2">
         Please email us for detail info.
       </TabPane>
    </Tabs>
    </div>

    <div className="col-md-5">
      <h1 className="text-muted p-3">{title}</h1>
      {product && product.rating && product.rating.length>0 ?
     ( showAverage(product)) : (
       <div className="text-center pt-1 pb-3">No rating yet</div>
     )}
      

     <Card
       actions={[
         
        <a onClick={handleAddToWishList}
        ><HeartOutlined key="wishlisht" className="text-warning"/>
        <br/>
         Add to Wishlist</a>,

         <>
      <Tooltip title={tooltip}>
        <a
         onClick={handleAddToCart}
         >
        <ShoppingCartOutlined key="Delete" className="text-danger"
        /><br/>Add to Cart,
        </a>

      </Tooltip>
         </>,

         <>
         <div>
         <RatingModal>

        <StarRatings
              name={_id}
              numberOfStars={5}
              starRatedColor="blue"
              rating={star} 
              changeRating = {onStartClick}
              isSelectable = {true}
              starRatedColor="red"
              starWidthAndHeight = "5px"
              />
        </RatingModal>
         </div>
        </>
      ]}
       >
        <ProductListItems product={product}/>
    </Card>
    </div>
    </>
  )
}

export default SingleProduct
