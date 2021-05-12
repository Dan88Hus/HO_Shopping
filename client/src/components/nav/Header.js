import React, {useState, useEffect} from 'react'
import { Menu, Badge } from 'antd';
import {Link, useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { ShoppingCartOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined, SettingOutlined } from '@ant-design/icons';
import firebase from 'firebase'


const { SubMenu } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("shop");
  const dispatch = useDispatch()
  const history = useHistory()
  const {user, cart} = useSelector((state) => ({...state}))

  const handleClick = (e) => {
    setCurrent({current: e.key})
  }

  const logout =() => {
    firebase.auth().signOut()
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    history.push('/login')
  }

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      {/* <Menu.Item key={current} >
          <Link to='/'>Home</Link>
      </Menu.Item> */}

      <Menu.Item key={current} icon={<ShoppingCartOutlined />}>
          <Link to='/shop'>Shop</Link>
      </Menu.Item>

      <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to='/cart'>
          <Badge 
            // count={cart.length} 
            offset={[9, 0]}>
              Cart
          </Badge>
        </Link>
      </Menu.Item>

      <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right">
      <Link to='/register'>Register</Link>
      </Menu.Item>

      <Menu.Item key="login" icon={<LoginOutlined />} className="float-right">
        <Link to='/login'>Login</Link>
      </Menu.Item>

      <SubMenu key="SubMenu" icon={<SettingOutlined />} 
          // title={user.email && user.email.split('@')[0]} 
          className="float-right">
          
      <Menu.Item key="dashboard">
        <Link to="/user/history">Dashboard</Link>
      </Menu.Item>

      {/* if its admin dashboardb will be in here */}

      <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={logout}
        >Logout
      </Menu.Item>

      </SubMenu>
      
    </Menu>
  )
}


export default Header
