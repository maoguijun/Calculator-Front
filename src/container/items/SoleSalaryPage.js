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
import pretreatNumber from '../../utils/pretreat';

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
		let rate_current = {};
		for (let i = 0; i < data.length; i++) { 
			if (value > data[i].min) { 
				rate_current = data[i];
			}
		}
		return rate_current;
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
	getRateByAfter_tax(value, data,free) { 
		//计算各个阈值
		let C = [], rate_current = {};
		for (let i = 0; i < data.length; i++) { 
			C[i] = data[i].min + free - data[i].min * data[i].rate + data[i].deduction;
			if (value>C[i]) { 
				rate_current = data[i];
				console.log("ddd",rate_current);
			}
		}
		return rate_current;
	}
	//国内根据税后收入获取缴费基数
	getBaseboundByAfter_tax(value,data,getfter_taxByPre_tax,last_pre_tax = 0) { 
		//计算阈值
		let C = {};
		console.log('125', data);
		C.baseMax = getfter_taxByPre_tax(data.baseMax);
		C.baseMin = getfter_taxByPre_tax(data.baseMin);
		console.log("118", C);
		if (!last_pre_tax) {
			if (value > C.baseMax) {
				return data.baseMax;
			} else if (value < C.baseMin) {
				return data.baseMin;
			} else {
				return;
			}
			//判定是否是老员工
		} else { 
			if (last_pre_tax > data.baseMax) {
				return data.baseMax;
			} else if (last_pre_tax < data.baseMin) {
				return data.baseMin;
			} else {
				return;
			}
		}
	}
	//国内根据税后收入获取税率
	getRateByAfter_tax_ZH(value,data) { 
		//计算阈值
		let C = [], rate_current;
		console.log("130",value);
		for (let i = 0; i < data.length; i++) { 
			C[i] = data[i].min + 3500 - (data[i].min) * data[i].rate + data[i].deduction;
			if (value > C[i]) {
				rate_current = data[i];
				console.log("ddd", rate_current);
			} 
		}
		console.log(C);
		return rate_current || {rate: 0 , deduction: 0};

	}
	//国内根据公司实际支付获取缴费基数
	getBaseboundByCompany_pay(value , data , baseRate_company , last_pre_tax = 0 ) { 
		//计算阈值
		let C = [];
		C.Min = data.baseMin + data.baseMin * baseRate_company;
		C.Max = data.baseMax + data.baseMax * baseRate_company;
		console.log(value, C);
		if (!last_pre_tax) {
			if (value > C.Max) {
				return data.baseMax;
			} else if (value < C.Min) {
				return data.baseMin;
			} else {
				return;
			}
		} else { 
			if (last_pre_tax > data.baseMax) {
				return data.baseMax;
			} else if (last_pre_tax < data.baseMin) {
				return data.baseMin;
			} else {
				return;
			}
		}
	}

	onSubmit(e) { 
		e.preventDefault();
		// console.log(e)
		this.props.form.validateFields((err, values) => {
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
				let last_pre_tax = 12345;//上一年的税前工资//这里留个接口
				let pre_tax = pretreatNumber(value.pre_tax)||0;//税前工资
				let after_tax = pretreatNumber(value.after_tax)||0;//税后工资
				let company_pay = pretreatNumber(value.company_pay)||0;//公司实际支出
				let city = value.city;//城市
				let isZH = value.isZH;//国籍，是否是大陆
				let isOld = value.isOld;//是否是老员工
				let retirementInsurance = 0;//社会保险
				let housingFund = 0;//公积金
				let personInsurance = 0;//个人缴纳社保公积金总额
				let companyInsurance = 0;//公司缴纳社保公积金总额
				let tax = 0;//个人所得税
				let taxable_income = 0;//应税所得
				let free_quota_notZH = 4800;//外籍免征额
				let free_quota_ZH = 3500;//国内免征额


				if(isZH){
					switch (isZH) {
						//外籍
						case 'notZH': {
							//如果输入的是税前工资
							if (pre_tax) {
								taxable_income = pre_tax - free_quota_notZH;
								if (taxable_income > 0) {
									let rate_current = this.getRateByTaxable_income(taxable_income, rateData) || { rate: 0, deduction: 0 };
									console.log(rate_current);
									tax = taxable_income * rate_current.rate - rate_current.deduction;
								} else { 
									tax = 0;
								}
								after_tax = pre_tax - tax;
								company_pay = pre_tax;

								//输入的是税后工资
							} else if (after_tax) {
								if (after_tax>free_quota_notZH) {
									let rate_current = this.getRateByAfter_tax(after_tax, rateData,free_quota_notZH);
									console.log(rate_current);
									pre_tax = (after_tax - free_quota_notZH * rate_current.rate - rate_current.deduction) / (1 - rate_current.rate);
									tax = taxable_income * rate_current.rate - rate_current.deduction;
								} else { 
									pre_tax = after_tax;
									tax = 0;
								}
									company_pay = pre_tax;

								//输入的是公司总支出
							} else if (company_pay) { 
								pre_tax = company_pay;
								taxable_income = pre_tax - free_quota_notZH;
								if (taxable_income > 0) {
									let rate_current = this.getRateByTaxable_income(taxable_income, rateData) || { rate: 0, deduction: 0 };
									console.log(rate_current);
									tax = taxable_income * rate_current.rate - rate_current.deduction;
								} else { 
									tax = 0;
								}
								after_tax = pre_tax - tax;
								company_pay = pre_tax;
							}	
							break;
						};
						//中国	
						case 'ZH': {
							let baseRate_individual = this.getInsurRate(insurData.individual.insuranceRateDetails);
							let baseRate_company = this.getInsurRate(insurData.company.insuranceRateDetails);
							console.log(baseRate_individual, baseRate_company);

							const getAfter_taxByPre_tax = (pre_tax) => {
								let sightcing = (isOld == 'Old' ? last_pre_tax : pre_tax);//基数目标数
								let baseBound = this.getBasebound(sightcing, baseData);
								// console.log(baseBound);
								personInsurance = baseBound * baseRate_individual;
								companyInsurance = baseBound * baseRate_company;
								taxable_income = pre_tax - personInsurance - free_quota_ZH;
								console.log("269",taxable_income);
								if (taxable_income > 0) {
									let rate_current = this.getRateByTaxable_income(taxable_income, rateData);
									console.log('245', rate_current)
									tax = taxable_income * rate_current.rate - rate_current.deduction;
								} else { 
									tax = 0;
								}
								after_tax = pre_tax - tax - personInsurance;
								company_pay = companyInsurance + pre_tax;

								retirementInsurance = baseBound;
								housingFund = baseBound;
								return after_tax;
							}

							//如果输入的是税前工资
							if (pre_tax) {
								getAfter_taxByPre_tax(pre_tax);

								//输入的是税后收入
							} else if (after_tax) { 
								if (isOld == "New") {
									console.log('qian', after_tax);
									let after_tax_copy = after_tax;
									let baseBound = this.getBaseboundByAfter_tax(after_tax, baseData.socialSecurity, getAfter_taxByPre_tax);//这个函数目前会影响到after_tax;
									console.log("hou",after_tax_copy);
									let rate_current = this.getRateByAfter_tax_ZH(after_tax_copy, rateData);
									console.log('1111',baseBound,)
									console.log("fff",rate_current);
									if (baseBound) {	
										personInsurance = baseBound * baseRate_individual;
										companyInsurance = baseBound * baseRate_company;
										console.log('271', after_tax_copy, personInsurance, companyInsurance)
										pre_tax = (after_tax_copy + personInsurance * (1-rate_current.rate) - free_quota_ZH * rate_current.rate - rate_current.deduction) / (1 - rate_current.rate);
										console.log('pre_tax', pre_tax);
										getAfter_taxByPre_tax(pre_tax);
									} else { 
										pre_tax = (after_tax_copy - free_quota_ZH * rate_current.rate - rate_current.deduction) / (1 - rate_current.rate + baseRate_individual * rate_current.rate - baseRate_individual);
										console.log('291', pre_tax);
										getAfter_taxByPre_tax(pre_tax);
									}

								} else if (isOld == "Old") { 
									console.log('qian', after_tax);
									let after_tax_copy = after_tax;
									let baseBound = this.getBaseboundByAfter_tax(after_tax, baseData.socialSecurity, getAfter_taxByPre_tax,last_pre_tax);//这个函数目前会影响到after_tax;
									console.log("hou",after_tax_copy);//之后用到after_tax统统用after_tax_copy代替
									let rate_current = this.getRateByAfter_tax_ZH(after_tax_copy, rateData);
									console.log('1111',baseBound,)
									console.log("fff",rate_current);
									if (baseBound) {
										personInsurance = baseBound * baseRate_individual;
										companyInsurance = baseBound * baseRate_company;
										console.log('325', after_tax_copy, personInsurance, companyInsurance,rate_current)
										pre_tax = (after_tax_copy + personInsurance * (1 - rate_current.rate) - free_quota_ZH * rate_current.rate - rate_current.deduction) / (1 - rate_current.rate);
										console.log('pre_tax', pre_tax);
										getAfter_taxByPre_tax(pre_tax);
									} else { 
										console.log(last_pre_tax,baseRate_individual,rate_current,after_tax)
										pre_tax = last_pre_tax * baseRate_individual + (after_tax_copy - free_quota_ZH * rate_current.rate - rate_current.deduction) / (1 - rate_current.rate);
										console.log('291', pre_tax);
										getAfter_taxByPre_tax(pre_tax);
									}

								}
								//输入的是公司总支出
							} else if (company_pay) { 
								let baseBound = this.getBaseboundByCompany_pay(company_pay, baseData.company, baseRate_company, last_pre_tax);
								console.log(baseBound);
								if (isOld == "New") {
									if (baseBound) {
										companyInsurance = baseBound * baseRate_company;
										pre_tax = company_pay - companyInsurance;
									} else {
										pre_tax = company_pay / (1 + baseRate_company);
									}
									getAfter_taxByPre_tax(pre_tax);
								} else if (isOld == "Old") { 
									if (baseBound) {
										companyInsurance = baseBound * baseRate_company;
										pre_tax = company_pay - companyInsurance;
									} else {
										pre_tax = company_pay - last_pre_tax * baseRate_company;
									}
									getAfter_taxByPre_tax(pre_tax);
								}
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
			// city:     					{ value: '' },
			// isZH:     					{ value: '' },
			// isOld:     					{ value: '' },
			// retirementInsurance:{ value: '' },
			// housingFund:        { value: '' },
			// personInsurance:    { value: '' },
			// companyInsurance:   { value: '' },
			// tax:                { value: '' },
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
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='到手净得'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('after_tax', {
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='公司实际支出'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('company_pay', {
								})(
									<Input onChange={(e)=>this.onChange(e)}/>
								)}
							</Item>
							<Item
								{...formItemLayout}
								label='选择城市'
								style={{ width: '80%', margin: '8px 0'}}>

								{getFieldDecorator('city', {
									initialValue:"ShangHai",
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
									initialValue:"ZH",
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
									initialValue:"New",
								})(
								<RadioGroup>
									<Radio value={'New'}>新员工</Radio>
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
									<Input disabled/>
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
									<Input disabled/>
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
	const { SoleSalary} = state;
		return {
			SoleSalaryData: SoleSalary.SoleSalaryData,
			SoleSalaryInsurData: SoleSalary.SoleSalaryInsurData,
			SoleSalaryBaseData: SoleSalary.SoleSalaryBaseData,
		}
}
const FormSoleSalaryPage=Form.create()(SoleSalaryPage);
export default connect(mapStateToProps)(FormSoleSalaryPage)