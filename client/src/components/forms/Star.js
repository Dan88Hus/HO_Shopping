import React from 'react'
import StarRating from 'react-star-ratings'

const Star = ({starClick, numberOfStars}) => {
  return (
    <div>
      <StarRating
      changeRating ={()=>{ starClick(numberOfStars)}} 
      numberOfStars={numberOfStars}
      starDimension="15px"
      starSpacing="2px"
      starHoverColor="red"
      starEmptyColor="grey"
      ></StarRating>
    </div>
  )
}

export default Star
