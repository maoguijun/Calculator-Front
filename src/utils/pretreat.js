const pretreatNumber = (value) => {
  if (value) {
    let reg = /[,，]/ig;
    console.log(value);
    let formatNum = value.replace(reg, "");
    console.log(formatNum);
    formatNum = parseFloat(formatNum) > 0 ? parseFloat(formatNum) : 0;
    return formatNum;
  } else { 
    console.log("请输入有效数字");
  }
};
export default pretreatNumber;
