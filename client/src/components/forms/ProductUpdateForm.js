import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import {getProduct} from '../../functions/product'
import {PRODUCT_INITIAL_VALUES} from '../../functions/initialValues'
import {getCategories, getCategorySubs} from '../../functions/category'
import {updateProduct} from '../../functions/product'

import {Select} from 'antd'

const { Option } =Select

const ProductUpdateForm = ({match}) => { 

  const {user} = useSelector((state) => ({...state}))
  const {slug} = match.params 
  const [values,setValues] = useState(PRODUCT_INITIAL_VALUES)
  const [categories, setCategories] = useState([]);
  const [arrayOfSubIds,setArrayOfSubIds] = useState([])

  const {title, description, price, category, subs, shipping,
    quantity, images, colors, brands, color, brand} = values

  const [subOptions,setSubOptions] = useState([]) // this is created for product create subs after selection Parent category
  const [showSub, setShowSub] = useState(false)

  useEffect(() => {
    loadProduct()
    loadCategories()
  },[])

  const loadProduct = () => {
    getProduct(slug)
    .then((p)=>{
      setValues({...values, ...p.data})
      getCategorySubs(p.data.category._id)
      .then((res) => {
        setSubOptions(res.data)
      })
      let arr = []
      p.data.subs.map((s) => {
        arr.push(s._id)
      })
      setArrayOfSubIds(prev => arr)
    })
  }

  const loadCategories = () => {
    getCategories().then((c) => {
      setCategories(c.data)} )
  }

    const handleSubmit = async (e) => {
      e.preventDefault()

      await updateProduct(slug, values, user.token)
      .then((res) => {
        toast.success(`${res.data.title} is updated`)
        window.location.reload()
        loadCategories()
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.response.data.error)
      })
  
    }

    const handleChange = (e) => {
      setValues({...values, [e.target.name]: e.target.value})
    }

    const handleCategoryChange = (e) => {
      e.preventDefault()
      console.log("Clicked Category", e.target.value)
      setValues({...values, subs: [], category: e.target.value})
      getCategorySubs(e.target.value)
      .then(res => {
        console.log("sub category in product create form", res)
        setSubOptions(res.data)
      })

      setArrayOfSubIds([])
    }

  return (
  <form
  onSubmit={handleSubmit}>
    
   
    <div className="form-group">
      <label>Title</label>
      <input type="text" name="title" className="form-control" 
      value={title} onChange={handleChange}/>
    </div>


    <div className="form-group">
      <label>Description</label>
      <input type="text" name="description" className="form-control" 
      value={description} onChange={handleChange}/>
    </div>

    <div className="form-group">
      <label>Price</label>
      <input type="number" name="price" className="form-control" 
      value={price} onChange={handleChange}/>
    </div>

    <div className="form-group">
      <label>Shipping</label>
      <select name="shipping" className="form-control"
      value={shipping === "Yes" ? "Yes" : "No"}
      onChange={handleChange}>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    <div className="form-group">
      <label>Quantity</label>
      <input type="number" name="quantity" className="form-control" 
      value={quantity} onChange={handleChange}/>
    </div>

    <div className="form-group">
      <label>Color</label>
      <select name="color" className="form-control"
      value={color}
      onChange={handleChange}>
        {colors.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Parent Category</label>
      <select className="form-control" name="category" onChange={handleCategoryChange}>
        <option>{category.name}</option>
        {categories.length > 0 && categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Brand</label>
      <select name="brand" className="form-control"
      value={brand}
      onChange={handleChange}>

        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
    </div>
        
<       div>
          <label>Sub Categories</label>
          <Select
          mode="multiple"
          style={{width: "100%"}}
          placeholder="Multiple Selection"
          value={arrayOfSubIds}
          onChange={(value) => setArrayOfSubIds(value)} // antd gives value instead of e.target.vaue
          >

          {subOptions.length && subOptions.map((o)=> ( 
            <Option key={o._id} value={o._id}>{o.name}</Option>
          ))}

          </Select>
        </div>

  <button className="btn btn-outline-info">Save</button>


  </form>
) }

export default ProductUpdateForm
