import * as qs from 'querystring';
// import {HOST} from '../../config.js'
import 'isomorphic-fetch';

function checkNetStatus(response) {
    console.log('fetch_url:', response.url);
    console.log('fetch_response:', response);
    if (!response.ok) {
        //处理了网络错误提示，抛出去为了关闭loading
        // toastShort('net error');
        const error = new Error(response.statusText, -1);
        error.response = response;
        throw error;
    }
    return response.json();
}


function checkResultStatus(result) {
    console.log('fetch_result:', result);
    console.log('-------------------end-------------------');

    // if (result.status === 'success' || result.status === 'OK') {
        return result;
    // } else if (result.status === 'failed') {
    //     //这里已处理了异常，抛出去为了关闭loading
    //     if (result.code === 24) {
    //         //注销IM
    //         // if (WebIM.conn.isOpened()) {
    //         //     WebIM.conn.close('logout')
    //         // }
    //         //重新登陆
    //         // toastShort('Please login');
    //         // getNavigator().popToTop();
    //         // getNavigator().push({
    //         //     name: 'LoginPage'
    //         // });
    //         // clearUserInfo();
    //     } else {
    //         //我们服务器的错误提示
    //         // toastShort(result.msg);
    //     }
    //
    //     let error = new Error(result.msg, result.code);
    //     error.code = result.code;
    //     throw error;
    //
    // }

}


export function easyfetch(url, method, args = {}, contentType = 'form') {
    let mheaders = {
        Accept: 'application/x-www-form-urlencoded',
        // 'X-Avoscloud-Application-Id':'WLb5eq2AQWGNtM4qG0eK4DLV-gzGzoHsz',
        // 'X-Avoscloud-Application-Key':'Y3PhXdpHeGcOGDdYJ1el1wlr'
    };
    if (contentType === 'form') {
        mheaders = Object.assign(mheaders,{
            'Content-Type': 'application/x-www-form-urlencoded',
        })
    } else if (contentType === 'json') {
        mheaders = Object.assign(mheaders,{
            'Content-Type': 'application/json; charset=UTF-8',
        })
    }

    let furl = '';
    if (url.indexOf('http') === 0)
        furl = url;
    else
        furl = `http://127.0.0.1:5400/${url}`;

    console.log('--------------------' + url + '---------------------');
    console.log('fetch_body:', JSON.stringify(args));

    switch (method.toLowerCase()) {
        case 'post':
        case 'put':
        case 'delete':
            return fetch(furl, {
                    method: method,
                    headers: mheaders,
                    body: JSON.stringify(args),
                    cache: 'default',
                }
            ).then(checkNetStatus).then(checkResultStatus);
        case 'get':
            let argstr = "";
            if (args) {
                argstr = '?' + qs.stringify(args);
            }


            return fetch(`${furl}${argstr}`, {
                method: method,
                headers: mheaders
            }).then(checkNetStatus).then(checkResultStatus)
        default:
    }
}
