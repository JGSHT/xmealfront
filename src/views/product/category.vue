<template>
  <div style="margin: 1% 2%;">

    <el-row :gutter="20">
      <el-form :inline="true" :model="categorySearch" class="demo-form-inline">
        <el-col :span="5">
        <el-form-item label="品类名称">
          <el-input v-model="categorySearch.categoryName" placeholder="品类名称"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="5">
        <el-form-item>
          <el-button type="primary" icon="search" @click="getCategoryList">查询</el-button>
          <el-button icon="plus" @click="addCategory">新增</el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </el-row>

      <el-table
        ref="multipleTable"
        v-loading="payCategoryListLoading"
        :data="categoryList"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="品类名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="important"
          label="优先级/排序"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="categoryEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="categoryDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p class="block" style="float:right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="sizes"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </p>
      <el-dialog :title="dialogTitle" :visible.sync="dialogShow" :close="resetForm">
          <el-form :model="categorie" label-position="left" ref="categoryForm" v-loading="formLoading"
                   :rules="categoryFormRules"
                   label-width="100px"
                   style="margin: 0 3%">

            <el-form-item label="品类名称" prop="categoryName">
              <el-input style="width: 360px;" v-model="categorie.categoryName"></el-input>
            </el-form-item>

            <el-form-item label="排序" prop="important">
              <el-input style="width: 360px;" type="number" pattern="[0-9]*"
                        v-model.number="categorie.important"></el-input>
            </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveCategory" :loading="saveLoading">确定</el-button>
          <el-button @click="resetForm">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import {fetchCategoryList, fetchDeleteCategory, fetchSaveCategory, fetchUpdateCategory} from 'api/category';

  export default {
    created() {
      this.getCategoryList()
    },
    data() {
      return {
        categorySearch: {
          categoryName: '',
        },
        categoryList: [],
        payCategoryListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        filterText: '',
        menus: [],
        categorie: {
          id: '',
          categoryName: '',
          important: ''
        },
        categoryFormRules: {
          categoryName: [
            {
              validator: (rule, value, callback) => {
                if (value == '' || value.replace(/(^\s*)|(\s*$)/g, '') === '') {
                  callback(new Error("请输入品类名称"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          important: [
            {
              validator: (rule, value, callback) => {
                if (value == '' || value <= 0) {
                  callback(new Error("请规范输入排序"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      getCategoryList() {
        this.payCategoryListLoading = true
        fetchCategoryList(this.categorySearch, this.page, this.size).then(response => {
          this.payCategoryListLoading = false
          this.categoryList = response.response
          this.total = response.total
        })
      },
      categoryEdit(index, row) {
        this.dialogShow = true
        this.formLoading = true
        fetchUpdateCategory(row.id).then(response => {
          this.formLoading = false
          this.categorie = response.response
        })
      },
      categoryDelete(index, row) {
        this.$confirm('此操作将永久删除该品类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.payCategoryListLoading = true
          fetchDeleteCategory(row.id).then(response => {
            this.getCategoryList()
            this.$message.success('删除成功')
          })
        })

      },
      addCategory() {
        this.categorie.id = ''
        this.categorie.categoryName = ''
        this.categorie.important = ''
        this.dialogShow = true
      },
      saveCategory() {
        this.$refs['categoryForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            fetchSaveCategory(this.categorie).then(response => {
              this.getCategoryList()
              this.saveLoading = false
              this.$message.success('保存成功')
              this.dialogShow = false
            })
          } else {
            return false
          }
        })
        },
      resetForm() {
        this.dialogShow = false
        this.$refs['categoryForm'].resetFields();
        this.saveLoading = false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleSizeChange(val) {
        this.size = val
        this.getCategoryList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getCategoryList()
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
