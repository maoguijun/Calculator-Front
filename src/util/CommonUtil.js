import moment from 'moment';
/**
 * 判断一个对象为空对象
 * @param e
 * @returns {boolean}
 */
export function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}

/**
 * 获取当前日期
 * @param rules 日期格式
 */
export function getCurrentDate(rules) {
    let date = new Date();
    return moment(date).format(rules)
}

export function isArray(v) {
    return toString.apply(v) === '[object Array]';
}
//深浅嵌套合并
export function merge(obj1, obj2, obj) {
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
        for (let key1 of Object.keys(obj1)) {
            for (let key2 of Object.keys(obj2)) {
                if (key1 !== key2) {
                    obj[key1] = obj1[key1];
                    obj[key2] = obj2[key2];
                } else {
                    obj[key1] = obj2[key2];
                    merge(obj1[key1], obj2[key2], obj[key1])
                }
            }
        }
    }
}

//冒泡排序
export function sort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j <= arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr
}
export function sortByComplited(arr) {
    let result = [];
    result = arr.sort((a1, a2) => {
            const w1 = a1.substring(0, 1);
            const w2 = a2.substring(0, 1);
            if (w1 > w2) {
                return -1;
            }
            else if (w1 < w2) {
                return 1;
            }

            const n1 = a1.substring(1, a1.length);
            const n2 = a2.substring(1, a2.length);

            if (parseInt(n1) > parseInt(n2)) {
                return 1;
            }
            else {
                return -1;
            }
        }
    );
    return result;

}

//判断访问终端
export const browser = {
    versions: function () {
        var u = navigator.userAgent || "", app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) === " qq" //是否QQ
        };
    }(),
    language: ((navigator.browserLanguage || navigator.language) || '').toLowerCase()
}


//千位数字分隔符
export const milliFormat = (input) => {
    return input && input.toString()
            .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
};


//从数组中随机获取几个元素
export function getRandomFromArray(array, x) {
    let randomArray = [];
    for (let i = x - 1; i >= 0; i--) {
        let index = Math.floor(Math.random() * array.length);
        randomArray.push(array[index]);
        array.splice(index, 1)
    }
    return randomArray;
}
// 获取一个随机数组
export function shuffer(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function formatLang(language = "") {
    return language;
    if (language.toLowerCase() === 'in-IN' || language.toLowerCase() === 'in') {
        language = 'ih'
    }
    else if (language.toLowerCase() === 'en-US' || language.toLowerCase() === 'en') {
        language = 'en'
    }
    else {
        language = 'all-lan'
    }
    return language;
}
/**
 * 删除数组中制定元素（不能是对象）
 * @param arr
 * @param val
 * @returns {*}
 */
export function delobjFromArray(arr, val) {
    var index = arr.indexOf(val);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

//删除数组中制定元素（是对象）
export function removeObjWithArr(_arr, _obj) {
    var equal = function (x, y) {
        if (x === y) {
            return true;
        }
        if (!( x instanceof Object ) || !( y instanceof Object )) {
            return false;
        }
        if (x.constructor !== y.constructor) {
            return false;
        }

        for (var p in x) {
            if (x.hasOwnProperty(p)) {
                if (!y.hasOwnProperty(p)) {
                    return false;
                }
                if (x[p] === y[p]) {
                    continue;
                }
                if (typeof( x[p] ) !== "object") {
                    return false;
                }
                if (!Object.equals(x[p], y[p])) {
                    return false;
                }
            }
        }

        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    };
    var length = _arr.length;
    for (var i = 0; i < length; i++) {
        if (equal(_arr[i], _obj)) {
            if (i === 0) {
                _arr.shift(); //删除并返回数组的第一个元素
                return;
            }
            else if (i === length - 1) {
                _arr.pop();  //删除并返回数组的最后一个元素
                return;
            }
            else {
                _arr.splice(i, 1); //删除下标为i的元素
                return;
            }
        }
    }

};

//不包含undefined的数组长度
export function arrLengthNoundefined(arr) {
    let length = 0;
    for (let i = 0; i < arr.length; i++) {
        if (undefined !== arr[i]) {
            length++;
        }
    }
    return length;
}

//第一个undifined的位置
export function firstUndifinedInArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === undefined) {
            return i;
        }
    }
}

//格式化服务器传来的："2017-03-23T08:00:00+08:00"
export function splitTDate(str) {
    return str.split('T')[0];
}


//求时间差
export function getDuration(starD, endD) {
    var mill = new Date(moment(endD)).getTime() - new Date(moment(starD)).getTime();

    var time = parseFloat(mill) / 1000;
    if (null != time && "" !== time) {
        if (time > 60 && time < 60 * 60) {
            time = parseInt(time / 60.0) + "m" + parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60) + "s";
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600.0) + "h" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + "m" +
                parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "s";
        } else {
            time = parseInt(time) + "s";
        }
    } else {
        time = "0 h 0 m0 s";
    }
    return time;
}


//判断数组为[]
export function isEmptyArr(value) {
    return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}


//不是空串的字符串,是http开头通过,如果是空串也通过
export function isStartHttp(photo) {
    if ('' !== photo) {
        if (photo.startsWith('http')) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

//返回将来三十天：'2017年04月14日今天'
export function prepareLefttime(lefttimeData) {
    for (let i = 0; i < 30; i++) {
        var day = new Date(new Date().getTime() + (i) * (24 * 60 * 60 * 1000));
        let date = moment(day).format("YYYY-MM-DD");
        if (i === 0) {
            date += '.Today';
        } else if (i === 1) {
            date += '.Tomorrow';
        } else {
            switch (day.getDay()) {
                case 1:
                    date += '.Mon';
                    break;
                case 2:
                    date += '.Tue';
                    break;
                case 3:
                    date += '.Wed';
                    break;
                case 4:
                    date += '.Thu';
                    break;
                case 5:
                    date += '.Fri';
                    break;
                case 6:
                    date += '.Sat';
                    break;
                default:
                    date += '.Sun';
                    break;
            }
        }
        lefttimeData.push(date);
    }
    return lefttimeData;
}
//'2017年04月14日今天'返回'2017-03-20'
export function getdatefromLeftdate(str) {
    return str.substring(0, 10).replace('Y', '-').replace('M', '-');//replace('年','-').replace('月','-').replace('日','-');
}

//返回时间点数组：8：00，8：30
export function prepareRighttime(lefttimeData) {
    for (let i = 0; i < 30; i++) {
        let time = (Math.floor(i / 2) + 8) + ':' + ((i % 2 === 0) ? '00' : '30');
        lefttimeData.push(time);
    }
    return lefttimeData;
}
//通过8：00，8：30,9:00...,返回1，2，3...
export function gettimeIndex(time) {
    let arr = time.split(':');
    let index = (arr[0] - 8) * 2 + (arr[1] === '00' ? 0 : 1);
    return index;
}

// 判断时间是否过期：eg:bookDt 2017-04-27T00:00:00+00:00  timearr:[' 09:30',' 10:00']
export function isExpired(bookDt, timearr) {
    let s = bookDt.substr(0, 10);
    s = s + 'T' + timearr[1].replace(' ','') + ':00+08:00'

    let nowMil = moment().valueOf();
    let orderMil = new Date(moment(s)).getTime();
    if(nowMil-orderMil>0){
        return true;//已过期
    }else {
        return false;
    }
}





