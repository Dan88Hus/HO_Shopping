import React, {useState} from 'react'
import { Menu, Badge } from 'antd';
import { ShoppingCartOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined, SettingOutlined } from '@ant-design/icons';
import {Link, useHistory} from 'react-router-dom';
import firebase from 'firebase'
import {useDispatch, useSelector} from 'react-redux'
import  Search from '../forms/Search'


const { SubMenu } = Menu;

function Header() {
  const [current, setCurrent] = useState("shop");
  const dispatch = useDispatch()
  const history = useHistory()
  const {user, cart} = useSelector((state) => ({...state})) //if we destructure we spread


  const handleClick = e => {
    setCurrent({ current: e.key });
  };

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
            {/* <Badge count={cart.length} offset={[9, 0]}> */}
              Cart
            {/* </Badg  e> */}
          </Link>
        </Menu.Item>

      {!user && 
     ( <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right">
        <Link to='/register'>Register</Link>
        </Menu.Item>)}

        {!user && ( 
          <Menu.Item key="login" icon={<LoginOutlined />} className="float-right">
          <Link to='/login'>Login</Link>
          </Menu.Item>
        )}

        

        {user && (
          <SubMenu key="SubMenu" icon={<SettingOutlined />} 
          title={user.email && user.email.split('@')[0]} 
          className="float-right">
          
          {user && user.role === 'subscriber' && (
            <Menu.Item key="dashboard">
              <Link to="/user/history">Dashboard</Link></Menu.Item>
          )}

          {user && user.role === 'admin' && (
            <Menu.Item key="dashboard">
              <Link to="/admin/dashboard">Dashboard</Link></Menu.Item>
          )}  
          <Menu.Item key="logout" icon={<LogoutOutlined/>} onClick={logout}
        >Logout</Menu.Item>

      </SubMenu>
        )}
       
       <span className="float-right p-1">
         <Search />
       </span>



      </Menu>
    );
  }


export default Header
