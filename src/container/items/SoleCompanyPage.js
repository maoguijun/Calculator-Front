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
import {isEmptyObject} from '../../util/CommonUtil';
import { getData } from '../../actions/SoleCompany';
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
const formItemLayout_text = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 },
	},
}
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
class SoleCompanyPage extends Component { 
	componentWillMount() {
		const {dispatch} = this.props;
		dispatch(getData());
	}
//通过应税收入获取当前税率表
	getRateByTaxable_income_year(deduction,data) { 
		if (deduction > data[4].min) {
			return data[4];
		} else if (deduction > data[3].min) {
			return data[3];
		} else if (deduction > data[2].min) {
			return data[2];
		} else if (deduction > data[1].min) {
			return data[1];
		} else if (deduction > data[0].min) {
			return data[0];
		}
	}
	//通过年税后收入获取当前税率表
	getRateByAfter_tax_year(after_tax_year, data) { 
		let C = [];
		for (let i = 0; i < data.length; i++) { 
			C[i] = data[i].max - data[i].max * data[i].rate + data[i].deduction;
		}
		console.log(C);
		if (after_tax_year > C[4]) {
			return data[4];
		} else if (after_tax_year > C[3]) { 
			return data[3]
		} else if (after_tax_year > C[2]) { 
			return data[2]
		} else if (after_tax_year > C[1]) { 
			return data[1]
		} else if (after_tax_year > C[0]) { 
			return data[0]
		} else if (after_tax_year < C[0]) { 
			return data[0]
		}
	}

	onSubmit(e) { 
		e.preventDefault();
		// console.log(e)
		const { SoleCompanyData } = this.props;
		console.log('aaa', SoleCompanyData);
		let data = {};
		for (let i = 0; i < SoleCompanyData.objs.length; i++) { 
			if (SoleCompanyData.objs[i].calculatorType == 'soleCompany') { 
				data = SoleCompanyData.objs[i].taxRateDetails;
			}
		}
		//let data = SoleCompanyData.objs[0].taxRateDetails;//拿到劳务报酬个人所得税率
		console.log('2222',data);
		this.props.form.validateFields((err, value) => {
			let pre_tax_month = parseFloat(value.pre_tax_month);//月开票总金额
			let after_tax_month = parseFloat(value.after_tax_month);//月到手净得
			let after_tax_year = parseFloat(value.after_tax_year);//年到手净得
			let tax_month_add;//月增值税
			let tax_year_add;//年增值税
			let surtax_month;//月附加税
			let surtax_year;//年附加税
			let taxable_income_month;//月应税所得
			let taxable_income_year;//年应税所得
			let tax_year;//年个人所得税
			let tax_month;//月个人所得税

			//如果输入的是月开票总金额
			if (pre_tax_month) {
				tax_month_add = pre_tax_month * 0.03 / (1 + 0.03);//数字表增值税率
				surtax_month = tax_month_add * 0.12;//数字表附加税率
				let taxable_income_month = (pre_tax_month - tax_month_add - surtax_month) * 0.1;//数字表利润率
				let taxable_income_year = taxable_income_month * 12;
				let rate_current = this.getRateByTaxable_income_year(taxable_income_year, data);
				tax_year = taxable_income_year * rate_current.rate - rate_current.deduction;
				tax_month = tax_year / 12;
				tax_year_add = tax_month_add * 12;
				surtax_year = surtax_month * 12;
				after_tax_year = taxable_income_year - tax_year;
				after_tax_month = after_tax_year / 12;
			} else if (after_tax_month) { //如果输入的是月到手净得
				after_tax_year = after_tax_month * 12;
				let rate_current = this.getRateByAfter_tax_year(after_tax_year, data);
				console.log('rate_current', rate_current);
				//计算应税所得
				taxable_income_year = (after_tax_year - rate_current.deduction) / (1 - rate_current.rate);
				tax_year = taxable_income_year - after_tax_year;
				tax_month = tax_year / 12;
				taxable_income_month = taxable_income_year / 12;
				pre_tax_month = (1 + 0.03) * taxable_income_month*10 / (1 - 0.03 * 0.1);
				tax_month_add = pre_tax_month * 0.03 / (1 + 0.03);//数字表增值税率
				surtax_month = tax_month_add * 0.12;//数字表附加税率
				tax_year_add = tax_month_add * 12;
				surtax_year = surtax_month * 12;
			} else if (after_tax_year) { //如果输入的是年到手净得
				after_tax_month = after_tax_year / 12;
				let rate_current = this.getRateByAfter_tax_year(after_tax_year, data);
				console.log('rate_current', rate_current);
				//计算应税所得
				taxable_income_year = (after_tax_year - rate_current.deduction) / (1 - rate_current.rate);
				tax_year = taxable_income_year - after_tax_year;
				tax_month = tax_year / 12;
				taxable_income_month = taxable_income_year / 12;
				pre_tax_month = (1 + 0.03) * taxable_income_month*10 / (1 - 0.03 * 0.1);
				tax_month_add = pre_tax_month * 0.03 / (1 + 0.03);//数字表增值税率
				surtax_month = tax_month_add * 0.12;//数字表附加税率
				tax_year_add = tax_month_add * 12;
				surtax_year = surtax_month * 12;
			}

		

			//把数据渲染到页面上
			this.props.form.setFields({
			pre_tax_month:     { value: formatMoney(pre_tax_month) },
			after_tax_month:   { value: formatMoney(after_tax_month) },
			after_tax_year:    { value: formatMoney(after_tax_year)},
			tax_month_add:     { value: formatMoney(tax_month_add) },
			surtax_month:      { value: formatMoney(surtax_month) },
			tax_month:         { value: formatMoney(tax_month)},
			tax_year_add:      { value: formatMoney(tax_year_add) },
			surtax_year:       { value: formatMoney(surtax_year) },
			tax_year:          { value: formatMoney(tax_year)},
			})
		});
	}
	//当一个输入框开始输入时，清除其他框的内容
	onChange(e) { 
		let id = e.target.id;
		let value = e.target.value;
		let data_putin = {
			pre_tax_month:     { value: '' },
			after_tax_month:   { value: '' },
			after_tax_year:    { value: '' },
			tax_month_add:     { value: '' },
			surtax_month:      { value: '' },
			tax_month:         { value: '' },
			tax_year_add:      { value: '' },
			surtax_year:       { value: '' },
			tax_year:          { value: '' },
			
		}
		this.props.form.setFields(
			Object.assign({},data_putin, {
				id: {value:value}
			})
		)
	}

