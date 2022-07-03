/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-09 09:01:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-12 17:09:37
 * @FilePath: \ej-template\src\store\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import category from './category/index'
import waiter from './waiter/index'
// 导入customer的index.js
import customer from './customer/index'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        settings,
        user,
        // customer模块
        customer,
        category,
        waiter,
    },
    getters
})

export default store