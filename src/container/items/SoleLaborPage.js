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
	Form,
	Input,
} from 'antd';
import {connect} from 'react-redux';
import { isEmptyObject } from '../../util/CommonUtil';
import { getData } from '../../actions/SoleLabor';
import { formatDate, formatMoney, configDirectory, configDirectoryObject } from '../../utils/formatData';

const { Item } = Form;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 18 },
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 14,
			offset: 6,
		},
	},
};
class SoleLaborPage extends Component { 
	componentWillMount() {
		const {dispatch} = this.props;
		dispatch(getData());
	}

	onSubmit(e) { 
		e.preventDefault();
		// console.log(e)
		const { SoleLaborData } = this.props;
		console.log('aaa', SoleLaborData);
		// let data = SoleLaborData.objs.map(data => {
		// 	if (data.calculatorType == 'soleLabor') {
		// 		return data;
		// 	} else { 
		// 		return 0;
		// 	}
		// });
		let data = {};
		for (let i = 0; i < SoleLaborData.objs.length; i++) { 
			if (SoleLaborData.objs[i].calculatorType == 'soleLabor') { 
				data = SoleLaborData.objs[i].taxRateDetails;
			}
		}
		//let data = SoleLaborData.objs[0].taxRateDetails;//拿到劳务报酬个人所得税率
		console.log('2222',data);
		this.props.form.validateFields((err, value) => {
			let pre_tax = parseFloat(value.pre_tax);//税前工资
			let after_tax = 0;//税后工资
			let company_pay;//公司实际支出
			let tax;//个人所得税
			//如果输入的是税前工资

			if (value.pre_tax) {
				//工资小于4000元
				if (pre_tax <= 4000) {
					tax = (pre_tax - 800) * data[0].rate - data[0].deduction
					after_tax = pre_tax - tax;
					console.log(after_tax)
				} else {
					if (pre_tax < data[1].max) {
						tax = (pre_tax * 0.8) * data[0].rate - data[0].deduction
						after_tax = pre_tax - tax;
					} else if (pre_tax >= data[1].max && pre_tax < data[2].max) {
						tax = (pre_tax * 0.8) * data[1].rate - data[1].deduction
						after_tax = pre_tax - tax;
					} else if (pre_tax >= data[2].max) {
						tax = (pre_tax * 0.8) * data[2].rate - data[2].deduction
						after_tax = pre_tax - tax;
					}
				}

			} else if (value.after_tax) { 
				after_tax = value.after_tax;
				pre_tax = value.pre_tax;
				company_pay = value.company_pay;
				tax = value.tax;
				//先计算几个税后收入的范围，通过区间来匹配税率等
				let c1 = 4000- 4000 * 0.8 * data[0].rate;//3360
				let c2 = data[1].max- data[1].max * 0.8 * data[1].rate;//17200
				let c3 = data[2].max- data[2].max * 0.8 * data[2].rate;//41000
				if (after_tax < c1) {
					pre_tax = (after_tax - 800 * data[0].rate) / (1 - data[0].rate);
					tax = pre_tax - after_tax;
				} else if (after_tax < c2 && after_tax >= c1) {
					pre_tax = (after_tax - data[0].deduction) / (1 - 0.8 * data[0].rate);
					tax = pre_tax - after_tax;
				} else if (after_tax < c3 && after_tax >= c2) {
					pre_tax = (after_tax - data[1].deduction) / (1 - 0.8 * data[1].rate);
					tax = pre_tax - after_tax;
				} else if (after_tax > c3) { 
					pre_tax = (after_tax - data[2].deduction) / (1 - 0.8 * data[2].rate);
					tax = pre_tax - after_tax;
				}
			}

			company_pay = parseFloat(pre_tax);
			//把数据渲染到页面上
			this.props.form.setFields({
				pre_tax: { value: formatMoney(pre_tax) },
				after_tax: { value: formatMoney(after_tax) },
				company_pay: { value: formatMoney(company_pay) },
				tax: { value: formatMoney(tax)}	
			})
		});
	}
	//当一个输入框开始输入时，清除其他框的内容
	onChange(e) { 
		let id = e.target.id;
		let value = e.target.value;
		let data_putin = {
			pre_tax: { value: '' },
			after_tax: { value: '' },
			company_pay: { value: '' },
			tax: {value:''}
		}
		this.props.form.setFields(
			Object.assign({},data_putin, {
				id: {value:value}
			})
		)
	}

	render() { 
		const { getFieldDecorator } = this.props.form;
		const { SoleLaborData } = this.props;
		if (isEmptyObject(SoleLaborData)) {
			return (<div>
				数据请求错误！
			</div>)
		} else { 
			return (
				<Form
					layout='inline'
					style={{ padding: '24px 16px', border: '1px solid #fff', height: '450px', width: '800px', marginTop: '16px' }}
					onSubmit={e=>this.onSubmit(e)}>
					<Row>
						<Col lg={{span:16}}>
							<Item
								{...formItemLayout}
								label='税前工资'
								style={{ width: '80%', margin: '8px 0' }}>
								
								{getFieldDecorator('pre_tax', {
									rules: [{
										type:'number',message:'请输入有效数字！'
									}]
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='到手净得'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('after_tax', {
									rules: [{
										type:'number',message:'请输入有效数字！'
									}]
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
						</Col>
						<Col lg={{ span: 8 }}>
							<Button
								style={{ margin: '16px 0' }}
								type={'primary'}
								size={'large'}
								htmlType="submit">运算
							</Button>
						</Col>
					</Row>
					<Row>
						<Col lg={{ span: 16 }}>
							<Item
								{...formItemLayout}
								label='公司实际支出'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('company_pay', {
								})(
									<Input disabled/>
								)}
							</Item>
						</Col>
						<Col lg={{ span: 16 }}>
							<Item
								{...formItemLayout}
								label='个人所得税'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('tax', {
								})(
									<Input disabled/>
								)}
							</Item>
						</Col>
					</Row>
				</Form>
			)

		}
	}
}
const mapStateToProps = (state) => {
    const {SoleLabor} = state;
    return {SoleLaborData: SoleLabor.SoleLaborData}
}
const FormSoleLaborPage=Form.create()(SoleLaborPage);
export default connect(mapStateToProps)(FormSoleLaborPage)