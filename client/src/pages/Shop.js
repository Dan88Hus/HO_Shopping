import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getProductByCount, fetchProductsByFilter} from '../functions/product'
import ProductCard from  '../components/cards/ProductCard'
import {Menu, Slider, Checkbox, Radio} from 'antd'
import {getCategories} from '../functions/category'
import {getSubs} from '../functions/sub'

import Star from '../components/forms/Star' 


const Shop = () => {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [price, setPrice] =useState([0,0]) 
  const [ok,setOk] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState([])// this is used for user selection for category in filter
  const [star, setStar] = useState("")
  const [subs, setSubs] = useState([])
  const [sub, setSub] = useState("") // this will be used for filtering sub that user select
  const [brands, setBrands] = useState(["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"])
  //  enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"]
  const [brand,setBrand] = useState("")// this will be used for user selection brand
  const [colors, setColors] = useState(["Black", "Brown", "Silver", "White", "Blue"])
  // enum: ["Black", "Brown", "Silver", "White", "Blue"]
  const [color, setColor] = useState([])//user selection color
  const [shipping, setShipping] = useState("")
  // enum: ["Yes", "No"],



  let dispatch = useDispatch()
  let {search} = useSelector((state) => ({...state}))
  const {text} = search
 
  useEffect(()=>{
    loadAllProducts()
    getCategories().then((res)=> setCategories(res.data))
    getSubs().then((res) => setSubs(res.data))


  },[])
  const loadAllProducts = ()  => {
    getProductByCount(12).then((res) =>{
      setProducts(res.data)
      setLoading(false)
    })
  }



useEffect(()=>{
  const delayed = setTimeout(()=>{
    fetchProducts({query: text}) 
  },300)
  if (!text) {
    loadAllProducts()
  }
  return () => clearTimeout(delayed)
},[text])

const fetchProducts = (arg) => {
  fetchProductsByFilter(arg).then((res)=>{
    setProducts(res.data)
  })
}
  useEffect(()=> {
    fetchProducts( {price})
  },[ok]) 

  const handleSlider = (value) => {
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: ""}
  })
  setCategoryIds([])
  setPrice(value)
  setStar("")
  setSub("")
  setColor("")
  setShipping("")
  setTimeout(()=> {
    setOk(!ok)
  },300)
}

const showCategories = () => 
  categories.map((c)=>
    (
    <div key={c._id}>
      <Checkbox 
      onChange={handleCheck}
      className="pb-2 pl-4 pr-4" value={c._id}
      >{c.name}</Checkbox>
      <br/>
    </div>
     )
     )
const handleCheck = (e) => {
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: ""}
  })
  setPrice([0, 0])
  setStar("")
  setSub("")
  setColor("")
  setShipping("")
  let inTheState = [...categoryIds]
  let justChecked = e.target.value
  let foundInTheState = inTheState.indexOf(justChecked)
  if (foundInTheState === -1) {
   inTheState.push(justChecked)
  } else {

    inTheState.splice(foundInTheState, 1)
  }
  setCategoryIds(inTheState)
  fetchProducts({category: inTheState})
  }
const handleStarClick = (num) => {
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: ""}
  })
  setPrice([0, 0])
  setCategoryIds([])
  setStar(num)
  setSub("")
  setColor("")
  setShipping("")
  fetchProducts({stars : num})
}
const showStars = () => (
  <div classname="pr-4 pl-4 pb-2">
    <Star starClick={handleStarClick} numberOfStars={5}/>
    <Star starClick={handleStarClick} numberOfStars={4}/>
    <Star starClick={handleStarClick} numberOfStars={3}/>
    <Star starClick={handleStarClick} numberOfStars={2}/>
    <Star starClick={handleStarClick} numberOfStars={1}/>
  </div>
)
const showSubs = () => (
  subs.map((s) => 
  <div key={s._id}
  onClick={() => handleSub(s)}
  className="p-1 m-1 badge badge-secondary"
  style={{cursor: 'pointer'}}
  >
    {s.name}    
  </div>)
)
const handleSub = (sub) =>{
  setSub(sub)
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: ""}
  })
  setPrice([0, 0])
  setCategoryIds([])
  setStar("")
  setColor("")
  setShipping("")
  fetchProducts({sub : sub})
}

