import React from 'react';
import { Overlay, Menu, Icon } from '@alifd/next';
import { history } from 'ice'
import styles from './index.module.scss';

const { Item } = Menu;
const { Popup } = Overlay;

const UserProfile = ({ name, mail }) => {




  return (
    <div className={styles.profile}>
      {/* <div className={styles.avatar}>
        <Avatar src={avatar} alt="用户头像" />
      </div> */}
      <div className={styles.content}>
        <h4>{name}</h4>
        <span>{mail}</span>
      </div>
    </div>
  );
};



const HeaderAvatar = () => {
  const back = () => {
    history.push('/')
    sessionStorage.setItem("username", '');
    sessionStorage.setItem("user_id", '');
    sessionStorage.setItem("email", '');
  }
  return (
    <Popup
      trigger={
        <div className={styles.headerAvatar}>
          {/* <Avatar size="small" src={avatar} alt="用户头像" /> */}
          <span style={{ marginLeft: 10 }}>{sessionStorage.getItem('username')}</span>
        </div>
      }
      triggerType="click"
    >
      <div className={styles.avatarPopup}>
        <UserProfile {...{ name: sessionStorage.getItem('username'), mail: sessionStorage.getItem('email') }} />
        <Menu className={styles.menu}>
          {/* <Item><Icon size="small" type="account" />个人设置</Item>
          <Item><Icon size="small" type="set" />系统设置</Item> */}
          <Item onClick={() => back()}><Icon size="small" type="exit" />退出</Item>
        </Menu>
      </div>
    </Popup>
  );
};



export default HeaderAvatar;
