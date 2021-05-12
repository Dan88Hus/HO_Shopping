import React,{useState} from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import {useSelector} from 'react-redux'
import {PRODUCT_INITIAL_VALUES} from '../../functions/initialValues'
import {Avatar, Badge} from 'antd'



const FileUpload = () => {

  const {user} = useSelector((state) => ({...state}))
  const [values, setValues] = useState(PRODUCT_INITIAL_VALUES)
  const [loading,setLoading] =useState(false)

   const handleImageRemove = (public_id)=>{
    setLoading(true)
    axios.post(`${process.env.REACT_APP_API}/removeimage`, {public_id: public_id},{
      headers: {
        authtoken: user ? user.token : "",
      }
    }).then((res)=>{
      setLoading(false)
      const {images} = values
      let filteredimages = images.filter((item)=> {
        return item.public_id !== public_id
      })
      setValues({...values, images: filteredimages})
    })
    .catch((error) => {
      console.log(error)
      setLoading(false)
    })
  }

  const fileUploadAndResize = (e) => {
    let files = e.target.files
    let allUploadedFiles = values.images


    if(files){
      setLoading(true)
      for(let i=0; i< files.length; i++) {
        Resizer.imageFileResizer(files[i], 720, 720, "JPEG", 100, 0, (uri)=>{
          axios.post(`${process.env.REACT_APP_API}/uploadimages`, {image: uri}, {
            headers: {
              authtoken: user ? user.token : ""
            }
          }).then((res)=> {
            console.log("image upload res data",res)
            setLoading(false)
            allUploadedFiles.push(res.data)
            setValues({...values, images: allUploadedFiles})
          }).catch((error)=>{
            setLoading(false)
            console.log("Cloudinary upload ERROR",error)
          })
        },"base64")
      }
    }
  }

  return (
    <>
    <div className="row">
      
      {values.images && values.images.map((i)=> ( 
      <Badge count="X" 
      onClick={()=> handleImageRemove(i.public_id)}
      key={i.public_id}
      style={{cursor: 'pointer'}}
      >
          <Avatar  
          src={i.url}
          size={50}
          className="m-1"
          />

      </Badge>
       ))}
    </div>

      <div className="row"> 
        <label className="btn btn-secondary">Choose File
        <input type="file" multiple hidden accept="images/*"
        onChange={fileUploadAndResize}
        disabled={loading}
        />
        </label>
      </div>
    </>
  )
}

export default FileUpload
