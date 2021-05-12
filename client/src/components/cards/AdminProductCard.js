import React from 'react'
import {Card} from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'


const {Meta} = Card


const AdminProductCard = ({product, handleRemove}) => {
  const {title, description, images, slug} = product

  return ( 
 
    <Card hoverable cover={
      <img src={ images && images.length ? images[0].url : "" }/>
       } style={{width: 130}}
       actions={[
        <Link to={`/admin/product/${slug}`}
        ><EditOutlined key="edit" className="text-warning"/>Edit</Link>,
        <DeleteOutlined key="Delete" className="text-danger"
        onClick={() => handleRemove(slug)}/>,
      ]}
       >
        <Meta title={title}
        description={`${description && description.substring(0,15)}...`}
      />
    </Card>
  )
}

export default AdminProductCard
