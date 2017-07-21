import React, {Component} from 'react';
import {Form, Icon, Input, Button, message, Row,Layout,Menu} from 'antd';
import {connect} from 'react-redux';
import './LeftLayout.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const {SubMenu,Item} =Menu;


class MyMenu extends Component{
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render(){
    console.log(typeof(this.props.keyName),this.props.keyName)
    console.log(typeof(this.props.open),this.props.open)
    return(
      <Layout style={{ height: '100vh' }}>
        <Sider style={{ overflow: 'auto' }}
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo">Logo</div>
          <Menu theme="dark" defaultSelectedKeys={[this.props.keyName]} mode="inline" defaultOpenKeys={[this.props.open]}>
            <Item key="Calculator">
              <Link to='/'>
                <Icon type="calculator"/>
                <span>计算器</span>
              </Link>
            </Item>
            <SubMenu
              defaultCollapsed={this.props.open}
              key="Setting"
              title={<span><Icon type="setting" /><span>参数设置</span></span>}>
              <Item key="Limitation">
                <Link to='/Limitation'>
                  <Icon type="user"/>
                  缴费基数上下限
                </Link>
              </Item>
              <Item key="Proportion">
                <Link to='/Proportion'>
                  <Icon type="user"/>
                  社保缴费比率
                </Link>
              </Item>
            </SubMenu>
          </Menu>
         </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} >
            {/* <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            /> */}
            <h1 style={{margin:'0 24px'}}>缴税计算器</h1>
          </Header>

          <Content style={{ margin: '24px 24px 0', overflow: 'initial' }}>

           {this.props.children}

          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Calcultor ©2017 Created by Loncus
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
// MyMenu.__ANT_LAYOUT_SIDER = true;
export default MyMenu;