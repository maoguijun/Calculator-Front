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
import pretreatNumber from '../../utils/pretreat';
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
		let data = {};
		for (let i = 0; i < SoleLaborData.objs.length; i++) { 
			if (SoleLaborData.objs[i].calculatorType == 'soleLabor') { 
				data = SoleLaborData.objs[i].taxRateDetails;
			}
		}
		//let data = SoleLaborData.objs[0].taxRateDetails;//拿到劳务报酬个人所得税率
		console.log('2222',data);
		this.props.form.validateFields((err, value) => {
			let pre_tax = pretreatNumber(value.pre_tax)||0;//税前工资
			let after_tax = pretreatNumber(value.after_tax)||0;//税后工资
			let company_pay = 0;//公司实际支出
			let tax = 0;//个人所得税
			//如果输入的是税前工资

			if (pre_tax) {
				//工资小于4000元
				if (pre_tax <= 4000) {
					if (pre_tax - 800 > 0) {
						tax = (pre_tax - 800) * data[0].rate - data[0].deduction
					} else { 
						tax = 0;
					}
					after_tax = pre_tax - tax;
					console.log(after_tax)
				} else {//工资大于等于4000
					let rate_current = {};
					for (let i = 0; i < data.length; i++) { 
						if (pre_tax > data[i].min) { 
							rate_current = data[i];
						}
					}
					tax = (pre_tax * 0.8) * rate_current.rate - rate_current.deduction;
					after_tax = pre_tax - tax;
				}

			} else if (after_tax) { 
				//先计算几个税后收入的范围，通过区间来匹配税率等
				let C = [], rate_current = {};
				for (let i = 0; i < data.length; i++) { 
					C[i] = data[i].min - data[1].min * (1 - 0.2) * data[i].rate;
					C[i] = C[i] > 0 ? C[i] : 0;
					if (value.after_tax > C[i]) { 
						rate_current = data[i];
						console.log('121',rate_current);
					}
				}
				console.log('124',C, rate_current);
				if (rate_current) {
					console.log('124', rate_current);
					pre_tax = (after_tax - rate_current.deduction) / (1 - 0.8 * rate_current.rate);
					tax = pre_tax - after_tax;
				} else { 
					pre_tax = (after_tax - 800 * data[0].rate) / (1 - data[0].rate);
					tax = pre_tax - after_tax;
				}
			}

			company_pay = parseFloat(pre_tax);
			//把数据渲染到页面上
			this.props.form.setFields({
				pre_tax:     { value: formatMoney(pre_tax) },
				after_tax:   { value: formatMoney(after_tax) },
				company_pay: { value: formatMoney(company_pay) },
				tax:         { value: formatMoney(tax)}	
			})
		});
	}
	//当一个输入框开始输入时，清除其他框的内容
	onChange(e) { 
		let id = e.target.id;
		let value = e.target.value;
		let data_putin = {
			pre_tax:     { value: '' },
			after_tax:   { value: '' },
			// company_pay: { value: '' },
			// tax:         { value: '' },
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
								})(
									<Input onChange={(e) => this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='到手净得'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('after_tax', {
								})(
									<Input onChange={(e) => this.onChange(e)}/>
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