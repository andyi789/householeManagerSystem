/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-09 09:01:22
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-12 17:23:12
 * @FilePath: \ej-template\src\store\Waiter\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 在Vuex中 需要处理网路请求 我们就需要导入axios 
// @ 以根目录的方式定义相对路径 想到与src/
import axios from '@/http/axios'
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
        Waiter: "",
        Waiters: [],
        pagingWaiters: [],
        total: null,
        page: {}
    },
    mutations: {
        SET_WaiterS(state, Waiters) {
            state.Waiters = Waiters;
        },
        SET_TOTAL(state, total) {
            state.total = total;
        },
        SET_Waiter(state, Waiter) {
            state.Waiter = Waiter;
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
                //过滤出员工
                let data = res.data.filter(item => {
                        let flag = false;
                        item.roles.forEach(element => {
                            if (element.id === 1) {
                                flag = true;
                            }
                        });
                        return flag;
                    })
                    // console.log(res.data);
                store.commit("SET_WaiterS", data);
                // console.log(res.data.length);
                store.commit("SET_TOTAL", data.length);
            }).catch(err => {
                console.log('findAll错误返回', err);
            })
        },

        //更新员工列表
        queryWaiter(store, data) {
            // console.log('分页查询员工', data.page);
            store.state.pagingWaiters = store.state.Waiters.slice(data.page * data.pageSize, (data.page + 1) * data.pageSize);
            store.commit("SET_PAGE", data)
        },
        // 添加或修改员工
        saveWaiter(store, data) {
            // console.log('添加员工信息', data);
            if (data.isAdd === true) {
                //先判断该用户是否存在
                let user = store.state.userAll.filter(item => data.user.username === item.username);
                if (user.length === 0) {
                    //不存在则添加
                    axios.post('/baseUser/saveOrUpdate', data.user).then(res => {
                        // console.log("添加员工", res);
                        store.state.Waiters.push(data.user);
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
                            roles: 1
                        };
                        //根据id设置权限
                        axios.post('/baseUser/setRoles', u).then(res => {
                            // console.log("设为员工", res);
                            store.dispatch('findAll');
                        })
                    }
                }, 400);

            } else if (data.isAdd === false) {
                // console.log('修改员工信息');
                axios.post('/baseUser/saveOrUpdate', data.user).then(res => {
                    // console.log(res);
                    store.state.Waiters.forEach(item => {
                        if (data.user.username === item.username) {
                            item = data.user;
                        }
                    })
                })
            }
            // 分页刷新
            setTimeout(() => {
                // console.log('分页刷新');
                store.dispatch('queryWaiter', store.state.page);
            }, 800);
        },

        //根据id删除员工
        delWaiterById(store, id) {
            // store.state.Waiters = store.state.Waiters.filter(cus => cus.id !== id)
            axios.get("/baseUser/deleteById?id=" + id).then(res => {
                if (res.message === "删除成功") {
                    store.state.total -= 1;
                    store.state.Waiters = store.state.Waiters.filter(item => item.id !== id);
                }
            })
            setTimeout(() => {
                if (store.state.total > store.state.page.pageSize * store.state.page.page) {
                    store.dispatch('queryWaiter', store.state.page);
                } else {
                    store.dispatch('queryWaiter', { page: store.state.page.page - 1, pageSize: store.state.page.pageSize });
                }
            }, 200);
        },
        //根据id查找员工
        findWaiterById({ commit }, id) {
            axios.get("/Waiter/findWaiterById?id=" + id).then(res => {
                commit("SET_Waiter", res.data)
            })
        },
        //设置权限
        setRolesOnWaiter() {

        }
    }
}