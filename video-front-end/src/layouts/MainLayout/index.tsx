import React, { useState } from "react";
import { Layout, Menu, Typography, Button, Avatar, Dropdown } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  FolderOutlined,
  PartitionOutlined,
  UserAddOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet } from "react-router-dom";
import styles from "./index.module.css";
import user_group from "@/assets/images/icons/user_group.png";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>(["workflow"]);
  // 判断是否为AI混剪页面
  const isAIRender = location.pathname === "/ai-render";
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore.getState().userInfo?.user;
  const space = useUserStore.getState().userInfo?.space;
  const navigate = useNavigate();

  // 处理子菜单展开/收起
  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      logout();
      navigate("/login", { replace: true });
    }
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: "profile",
      label: "个人资料",
    },
    {
      key: "settings",
      label: "设置",
    },
    {
      key: "logout",
      label: "退出登录",
    },
  ];

  return (
    <Layout
      className={`${styles.layout} ${isAIRender ? styles.fullscreen : ""}`}
    >
      {/* 只在非AI混剪页面显示侧边栏 */}
      {!isAIRender && (
        <Sider width={220} className={styles.sider} theme="light">
          <div className={styles.logo}>
            <Title level={5} className={styles.title}>
              AMIRO 宗匠科技
            </Title>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            className={styles.menu}
          >
            <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
              <Link to="/dashboard">首页</Link>
            </Menu.Item>

            <Menu.SubMenu
              key="workflow"
              icon={<PartitionOutlined />}
              title="工作流"
            >
              <Menu.Item key="/ai-render">
                <Link to="/ai-render">AI混剪</Link>
              </Menu.Item>
              <Menu.Item key="/ai-digital-human">
                <Link to="/ai-digital-human">AI数字人</Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="/ai-material" icon={<FolderOutlined />}>
              <Link to="/ai-material">AI素材中心</Link>
            </Menu.Item>

            <Menu.Item key="/tools" icon={<AppstoreOutlined />}>
              <Link to="/tools">工具箱</Link>
            </Menu.Item>

            <Menu.Divider />

            <div className={styles.menuSection}>空间</div>

            {space?.map((item) => (
              <Menu.Item
                key={`/team/${item.id}`}
                icon={
                  <img
                    src={user_group}
                    style={{ width: 22, height: 22, verticalAlign: "middle" }}
                  />
                }
              >
                <Link to={`/team/${item.id}`}>{item.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      )}
      <Layout>
        {!isAIRender && (
          <Header className={styles.header}>
            <div className={styles.headerRight}>
              <Button
                className={styles.inviteButton}
                icon={<UserAddOutlined />}
              >
                邀请
              </Button>
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
              >
                <div className={styles.userInfo}>
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  <span className={styles.userName}>{user?.name}</span>
                  <DownOutlined className={styles.downIcon} />
                </div>
              </Dropdown>
            </div>
          </Header>
        )}
        <Content
          className={`${styles.content} ${
            isAIRender ? styles.fullContent : ""
          }`}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
