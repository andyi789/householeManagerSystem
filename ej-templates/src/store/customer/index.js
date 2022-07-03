/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-09 09:01:22
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-12 17:20:40
 * @FilePath: \ej-template\src\store\customer\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 在Vuex中 需要处理网路请求 我们就需要导入axios 
// @ 以根目录的方式定义相对路径 想到与src/
import axios from '@/http/axios'
import Axios from 'axios';
// import { getToken } from '@/utils/auth';
import { nanoid } from 'nanoid'
import {set } from 'nprogress';
// 配置Vuex结构
export default {
    // vuex中的store分成模块来管理 
    // 需要在index.js中引入每一个Vuex模块进行配置 
    // 为了解决不同模块命名冲突的问题  
    // 将不同模块的namespaced 全部开启 之后 
    // 在不同的页面中再使用getters，actions，mutations，state的时候 
    // 需要根据不同的模块名来获取
    namespaced: true,
    state: {
        userAll: [],
        customer: "",
        customers: [],
        pagingCustomers: [],
        total: null,
        page: {}
    },
    mutations: {
        SET_CUSTOMERS(state, customers) {
            state.customers = customers;
        },
        SET_TOTAL(state, total) {
            state.total = total;
        },
        SET_CUSTOMER(state, customer) {
            state.customer = customer;
        },
        SET_USERALL(state, userAll) {
            state.userAll = userAll;
        },
        SET_PAGE(state, page) {
            state.page = page;
        }
    },
    actions: {
        findAll(store) {
            axios.get("/baseUser/cascadeRoleFindAll").then(res => {
                // console.log("findAll数据返回", res.data[0].roles[0].id);
                store.commit("SET_USERALL", res.data);
                //过滤出顾客
                let data = res.data.filter(item => {
                        let flag = false;
                        item.roles.forEach(element => {
                            if (element.id === 6) {
                                flag = true;
                            }
                        });
                        return flag;
                    })
                    // console.log(res.data);
                store.commit("SET_CUSTOMERS", data);
                // console.log(res.data.length);
                store.commit("SET_TOTAL", data.length);
            }).catch(err => {
                console.log('findAll错误返回', err);
            })
        },

        //更新顾客列表
        queryCustomer(store, data) {
            // console.log('分页查询顾客', data.page);
            store.state.pagingCustomers = store.state.customers.slice(data.page * data.pageSize, (data.page + 1) * data.pageSize);
            store.commit("SET_PAGE", data)
        },
        // 添加或修改顾客
        saveCustomer(store, data) {
            // console.log('添加顾客信息', data);
            if (data.isAdd === true) {
                //先判断该用户是否存在
                let user = store.state.userAll.filter(item => data.user.username === item.username);
                if (user.length === 0) {
                    //不存在则添加
                    axios.post('/baseUser/saveOrUpdate', data.user).then(res => {
                        // console.log(res);
                        store.state.customers.push(data.user);
                        //刷新用户列表，拿到id
                        store.dispatch('findAll');
                    })
                } else if (user.length === 1) {
                    alert('该用户已存在，无法添加');
                    return;
                }
                //设置权限
                setTimeout(() => {
                    user = store.state.userAll.filter(item => data.user.username === item.username)
                        // console.log("user.length2=", user.length);
                    console.log('user=', user);
                    if (user.length === 1) {
                        const u = {
                            id: user[0].id,
                            roles: 6
                        };
                        //根据id设置权限
                        axios.post('/baseUser/setRoles', u).then(res => {
                            console.log("设为顾客", res);
                            store.dispatch('findAll');
                        })
                    }
                }, 300);

            } else if (data.isAdd === false) {
                // console.log('修改顾客信息');
                axios.post('/baseUser/saveOrUpdate', data.user).then(res => {
                    // console.log(res);
                    store.state.customers.forEach(item => {
                        if (data.user.username === item.username) {
                            item = data.user;
                        }
                    })
                })
            }
            // 分页刷新
            setTimeout(() => {
                console.log('分页刷新');
                store.dispatch('queryCustomer', store.state.page);
            }, 800);
        },

        //根据id删除顾客
        delCustomerById(store, id) {
            // store.state.customers = store.state.customers.filter(cus => cus.id !== id)
            axios.get("/baseUser/deleteById?id=" + id).then(res => {
                if (res.message === "删除成功") {
                    store.state.total -= 1;
                    store.state.customers = store.state.customers.filter(item => item.id !== id);
                }
            })
            setTimeout(() => {
                if (store.state.total > store.state.page.pageSize * store.state.page.page) {
                    store.dispatch('queryCustomer', store.state.page);
                } else {
                    store.dispatch('queryCustomer', { page: store.state.page.page - 1, pageSize: store.state.page.pageSize });
                }
            }, 200);
        },
        //根据id查找顾客
        findCustomerById({ commit }, id) {
            axios.get("/customer/findCustomerById?id=" + id).then(res => {
                commit("SET_CUSTOMER", res.data)
            })
        },
        //设置权限
        setRolesOnCustomer() {

        }
    }
}