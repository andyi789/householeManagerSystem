/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-09 09:01:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-13 17:18:12
 * @FilePath: \ej-template\src\http\axios.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import store from '@/store'
// import { getToken } from '@src/utils/auth'

axios.defaults.baseURL = 'http://47.103.86.58:8002'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    // 请求拦截器
axios.interceptors.request.use((config) => {
        // 在发送请求之前做些什么
        // console.log(config)
        const token = store.state.user.token;
        if (token) {
            // console.log('为请求头添加token', token);
            config.headers.Authorization = `${token}` //如果有token 就在请求头上添加token
        }
        //判断请求方式
        if (config.method == 'post') {
            config.data = qs.stringify(config.data, { arrayFormat: 'repeat' });
        }
        return config;
    })
    // 响应拦截器
axios.interceptors.response.use((response) => {
    if (response.data.status === 200) {
        // Message({
        // 	message: response.data.message,
        // 	type:"success"
        // })
        return response.data;
    } else {
        Message({
            message: response.data.message,
            type: "error"
        })
        return response.data;
    }
})

export default axios;