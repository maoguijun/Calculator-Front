import React, {Component} from 'react';
import {
	Menu,
	Icon,
	Layout,
	Breadcrumb,
	Carousel,
	Row,
	Col,
	Button,
	Select,
	Form
} from 'antd';
import {isEmptyObject} from '../util/CommonUtil';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import LeftLayout from './LeftLayout';
import SoleCompanyPage from './items/SoleCompanyPage';
import SoleLaborPage from './items/SoleLaborPage';
import SoleSalaryPage from './items/SoleSalaryPage';


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const {Header, Content} = Layout;
const {Option} = Select;
const {Item} =Form;

class CalculatorPage extends Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.options={
			SoleCompany:<SoleCompanyPage/>,
			SoleLabor:<SoleLaborPage/>,
			SoleSalary:<SoleSalaryPage/>
		}
		this.state={
			option:this.options.SoleSalary,
		}
	}
	handleChange(value){
		this.setState({option:this.options[value]});
	}

	render() {
		return (
			<LeftLayout keyName={'Calculator'}>
				<Form layout='inline'>
					<Item label={'计算类别'}>
						<Select defaultValue="SoleSalary" style={{width:'200px'}} onChange={this.handleChange}>
							<Option value="SoleCompany">个人独资企业</Option>
							<Option value="SoleLabor">个人所得税-劳务报酬</Option>
							<Option value="SoleSalary">个人所得税-工资薪金</Option>
						</Select>
					</Item>
				</Form>
				
				{this.state.option}

			</LeftLayout>
		);
	}
}
export default CalculatorPage
