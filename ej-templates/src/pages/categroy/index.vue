<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-09 09:01:22
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-12 17:02:56
 * @FilePath: \ej-template\src\pages\categroy\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-button type="primary" size="small" @click="toAddHandler">添加栏目</el-button>

    <!-- 表格开始 -->
    <el-table :data="pagingCategory" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="name" label="栏目名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
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
        <el-form-item label="栏目名称">
          <el-input v-model="form.name" clearable placeholder="请输入栏目名称"></el-input>
        </el-form-item>
        <el-form-item label="栏目描述">
          <el-input type="textarea" v-model="form.description" clearable placeholder="请输入栏目说明"></el-input>
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
      this.queryCategory(this.list);
    }, 200);
  },
  computed: {
    ...mapState("category", ["pagingCategory", "total"]),
  },
  methods: {
    ...mapActions("category", [
      "findAll",
      "queryCategory",
      "saveCategory",
      "delCategoryById",
    ]),
    //分页
    changPage(page) {
      this.list.page = page - 1;
      this.queryCategory(this.list);
    },
    // 控制添加栏目的模态框
    toAddHandler() {
      // 打开模态框
      this.dialogFormVisible = true;
      // 修改title信息
      this.title = "添加栏目";
      this.isReadonly=false;
      // 清空表单
      this.form = {};
    },
    // 添加栏目
    submit() {
      // 调用store中的方法提交请求
      // this.from.id=nanoid();
      if(this.title==="添加栏目"){
        this.saveCategory({category:this.form,isAdd:true});
      }else if(this.title==="修改栏目信息"){
        this.saveCategory({category:this.form,isAdd:false});
      }
      // 关闭模态框
      this.dialogFormVisible = false;
    },
    // 根据id删除栏目
    delHandle(id) {
      this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.delCategoryById(id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
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
      this.title = "修改栏目信息";
      this.isReadonly=true;
      this.dialogFormVisible = true;
      this.form = row;
    },
    // 查询
    searchHandle() {
      this.queryCategory(this.list);
    },
    // 详情
    detailsHandle(id) {
      this.$router.push({ name: "details", params: { id: id } });
    },
  },
};
</script>

<style scoped></style>
