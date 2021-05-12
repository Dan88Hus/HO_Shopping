import React,{useState, useEffect}  from 'react'
import UserNav from '../../components/nav/UserNav'
import {getUserOrders} from '../../functions/user'
import {useSelector, useDispatch} from 'react-redux'
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons'
import {toast} from 'react-toastify'
import { PDFDownloadLink } from "@react-pdf/renderer";
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo'
import Invoice from '../../components/order/Invoice'

const History = () => {
  const [orders, setOrders] = useState([])
  const {user} = useSelector((state) => ({...state}))

  useEffect(()=>{
    loadAllOrders()
  },[])

  const loadAllOrders =  () => {
    getUserOrders(user.token)
    .then((res)=>{
      setOrders(res.data)
    })
  }

  const showOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
        </tr>
      </thead>

      <tbody>
        {order.products.map((p, i) => (
          <tr key={i}>
            <td>
              <b>{p.product.title}</b>
            </td>
            <td>{p.product.price}</td>
            <td>{p.product.brand}</td>
            <td>{p.color}</td>
            <td>{p.count}</td>
            <td>
              {p.product.shipping === "Yes" ? (
                <CheckCircleOutlined style={{ color: "green" }} />
              ) : (
                <CloseCircleOutlined style={{ color: "red" }} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      // document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-block btn-outline-primary"
    >
      Download PDF
    </PDFDownloadLink>
  );

  const showEachOrders = () => ( 
    orders.map((o, i) => (
    <div key={i} className="m-5 p-3 card">
      {/* <ShowPaymentInfo order={o} /> */}
      {showOrderInTable(o)}
      <div className="row">
        <div className="col">{showDownloadLink(o)}</div>
      </div>
    </div>
    ))
  )

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto">
        <UserNav />
        </div>


        <div className="col-auto">
          <span className="container text-muted"><b>User History Page</b></span>
          {orders ? (showEachOrders()) 
          : ("No Order Yet")
          }
        </div>
      </div>
    </div>
  )
}

export default History
