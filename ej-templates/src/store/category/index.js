/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-09 09:01:22
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-13 18:37:00
 * @FilePath: \ej-template\src\store\customer\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 在Vuex中 需要处理网路请求 我们就需要导入axios 
// @ 以根目录的方式定义相对路径 想到与src/
import axios from '@/http/axios'
// 配置Vuex结构
export default {

    namespaced: true,
    state: {
        categoryAll: [],
        category: [],
        pagingCategory: [],
        total: null,
        page: {}
    },
    mutations: {
        SET_CATEGORY(state, category) {
            state.category = category;
        },
        SET_TOTAL(state, total) {
            state.total = total;
        },
        SET_CATEGORYALL(state, categoryAll) {
            state.categoryAll = categoryAll;
        },
        SET_PAGE(state, page) {
            state.page = page;
        }
    },
    actions: {
        //查找所有栏目
        findAll(store) {
            axios.get("/category/findAll").then(res => {
                // console.log("findAll数据返回", res.data[0].roles[0].id);
                store.commit("SET_CATEGORYALL", res.data);
                store.commit("SET_TOTAL", res.data.length);
            }).catch(err => {
                console.log('findAll错误返回', err);
            })
        },

    
        queryCategory(store, data) {
            store.state.pagingCategory = store.state.categoryAll.slice(data.page * data.pageSize, (data.page + 1) * data.pageSize);
            store.commit("SET_PAGE", data)
        },
       
        saveCategory(store, data) {
 
            if (data.isAdd === true) {
                axios.post('/category/saveOrUpdate', data.category).then(res => {
                    store.state.categoryAll.push(data.category);
                    console.log('栏目添加成功');
                    store.dispatch('findAll');
                })
            } else if (data.isAdd === false) {
                axios.post('/category/saveOrUpdate', data.category).then(res => {
                    // console.log(res);
                    store.state.categoryAll.forEach(item => {
                        if (data.category.id === item.id) {
                            item = data.category;
                        }
                    })
                })
            }
     
            setTimeout(() => {
    
                store.dispatch('queryCategory', store.state.page);
            }, 800);
        },

  
        delCategoryById(store, id) {
            axios.get("/category/deleteById?id=" + id).then(res => {
                if (res.message === "删除成功") {
                    store.state.total -= 1;
                    store.state.categoryAll = store.state.categoryAll.filter(item => item.id !== id);
                }
            })
            setTimeout(() => {
                if (store.state.total > store.state.page.pageSize * store.state.page.page) {
                    store.dispatch('queryCategory', store.state.page);
                    console.log('原页刷新');
                } else {
                    console.log('减页刷新');
                    store.dispatch('queryCategory', { page: store.state.page.page - 1, pageSize: store.state.page.pageSize });
                }
            }, 200);
        },
    }
}