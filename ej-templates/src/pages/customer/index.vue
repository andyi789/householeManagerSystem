<template>
  <div>
    <el-button type="primary" size="small" @click="toAddHandler">添加顾客</el-button>
    <el-input
      v-model="list.status"
      clearable
      placeholder="请输入状态"
      style="width:200px;display:inline-block"
    ></el-input>
    <el-input
      v-model="list.telephone"
      clearable
      placeholder="请输入手机号"
      style="width:200px;display:inline-block"
    ></el-input>
    <el-button type="primary" size="small" @click="searchHandle">查询</el-button>

    <!-- 表格开始 -->
    <el-table :data="pagingCustomers" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="telephone" label="手机号"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="detailsHandle(scope.row.id)" type="text" size="small">详情</el-button>
          <el-button @click="editHandle(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delHandle(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->
    
    <!-- 分页开始 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="this.list.pageSize"
      @current-change="changPage"
    ></el-pagination>
    <!-- 分页结束 -->
    <!-- 模态框开始 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" clearable placeholder="请输入用户名" :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" clearable placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.telephone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择顾客状态">
            <el-option label="禁用" value="禁用" />
            <el-option label="启用" value="启用" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框结束 -->
  </div>
</template>
<script>

import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      list: {
        page: 0,
        pageSize: 5,
        // roleId:6
      },
      dialogFormVisible: false,
      form: {},
      title: "",
      isReadonly:false,
    };
  },
  created() {
    this.findAll();
  },
  mounted(){
    setTimeout(() => {
      this.queryCustomer(this.list);
    }, 200);
  },
  computed: {
    ...mapState("customer", ["pagingCustomers", "total"]),
  },
  methods: {
    ...mapActions("customer", [
      "findAll",
      "queryCustomer",
      "saveCustomer",
      "delCustomerById",
    ]),
    //分页
    changPage(page) {
      this.list.page = page - 1;
      this.queryCustomer(this.list);
    },
    // 控制添加顾客的模态框
    toAddHandler() {
      // 打开模态框
      this.dialogFormVisible = true;
      // 修改title信息
      this.title = "添加顾客";
      this.isReadonly=false;
      // 清空表单
      this.form = {};
    },
    // 添加顾客
    submit() {
      // 调用store中的方法提交请求
      // this.from.id=nanoid();
      if(this.title==="添加顾客"){
        this.saveCustomer({user:this.form,isAdd:true});
      }else if(this.title==="修改顾客信息"){
        this.saveCustomer({user:this.form,isAdd:false});
      }
      // 关闭模态框
      this.dialogFormVisible = false;
    },
    // 根据id删除顾客
    delHandle(id) {
      this.$confirm("此操作将永久删除该顾客, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.delCustomerById(id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          /* setTimeout(() => {
            this.queryCustomer(this.list);
          }, 200); */
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 编辑
    editHandle(row) {
      // 打开模态框
      this.title = "修改顾客信息";
      this.isReadonly=true;
      this.dialogFormVisible = true;
      this.form = row;
    },
    // 查询
    searchHandle() {
      this.queryCustomer(this.list);
    },
    // 详情
    detailsHandle(id) {
      this.$router.push({ name: "details", params: { id: id } });
    },
  },
};
</script>
<style scoped>
</style>
