import React from 'react'

const ShowPaymentInfo = ({order, showStatus = true}) => {
  return (
    <div className="container-auto">
      <p style={{cursor: "none"}}>
        <span className="float-left text-muted">
          Order Id: {order.paymentIntent.id}
        </span>
          {/* <br/> */}
          <span className="float-right">
          Amount: {(order.paymentIntent.amount/100).toFixed(3)}
          </span>
          <br/>
          {/* <br/> */}
          <span className="float-left text-muted">
          Currency: {order.paymentIntent.currency.toUpperCase()}
          </span>
          {/* <br/> */}
          <span className="float-right">
          Method: {order.paymentIntent.payment_method_types[0]}
          </span>
          <br/>
          <span className="float-left bg-success">
          Payment: {order.paymentIntent.status.toUpperCase()}
          </span>
          {/* <br/> */}
          <span className="float-right">
          Ordered on: {new Date(order.paymentIntent.created * 1000).toLocaleString()}
          </span>
          <br/>
          {showStatus && (
          <span className="badge bg-secondary">
          Status: {order.orderStatus}
          </span>)}
      </p>
    </div>
  )
}

export default ShowPaymentInfo
