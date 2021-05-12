import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import {createProduct} from '../../functions/product'
import {PRODUCT_INITIAL_VALUES} from '../../functions/initialValues'
import {getCategories, getCategorySubs} from '../../functions/category'
import {Select} from 'antd'

const { Option } =Select

const ProductCreateForm = () => { 

  const [values,setValues] = useState(PRODUCT_INITIAL_VALUES)
  const {user} = useSelector((state) => ({...state}))
  const [subOptions,setSubOptions] = useState([]) // this is created for product create subs after selection Parent category
  const [showSub, setShowSub] = useState(false)

  const {title, description, price, categories, category, subs, shipping,
    quantity, images, colors, brands, color, brand} = values

    useEffect(() => {
      loadCategories()
    },[])

    const loadCategories = () => {
      getCategories().then((c) => {
        setValues({...values, categories: c.data})} )

    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      await createProduct(values, user.token)
      .then((res) => {
      
        toast.success(`${res.data.title} Product is created`)
        window.location.reload()
      })
      .catch(error => {
        console.log(error)
        toast.error(error.response.data.error)
      })
    }

    const handleChange = (e) => {
      setValues({...values, [e.target.name]: e.target.value})
    }

    const handleCategoryChange = (e) => {
      e.preventDefault()
      console.log("Cliclked Category", e.target.value)
      setValues({...values, subs: [], category: e.target.value})
      getCategorySubs(e.target.value)
      .then(res => {
        console.log("sub category in product create form", res)
        setSubOptions(res.data)
      })
        setShowSub(true)
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
      onChange={handleChange}>
        <option >Select one</option>
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
      onChange={handleChange}>
        <option >Select one</option>
        {colors.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Parent Category</label>
      <select className="form-control" name="category" onChange={handleCategoryChange}>
        <option>Parent Categoy for sub</option>
        {categories.length > 0 && categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Brand</label>
      <select name="brand" className="form-control"
      onChange={handleChange}>
        <option >Select one</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
    </div>

        { showSub && (<div>
          <label>Sub Categories</label>
          <Select
          mode="multiple"
          style={{width: "100%"}}
          placeholder="Multiple Selection"
          onChange={(value) => setValues({...values, subs: value})} // antd gives value instead of e.target.vaue
          value={subs}
          >

          {subOptions.length && subOptions.map((o)=> ( 
            <Option key={o._id} value={o._id}>{o.name}</Option>
          ))}

          </Select>
        </div>)}

  <button className="btn btn-outline-info">Save</button>


  </form>
) }

export default ProductCreateForm
