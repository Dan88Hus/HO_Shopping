import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'
 

function ProductUpdate({match}) {
 
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
        <AdminNav />
        </div>


        <div className="col">
          <h4>Product Update Page</h4>
          <div className="p-3">
        </div>

        <ProductUpdateForm
        match={match}
        />
        <hr/>
        </div>

      </div>
    </div>
  )
}

export default ProductUpdate
