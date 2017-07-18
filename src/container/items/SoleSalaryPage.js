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
	Radio,
} from 'antd';
import {connect} from 'react-redux';
import {isEmptyObject} from '../../util/CommonUtil';
import { getData, getInsurData,getBaseData } from '../../actions/SoleSalary';
import { formatDate, formatMoney, configDirectory, configDirectoryObject } from '../../utils/formatData';


const { Item } = Form;
const { Option } = Select;
const RadioGroup = Radio.Group;
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
class SoleSalaryPage extends Component { 
	componentWillMount() {
		const {dispatch} = this.props;
		dispatch(getData());
		dispatch(getInsurData());
		dispatch(getBaseData());
	}

	handleChange(value) { 
		console.log(value);
	}
//通过应税收入获取当前税率表
	getRateByTaxable_income(value,data) { 
		if (value > data[6].min) {
			return data[6];
		} else if (value > data[5].min) {
			return data[5];
		} else if (value > data[4].min) {
			return data[4];
		} else if (value > data[3].min) {
			return data[3];
		} else if (value > data[2].min) {
			return data[2];
		} else if (value > data[1].min) {
			return data[1];
		} else if (value > data[0].min) {
			return data[0];
		} 
	}
	//通过目标基数获取缴费基数
	getBasebound(value,data) { 
		if (value > data.socialSecurity.baseMax) {
			return data.socialSecurity.baseMax;
		} else if (value < data.socialSecurity.baseMin) {
			return data.socialSecurity.baseMin;
		} else { 
			return value;
		}
	}
	//计算社保公积金缴费总比例
	getInsurRate(data) { 
		let rate_sum = 0;
		console.log(data);
		data.map(value => { 
			rate_sum += value.rate;
		})
		return rate_sum;
	}
	//外籍根据税后收入获取税率
	getRateByAfter_tax(value,data) { 
		//计算各个阈值
		let C = [],rate_current;
		for (let i = 0; i < data.length; i++) { 
			C[i] = data[i].min * (data[i].min - 4800) * data[i].rate + data[i].deduction;
			if (value > C[i]) { 
				rate_current = data[i];
			}
		}
		return rate_current;
	}