	render() { 
		const { getFieldDecorator } = this.props.form;
		const { SoleCompanyData } = this.props;
		if (isEmptyObject(SoleCompanyData)) {
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
								label='月开票总金额'
								style={{ width: '80%', margin: '8px 0' }}>
								
								{getFieldDecorator('pre_tax_month', {
									rules: [{
										type:'number',message:'请输入有效数字！'
									}]
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='月到手净得'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('after_tax_month', {
									rules: [{
										type:'number',message:'请输入有效数字！'
									}]
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='年到手净得'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('after_tax_year', {
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
					<Row style={{marginTop:'24px'}}>
						<Col lg={{ span: 12 }}>
							<Item
								{...formItemLayout_text}
								label='月增值税'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('tax_month_add', {
								})(
									<Input disabled/>
								)}
							</Item>

							<Item
								{...formItemLayout_text}
								label='月附加税'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('surtax_month', {
								})(
									<Input disabled/>
								)}
							</Item>
							
							<Item
								{...formItemLayout_text}
								label='月个人所得税'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('tax_month', {
								})(
									<Input disabled/>
								)}
							</Item>
						</Col>
						<Col lg={{ span: 12 }}>
							<Item
								{...formItemLayout_text}
								label='年增值税'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('tax_year_add', {
								})(
									<Input disabled/>
								)}
							</Item>

							<Item
								{...formItemLayout_text}
								label='年附加税'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('surtax_year', {
								})(
									<Input disabled/>
								)}
							</Item>

							<Item
								{...formItemLayout_text}
								label='年个人所得税'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('tax_year', {
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
    const {SoleCompany, } = state;
		return {
			SoleCompanyData: SoleCompany.SoleCompanyData,
			SoleCompanyInsurData: SoleCompany.SoleCompanyInsurData,
		}
}
const FormSoleCompanyPage=Form.create()(SoleCompanyPage);
export default connect(mapStateToProps)(FormSoleCompanyPage)