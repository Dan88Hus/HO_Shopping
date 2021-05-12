import axios from 'axios'


export const getCategories = async () => {
  const res= await axios.get(`${process.env.REACT_APP_API}/categories`)
  console.log('test')
  console.log(res)
  return res
}

export const getCategory = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/category/${slug}`)
}

export const removeCategory = async (slug, authtoken) => {

    await axios.delete(`${process.env.REACT_APP_API}/category/${slug}`, {
    headers: {
      authtoken,
    }
  })
  
}


export const updateCategory = async (slug, category, authtoken) => {
  return await axios.put(`${process.env.REACT_APP_API}/category/${slug}`, category, {
    headers: {
      authtoken,
    }
  })
}

export const createCategory = async (categoryy, authtoken) =>  { 
  
    console.log("functions category.js",categoryy)
    return await axios.post(`${process.env.REACT_APP_API}/category`, {categoryy}, {
    headers: {
      authtoken,
    },
  })
  
}

export const getCategorySubs = async (_id) => {
  return await axios.get(`${process.env.REACT_APP_API}/category/subs/${_id}`)
}