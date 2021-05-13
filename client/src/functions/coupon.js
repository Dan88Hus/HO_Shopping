import axios from 'axios'

export const getCoupons = async () => {
  let coupons = await axios.get(`${process.env.REACT_APP_API}/coupons`)
  return coupons
}

export const removeCoupon = async (couponId, authtoken) => {
  let deletedId = await axios.delete(`${process.env.REACT_APP_API}/coupon/${couponId}`, {
    headers: {
      authtoken
    }
  })
  return deletedId
}


export const createCoupon = async (coupon, authtoken) => {
  await axios.post(`${process.env.REACT_APP_API}/coupon`, {coupon}, {
    headers: {
      authtoken
    }
  })
}
