import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import {getCoupons,removeCoupon,createCoupon} from '../../../functions/coupon'
import {DeleteOutlined} from '@ant-design/icons'
import AdminNav from '../../../components/nav/AdminNav'

const CreateCouponPage = () => {
  
  const [name, setName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [discount, setDiscount] = useState("")
  const [loading, setLoading] = useState("")
  const {user} = useSelector((state) => ({...state}))
  const [coupons, setCoupons] = useState([])

  
  
  useEffect(()=> {
    loadingcoupons()
  },[])
  
  const loadingcoupons = async () =>{
    await getCoupons()
    .then((res) => { 
      setCoupons(res.data)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createCoupon({name, expiry, discount}, user.token)
    .then((res)=>{
      setLoading(false)
      setName("")
      setDiscount("")
      setExpiry("")
      toast.success(`${name} is created as coupon`)
      loadingcoupons()
    }).catch(error => {
      console.log("Error to create coupon", error.message)
    })
  }
  const handleRemove = async (Id) => {
    if(window.confirm("Are you sure to Delete?")){
      await removeCoupon(Id, user.token)
      .then((response) => {
        loadingcoupons()
        toast.success(`${response.data.name} is deleted`)
      }). catch(error => console.log("handleRemove error", error.messase))
    }
  }



  return (
    <div className="container-fluid">
      <div className="row">
      <div className="col-auto">
        <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Coupon</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input type="text" className="form-control"
              onChange={(e)=> setName(e.target.value)}
              value={name}
              autoFocus
              required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input type="text" className="form-control"
              onChange={(e)=> setDiscount(e.target.value)}
              value={discount}
              autoFocus
              required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry Date: </label>
              <br/>

                 <input type="date" value={expiry} 
                 onChange={(e)=> setExpiry(e.target.value)}
                 ></input>
            </div>
            <button className="btn btn-primary">Save</button>
          </form>
          <br/>
          <h4>Coupons</h4>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c)=>(
                <tr key={c._id}>
                  <td className="text-muted">{c.name}</td>
                  <td className="text-muted">{new Date(c.expiry).toLocaleDateString()}</td>
                  <td className="text-muted">{c.discount}%</td>
                  <td className="text-muted">
                    <DeleteOutlined className="text-danger" 
                    onClick={() => handleRemove(c._id)}
                    style={{cursor: "pointer"}}/>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default CreateCouponPage
