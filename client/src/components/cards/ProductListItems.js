import React from 'react'
import {Link} from 'react-router-dom'


const ProductListItems = ({product}) => {
  const {title, images, description , price, slug, category, subs,
     shipping, color, brand, quantity, sold, rating } = product
  return (
    <ul className="list-group">
      <li className="list-group-item">
        Price{" "} <span className="label label-default label-pill float-right">
          $ {price}
        </span>
      </li>

      {category && (<li className="list-group-item">
        category{" "} <Link to={`/category/${category.slug}`} className="label label-default label-pill float-right">
          {category.name}
        </Link>
      </li>)
}
      {subs && (<li className="list-group-item">
        Sub Categories
        {subs.map((s) => ( 
          <Link to={`/sub/${s.slug}`} key={s._id} className="label label-default label-pill float-right">
          {s.name}
        </Link>
        ))} 
      </li>)}

      <li className="list-group-item">
        Shipping{" "} <span className="label label-default label-pill float-right">
          {shipping}
        </span>
      </li>

      <li className="list-group-item">
        Color{" "} <span className="label label-default label-pill float-right">
          {color}
        </span>
      </li>

      <li className="list-group-item">
        Brand{" "} <span className="label label-default label-pill float-right">
          {brand}
        </span>
      </li>

      <li className="list-group-item">
        Quantity in Stock{" "} <span className="label label-default label-pill float-right">
          {quantity}
        </span>
      </li>

      <li className="list-group-item">
        Sold{" "} <span className="label label-default label-pill float-right">
          {sold}
        </span>
      </li>
    </ul>
  )
}

export default ProductListItems
