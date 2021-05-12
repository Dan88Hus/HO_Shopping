import React, {useState, useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import {useSelector} from 'react-redux'
import ProductCreateForm from '../../../components/forms/ProductCreateForm'
import FileUpload from '../../../components/forms/FileUpload'

function ProductCreate({history}) {

  const {user} = useSelector((state) => ({...state}))

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
        <AdminNav />
        </div>

        <div className="col">
          <h4>Product Create Page</h4>
          <div className="p-3">
          <FileUpload/>
        </div>

        <ProductCreateForm/>
        <hr/>
        </div>

      </div>
    </div>
  )
}

export default ProductCreate