const showBrands = () => ( 
  brands.map((b)=> <Radio key={b}
  value={b}
  name={b}
  checked={b === brand} 
  onChange={handleBrand}
  className="pb-1 pl-1 pr-4"
  >
    {b}
  </Radio>)
)
const handleBrand = (e) => {
  setSub("")
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: ""}
  })
  setPrice([0, 0])
  setCategoryIds([])
  setStar("")
  setColor("")
  setShipping("")
  setBrand(e.target.value)
  fetchProducts({brand : e.target.value})
}

const showColors = () => ( 
  colors.map((c)=> <Radio 
  key={c}
  value={c}
  name={c}
  checked={c === color}
  onChange={handleColor}
  className="pb-1 pl-1 pr-4"
  >
    {c}
  </Radio>)
)
const handleColor = (e) => {
  setSub("")
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: ""}
  })
  setPrice([0, 0])
  setCategoryIds([])
  setStar("")
  setBrand("")
  setShipping("")
  setColor(e.target.value)
  fetchProducts({color : e.target.value})
}
const showShipping = () => ( 
  <>
  <Checkbox
  className="pb-2 pl-4 pr-4"
  onChange={handleShippingChange}
  value="Yes"
  checked={ shipping === "Yes"} 
  > Yes </Checkbox>

<Checkbox
  className="pb-2 pl-4 pr-4"
  onChange={handleShippingChange}
  value="No"
  checked={ shipping === "No"} 
  > No </Checkbox>
  </>
)

const handleShippingChange = (e) => {
  setSub("")
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: ""}
  })
  setPrice([0, 0])
  setCategoryIds([])
  setStar("")
  setBrand("")
  setColor("")
  setShipping(e.target.value)
  fetchProducts({shipping : e.target.value})
}
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <h4>Search/Filter</h4>
          <hr/>
            <Menu defaultOpenKeys={["1","2","3","4","5","6","7","8"]} mode="inline">
              <Menu.SubMenu key="1" title="Price">
                <div>
                  <Slider className="ml-4 mr-4" 
                  tipFormatter={(v)=> `$${v}`}
                  range value={price}
                  onChange={handleSlider}
                  max="4999"
                  >
                  </Slider>
                </div>
              </Menu.SubMenu>

              <Menu.SubMenu key="2" title="Category">
                <div style={{marginTop: "-20px"}}>
                  {showCategories()}
                </div>
              </Menu.SubMenu>

              <Menu.SubMenu key="3" title="Rating">
                <div style={{marginTop: "-10px"}}
                className="pl-4 pr-4"
                >
                  {showStars()}
                </div>
              </Menu.SubMenu>

              <Menu.SubMenu key="4" title="Sub Categories">
                <div style={{marginTop: "-10px"}}
                className="pl-4 pr-4"
                >
                  {showSubs()}
                </div>
              </Menu.SubMenu>

              <Menu.SubMenu key="5" title="Brands">
                <div style={{marginTop: "-10px"}}
                className="pl-4 pr-4"
                >
                  {showBrands()}
                </div>
              </Menu.SubMenu>

              <Menu.SubMenu key="6" title="Colors">
                <div style={{marginTop: "-10px"}}
                className="pl-4 pr-4"
                >
                  {showColors()}
                </div>
              </Menu.SubMenu>

              <Menu.SubMenu key="7" title="shipping">
                <div style={{marginTop: "-10px"}}
                className="pl-4 pr-4"
                >
                  {showShipping()}
                </div>
              </Menu.SubMenu>
            </Menu>

        </div>

      <div className="col-md-9">
        {loading ? (<h4 className="text-danger">Loading</h4>) : (<h4 className="text-center">Products</h4>) }
      
      {products.length < 1 && <p>"No Product Found"</p>}

      <div className="row">
        {products.map((p)=> (
          <div className="col-md-4" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
  )
}

export default Shop
