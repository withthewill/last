import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Message, Form } from '@alifd/next';
import {stringify} from 'qs';
import { history, request } from 'ice';
import styles from './index.module.scss';

const { Item } = Form;

export interface RegisterProps {
  username: string,
  email: string;
  password: string;
  rePassword: string;
}

export default function RegisterBlock() {
  const [postData, setValue] = useState({
    username: '',
    email: '',
    password: '',
    rePassword: '',
  });


  const formChange = (value: RegisterProps) => {
    setValue(value);
  };

  const checkPass = (rule: {}, values: string, callback: (errors?: string) => void) => {
    // console.log(rule, values, callback)
    if (values && values !== postData.password) {
      return callback('两次输入的密码不一致');
    } else {
      return callback();
    }
  };

  const handleSubmit = (values: RegisterProps, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    } else {
     request({
        url: 'registerLogin/register',
        method: 'POST',
        data: stringify({ name: values.username, psw: values.password, e: values.email })
      }).then(res => {
        if (res.code === 200) { 
          Message.success('注册成功');
          history.push('/user/login')
        }else{
          Message.error(res.msg);
        }
      })

    }



    // console.log('values:', values);
    // Message.success('注册成功');
  };

  return (
    <div className={styles.RegisterBlock}>
      <div className={styles.innerBlock}>
        <p className={styles.desc}>
          注册账号
        </p>

        <Form
          value={postData}
          onChange={formChange}
          size="large"
        >
          <Item required requiredMessage="必填">
            <Input
              name="username"
              size="large"
              maxLength={20}
              placeholder="用户名"
            />
          </Item>

          <Item required requiredMessage="必填">
            <Input.Password
              name="password"
              size="large"
              htmlType="password"
              placeholder="密码"
            />
          </Item>
          <Item required requiredTrigger="onFocus" requiredMessage="必填" validator={(rule: {}, values: string, callback: (errors?: string) => void) => checkPass(rule, values, callback)}>
            <Input.Password
              name="rePassword"
              size="large"
              htmlType="password"
              placeholder="确认密码"
            />
          </Item>
          <Item format="email" required requiredMessage="必填">
            <Input
              name="email"
              size="large"
              maxLength={20}
              placeholder="邮箱"
            />
          </Item>
          <Item>
            <Form.Submit
              type="primary"
              onClick={(values: RegisterProps, errors: []) => handleSubmit(values, errors)}
              className={styles.submitBtn}
              validate
            >
              注册账号
            </Form.Submit>
          </Item>
          <Item style={{ textAlign: 'center' }}>
            <div className={styles.link} onClick={() => { history.push('/user/login') }} style={{ textAlign: "center" }}>使用已有账号登录</div>
          </Item>
        </Form>
      </div>
    </div>
  );
}

RegisterBlock.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.object,
};

RegisterBlock.defaultProps = {
  value: {},
};
