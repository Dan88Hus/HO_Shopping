import React, {useEffect, useState} from 'react'
import AdminNav from '../../components/nav/AdminNav'
import {getOrders, changeStatus} from '../../functions/admin'
import {useSelector, useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import Orders from "../../components/order/Orders";

const AdminDashboard = () => {

  const [orders, setOrders] = useState([])
  const {user} = useSelector((state) => ({...state}))

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () =>
    getOrders(user.token).then((res) => {
      // console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data);
    });

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      toast.success("Status updated");
      loadOrders();
    });
  };

  return (
    <div className="container-fluid auto">
      <div className="row">
        <div className="col-auto mt-1">
        <AdminNav />
        </div>


        <div className="col-auto">
          <h6 className="text-muted">Admin Dashboard</h6>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>


        </div>

    </div>
  )
}

export default AdminDashboard