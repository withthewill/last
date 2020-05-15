import React, { useState } from 'react';
import { Input, Message, Form } from '@alifd/next';
import { history, request } from 'ice';
import {stringify} from 'qs';
import styles from './index.module.scss';

const { Item } = Form;

export interface IDataSource {
  name: string;
  psw: string;
}

const DEFAULT_DATA: IDataSource = {
  name: '',
  psw: '',
};

interface LoginProps {
  dataSource: IDataSource;
};


const LoginBlock: React.FunctionComponent<LoginProps> = (props: LoginProps): JSX.Element => {
  const {
    dataSource = DEFAULT_DATA,
  } = props;

  const [postData, setValue] = useState(dataSource);




  const formChange = (values: IDataSource) => {
    setValue(values);
  };

  const handleSubmit = async (values: IDataSource, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }

    const data = await request({
      url: 'registerLogin/login',
      method: 'POST',
      data: stringify(values)
    })
    if (data.code === 200) {
      Message.success('登录成功');
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("user_id", data.userId);
      sessionStorage.setItem("email", data.email);
      history.push('/base/dashboard/analysis')
    } else {
      Message.error('账户名或密码错误');
    }

  };



  const accountForm = <>
    <Item required requiredMessage="必填">
      <Input
        name="name"
        maxLength={20}
        placeholder="用户名"
      />
    </Item>
    <Item required requiredMessage="必填" style={{ marginBottom: 0 }}>
      <Input.Password
        name="psw"
        htmlType="password"
        placeholder="密码"
      />
    </Item>
  </>;



  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <div className={styles.desc}>
          <span className={styles.active}>账户密码登录</span>
        </div>

        <Form
          value={postData}
          onChange={formChange}
          size="large"
        >
          {accountForm}

          <div className={styles.infoLine}>
            <div className={styles.link} onClick={() => { history.push('/user/register') }}>注册账号</div>
            <div>
              <div className={styles.link} >忘记密码</div>
            </div>
          </div>

          <Item style={{ marginBottom: 10 }}>
            <Form.Submit
              type="primary"
              onClick={(values: IDataSource, errors: []) => handleSubmit(values, errors)}
              className={styles.submitBtn}
              validate
            >
              登录
            </Form.Submit>
          </Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginBlock;
