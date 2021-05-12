import axios from 'axios'

export const getUserOrders = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/orders`, 
  {
    headers: {
    authtoken,
  }
})