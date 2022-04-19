import { Layout, Menu } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

const AntdLayout = ({ children, isLoginDone }) => {
  return (
    <div className="a">
      <Layout>
        {isLoginDone && (
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo" />(
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                nav 1
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                nav 2
              </Menu.Item>
              <Menu.Item key="3" icon={<UploadOutlined />}>
                nav 3
              </Menu.Item>
              <Menu.Item key="4" icon={<UserOutlined />}>
                nav 4
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>DialComunication</Footer>
        </Layout>
        <style jsx>{`
          .logo {
            height: 32px;
            margin: 16px;
            background: rgba(255, 255, 255, 0.2);
          }

          .site-layout-sub-header-background {
            background: black;
          }

          .site-layout-background {
            background: #fff;
          }
        `}</style>
      </Layout>
    </div>
  );
};

export { AntdLayout };
