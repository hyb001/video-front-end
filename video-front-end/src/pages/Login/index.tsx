import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Checkbox,
  message,
  Space,
  Modal,
} from "antd";
import {
  MobileOutlined,
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import styles from "./index.module.css";
import SolidCaptcha from "@/components/SliderCaptcha";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [isForSendingCode, setIsForSendingCode] = useState(false); // 用于区分是登录/注册还是发送验证码
  const [hasVerifiedCaptcha, setHasVerifiedCaptcha] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, register, sendSms } = useUserStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 组件卸载时清除定时器
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleLogin = async (values: { phone: string; code: string }) => {
    try {
      setLoading(true);
      await login(values.phone, values.code);
      navigate("/dashboard");
    } catch (error) {
      console.error("登录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: {
    name: string;
    phone: string;
    email: string;
    code: string;
  }) => {
    try {
      setLoading(true);
      await register(values.name, values.phone, values.email, values.code);
      setIsLogin(true);
      form.resetFields();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCountdown(0);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    try {
      if (isLogin) {
        await form.validateFields(["phone"]);
      } else {
        await form.validateFields(["phone", "name", "email"]);
      }

      // 如果已经验证过滑块，直接发送验证码
      if (hasVerifiedCaptcha) {
        doSendCode();
      } else {
        // 第一次需要滑块验证
        setIsForSendingCode(true);
        setCaptchaVisible(true);
      }
    } catch (error) {
      console.error("发送验证码失败:", error);
      message.error("发送验证码失败，请重试");
    } finally {
      setSendingCode(false);
    }
  };

  // 实际发送验证码的函数
  const doSendCode = async () => {
    try {
      setSendingCode(true);
      const phone = form.getFieldValue("phone");
      const type = isLogin ? "login" : "register";
      await sendSms(phone, type);
      message.success("验证码已发送");

      // 开始倒计时
      setCountdown(60);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("发送验证码失败:", error);
      message.error("发送验证码失败，请重试");
    } finally {
      setSendingCode(false);
    }
  };

  const toggleMode = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsLogin(!isLogin);
    setCountdown(0);
    form.resetFields();
  };

  const handleCaptchaSuccess = (time?: number) => {
    setCaptchaVisible(false);
    console.log("验证成功，耗时:", time, "毫秒");

    setHasVerifiedCaptcha(true);

    if (isForSendingCode) {
      // 如果是为了发送验证码
      doSendCode();
      setIsForSendingCode(false);
    }
  };

  const handleCaptchaFail = (time?: number) => {
    console.log("验证失败，耗时:", time, "毫秒");
    message.error("验证失败，请重试");
    setSendingCode(false);
  };

  const handleCaptchaClose = () => {
    setCaptchaVisible(false);
    setIsForSendingCode(false);
    setSendingCode(false);
  };

  const handleSubmit = (values: any) => {
    if (isLogin) {
      handleLogin(values);
    } else {
      handleRegister(values);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <Card className={styles.loginCard} bordered={false}>
          <div className={styles.cardHeader}>
            <h2>宗匠AI数字人{isLogin ? "登录" : "注册"}</h2>
          </div>

          <Form
            form={form}
            name={isLogin ? "login" : "register"}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark={false}
            variant="filled"
          >
            {!isLogin && (
              <Form.Item
                name="name"
                rules={[{ required: true, message: "请输入用户名!" }]}
              >
                <Input
                  size="large"
                  placeholder="请输入用户名"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                />
              </Form.Item>
            )}

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "请输入手机号!" },
                { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号!" },
              ]}
            >
              <Input
                size="large"
                prefix={<MobileOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="请输入手机号"
              />
            </Form.Item>

            {!isLogin && (
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "请输入邮箱!" },
                  { type: "email", message: "请输入正确的邮箱!" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
            )}

            <Form.Item
              name="code"
              rules={[{ required: true, message: "请输入验证码!" }]}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  size="large"
                  prefix={
                    <SafetyOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="请输入验证码"
                  style={{ width: "calc(100% - 80px)" }}
                />
                <Button
                  type="text"
                  size="large"
                  loading={sendingCode}
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  style={{
                    width: "80px",
                    fontSize: "14px",
                    backgroundColor: "rgba(0,0,0,0.04)",
                  }}
                >
                  {countdown > 0 ? `${countdown}秒` : "验证码"}
                </Button>
              </Space.Compact>
            </Form.Item>
            <Form.Item
              name="policy"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("请阅读并同意用户隐私政策和条款")
                        ),
                },
              ]}
              className={styles.policyCheckbox}
            >
              <Checkbox>请阅读接受用户隐私政策和条款</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className={styles.submitButton}
              >
                {isLogin ? "登录" : "注册"}
              </Button>
            </Form.Item>

            <div className={styles.switchMode}>
              {isLogin ? "没有账号？" : "已有账号？"}
              <Button
                type="link"
                onClick={toggleMode}
                className={styles.switchButton}
              >
                {isLogin ? "去注册" : "去登录"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
      <Modal
        title="请完成下方拼图验证后继续"
        open={captchaVisible}
        onCancel={handleCaptchaClose}
        footer={null}
        width={400}
        centered
        closable
        maskClosable={false}
      >
        <SolidCaptcha
          onSuccess={handleCaptchaSuccess}
          onFail={handleCaptchaFail}
        />
      </Modal>
    </div>
  );
};

export default Login;
