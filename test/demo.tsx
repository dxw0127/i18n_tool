import intl from "./local";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Form, Input, Button, message } from "antd";
import { login, UserProps } from "@/api";
import styles from "./index.scss";

const Login: React.FC = () => {
  const {
    push
  } = useHistory();

  const userLogin = async (values: UserProps) => {
    const [err] = await login(values);

    if (!err) {
      message.success("登录成功！");
      push("/");
    }
  };

  return <Row className={styles.container}>
      <Col span={16} className={styles.bgtitle}>
        博客管理后台
      </Col>
      <Col span={8} className={styles.content}>
        <div className={styles.formContent}>
          <div className={styles.title}>登录</div>
          <Form labelCol={{
          span: 6
        }} wrapperCol={{
          span: 18
        }} onFinish={userLogin}>
            <Form.Item label="用户名" name="userName" rules={[{
            required: true,
            message: "用户名不能为空"
          }]}>
              <Input />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{
            required: true,
            message: "密码不能为空"
          }]}>
              <Input type="password" />
            </Form.Item>
            <Form.Item wrapperCol={{
            offset: 6,
            span: 18
          }}>
              <Button type="primary" htmlType="submit" style={{
              marginRight: "16px"
            }}>
                登录
              </Button>
              <Link to="/register">注册账号</Link>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>;
};

export default Login;