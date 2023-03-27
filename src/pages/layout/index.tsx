// import { Outlet, NavLink } from 'react-router-dom';
// const Index = () => (
//   <div>
//     <NavLink to='/page1'>page1</NavLink>
//     <NavLink to='/page2'>page2</NavLink>
//     <div style={{ paddingTop: '20px' }}>
//       <Outlet />
//     </div>
//   </div>
// );
import { Layout } from 'antd';
import style from './style.less';

const { Sider, Content } = Layout;

console.log(style);

const Index = () => (
  <Layout className={style['layout-container']}>
    <Sider>left sidebar</Sider>
    <Content>main content</Content>
    <Sider>right sidebar</Sider>
  </Layout>
);

export default Index;