	onSubmit(e) { 
		e.preventDefault();
		// console.log(e)
		const { SoleSalaryData,SoleSalaryInsurData,SoleSalaryBaseData } = this.props;
		console.log('aaa', SoleSalaryData, SoleSalaryInsurData, SoleSalaryBaseData);
		let rateData = {};
		for (let i = 0; i < SoleSalaryData.objs.length; i++) { 
			if (SoleSalaryData.objs[i].calculatorType == 'soleSalary') { 
				rateData = SoleSalaryData.objs[i].taxRateDetails;
			}
		}
		let insurData = {};
		for (let i = 0; i < SoleSalaryInsurData.objs.length; i++) { 
			if (SoleSalaryInsurData.objs[i].payorType == 'individual') {
				insurData.individual = SoleSalaryInsurData.objs[i];
			} else if (SoleSalaryInsurData.objs[i].payorType == 'company') { 
				insurData.company = SoleSalaryInsurData.objs[i];
			}
		}

		let baseData = {};
		for (let i = 0; i < SoleSalaryBaseData.objs.length; i++) { 
			if (SoleSalaryBaseData.objs[i].status == 1
				&& SoleSalaryBaseData.objs[i].baseType=="socialSecurity") {
				baseData.socialSecurity = SoleSalaryBaseData.objs[i];
			} else if (SoleSalaryBaseData.objs[i].status == 1
				&& SoleSalaryBaseData.objs[i].baseType=="housingFund") { 
				baseData.company = SoleSalaryBaseData.objs[i];
			}
		}
		//let rateData = SoleSalaryData.objs[0].taxRateDetails;//拿到劳务报酬个人所得税率
		console.log('2222',rateData, insurData, baseData);
		this.props.form.validateFields((err, value) => {
			let last_pre_tax = 0;//上一年的税前工资//这里留个接口
			let pre_tax = parseFloat(value.pre_tax);//税前工资
			let after_tax = parseFloat(value.after_tax);//税后工资
			let company_pay = parseFloat(value.company_pay);//公司实际支出
			let city = value.city;//城市
			let isZH = value.isZH;//国籍，是否是大陆
			let isOld = value.isOld;//是否是老员工
			let retirementInsurance = 0;//社会保险
			let housingFund = 0;//公积金
			let personInsurance = 0;//个人缴纳社保公积金总额
			let companyInsurance = 0;//公司缴纳社保公积金总额
			let tax = 0;//个人所得税
			let taxable_income = 0;//应税所得


			if(isZH){
				switch (isZH) {
					//外籍
					case 'notZH': {
						//如果输入的是税前工资
						if (pre_tax) {
							taxable_income = pre_tax - 4800;//数字表国内免征额
							let rate_current = this.getRateByTaxable_income(taxable_income, rateData);
							console.log(rate_current);
							tax = taxable_income * rate_current.rate - rate_current.deduction;
							after_tax = pre_tax - tax;
							company_pay = pre_tax;
							//输入的是税后工资
						} else if (after_tax) {
							let rate_current = this.getRateByAfter_tax(after_tax, insurData);
							console.log(rate_current);
							pre_tax = (after_tax + 4800 * rate_current.rate - rate_current.deduction) / (1 - rate_current.rate);
							
							//输入的是公司总支出
						} else if (company_pay) { 
							pre_tax = company_pay;
							taxable_income = pre_tax - 4800;//数字表国内免征额
							let rate_current = this.getRateByTaxable_income(taxable_income, rateData);
							console.log(rate_current);
							tax = taxable_income * rate_current.rate - rate_current.deduction;
							after_tax = pre_tax - tax;
						}	
						break;
					};
					//中国	
					case 'ZH': {
						//如果输入的是税前工资
						if (pre_tax) {
							let sightcing = (isOld == 'Old' ? last_pre_tax : pre_tax);//基数目标数
							let baseBound = this.getBasebound(sightcing, baseData);
							// console.log(baseBound);
							let baseRate_individual = this.getInsurRate(insurData.individual.insuranceRateDetails);
							let baseRate_company = this.getInsurRate(insurData.company.insuranceRateDetails);
							console.log(baseRate_individual, baseRate_company);
							personInsurance = baseBound * baseRate_individual;
							companyInsurance = baseBound * baseRate_company;
							taxable_income = pre_tax - personInsurance - 3500;//数字表国内免征额
							let rate_current = this.getRateByTaxable_income(taxable_income, rateData);
							tax = taxable_income * rate_current.rate - rate_current.deduction;
							after_tax = pre_tax - tax - personInsurance;
							company_pay = companyInsurance + pre_tax;

							retirementInsurance = baseBound;
							housingFund = baseBound;
							//输入的是税后收入
						} else if (after_tax) { 


							//输入的是公司总支出
						} else if (company_pay) { 

						}
						break;
					};
					default:
						break;
				}
			}

			//把数据渲染到页面上
			this.props.form.setFields({
				pre_tax:     				{ value: formatMoney(pre_tax) },
				after_tax:   				{ value: formatMoney(after_tax) },
				company_pay:    		{ value: formatMoney(company_pay)},
				city:     					{ value: city },
				isZH:      					{ value: isZH },
				isOld:         			{ value: isOld},
				retirementInsurance:{ value: formatMoney(retirementInsurance) },
				housingFund:      	{ value: formatMoney(housingFund) },
				personInsurance:    { value: formatMoney(personInsurance)},
				companyInsurance:   { value: formatMoney(companyInsurance)},
				tax:                { value: formatMoney(tax)},
			})
		});
	}
	//当一个输入框开始输入时，清除其他框的内容
	onChange(e) { 
		let id = e.target.id;
		let value = e.target.value;
		let data_putin = {
			pre_tax:     				{ value: '' },
			after_tax:     			{ value: '' },
			company_pay:     		{ value: '' },
			city:     					{ value: '' },
			isZH:     					{ value: '' },
			isOld:     					{ value: '' },
			retirementInsurance:{ value: '' },
			housingFund:        { value: '' },
			personInsurance:    { value: '' },
			companyInsurance:   { value: '' },
			tax:                { value: '' },
		}
		this.props.form.setFields(
			Object.assign({},data_putin, {
				id: {value:value}
			})
		)
	}
	render() { 
		const { getFieldDecorator } = this.props.form;
		// console.log('this.props',this.props.SoleSalaryData);
		// console.log('this.props',this.props.SoleSalaryInsurData);
		const { SoleSalaryData,SoleSalaryInsurData} = this.props;
		if (isEmptyObject(SoleSalaryData)) {
			return (<div>
				数据请求错误！
			</div>)
		} else { 
			return (
				<Form
					layout='inline'
					style={{ padding: '24px 16px', border: '1px solid #fff', height: '600px', width: '800px', marginTop: '16px' }}
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
							<Item
								{...formItemLayout}
								label='公司实际支出'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('company_pay', {
									rules: [{
										type:'number',message:'请输入有效数字！'
									}]
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='选择城市'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('city', {
									rules: [{
										type: 'string',
									}],
								})(
									<Select onChange={value => this.handleChange(value)}>
										<Option value="ShangHai">上海</Option>
									</Select>
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
						<Col lg={{ span: 12 }}>
							<Item
								{...formItemLayout_text}
								label='  '
								colon={false}
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('isZH', {
								})(
								<RadioGroup>
									<Radio value={'ZH'}>国内</Radio>
									<Radio value={'notZH'}>外籍</Radio>
								</RadioGroup>
								)}
							</Item>
							<Item
								{...formItemLayout_text}
								label='  '
								colon={false}
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('isOld', {
								})(
								<RadioGroup>
									<Radio value={'notOld'}>新员工</Radio>
									<Radio value={'Old'}>老员工</Radio>
								</RadioGroup>
								)}
							</Item>
						</Col>
					</Row>
					<Row>
						<Col lg={{ span: 12 }}>
							<Item
								{...formItemLayout_text}
								label='社保基数'
								colon={false}
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('retirementInsurance', {
								})(
									<Input/>
								)}
							</Item>
						</Col>
						<Col lg={{ span: 12 }}>
							<Item
								{...formItemLayout_text}
								label='公积金基数'
								colon={false}
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('housingFund', {
								})(
									<Input/>
								)}
							</Item>
						</Col>
					</Row>
					<Row style={{marginTop:"24px"}}>
						<Col lg={{ span: 12 }}>
							<Item
								{...formItemLayout_text}
								label='个人社保公积金'
								colon={false}
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('personInsurance', {
								})(
									<Input disabled/>
								)}
							</Item>
							<Item
								{...formItemLayout_text}
								label='公司社保公积金'
								colon={false}
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('companyInsurance', {
								})(
									<Input disabled/>
								)}
							</Item>
							<Item
								{...formItemLayout_text}
								label='个人所得税'
								colon={false}
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
	// console.log(state);
	const { SoleSalary, SoleSalaryInsur, SoleSalaryBase } = state;
		return {
			SoleSalaryData: SoleSalary.SoleSalaryData,
			SoleSalaryInsurData: SoleSalary.SoleSalaryInsurData,
			SoleSalaryBaseData: SoleSalary.SoleSalaryBaseData,
		}
}
const FormSoleSalaryPage=Form.create()(SoleSalaryPage);
export default connect(mapStateToProps)(FormSoleSalaryPage)