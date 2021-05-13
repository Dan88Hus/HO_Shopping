import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {getSubs} from '../../functions/sub'

const SubList = () => {

  const [subs, setSubs] =useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    getSubs().then((res)=>{
      setSubs(res.data)
      setLoading(false)} )
    },[])

    const showSubs = () =>{
  return (subs.map((s)=> 
        (<div key={s._id} className="col btn btn-outlined-primary btn-raised btn-block">
          <Link to={`/sub/${s.slug}`}>
          {s.name}
          </Link>
        </div>)
        
      ))
    }
    

  return (
    <div className="container-fluid">
      <div  className="row">
      {loading ? (<h4 className="text-danger">Loading</h4>) :
      (showSubs())
      }
      </div>
      
    </div>
  )
}

export default SubList
