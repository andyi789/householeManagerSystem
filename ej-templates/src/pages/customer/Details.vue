<template>
  <div class="details">
    <el-link type="primary" @click="backHandle">返回</el-link>
    <!-- tab开始 -->
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
                <div>用户名：{{this.customer.username}}</div>
            </el-tab-pane>
            <el-tab-pane label="订单信息" name="second">订单信息</el-tab-pane>
            <el-tab-pane label="地址信息" name="third">地址信息</el-tab-pane>
        </el-tabs>
    </div>
    <!-- tab结束 -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    data(){
        return{
            activeName:"first"
        };
    },
    created(){
        this.findCustomerById(this.$route.params.id);
    },
    computed:{
        ...mapState("customer",["customer"]),
    },
    methods:{
        ...mapActions("customer",["findCustomerById"]),
        backHandle(){
            this.$router.push({name:"customer"})
        }
    }
};
</script>

