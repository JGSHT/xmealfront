<template>
  <div style="margin: 1% 2%;">

    <el-row :gutter="20">
      <el-form :inline="true" :model="brandLabelSearch" class="demo-form-inline">
        <el-col :span="5">
        <el-form-item label="标签名称">
          <el-input v-model="brandLabelSearch.labelName" placeholder="标签名称"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="5">
        <el-form-item>
          <el-button type="primary" icon="search" @click="getBrandLabelList">查询</el-button>
          <el-button icon="plus" @click="addBrandLabe">新增</el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </el-row>

      <el-table
        ref="multipleTable"
        v-loading="brandLabelListLoading"
        :data="brandLabelList"
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
          prop="labelName"
          label="标签名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="isShow"
          label="是否展示标签"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="scope" align="center">
            <el-switch
              v-model="scope.row.isShow"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value=0
              :inactive-value=1
              active-text="是"
              inactive-text="否"
              @change="switchChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="brandLabelEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="brandLabelDelete(scope.$index, scope.row)">删除
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
      <el-dialog :title="dialogTitle" :visible.sync="dialogShow" v-on:close="resetForm">
        <el-form :model="brandLabel" label-position="left" ref="brandLabelForm" v-loading="formLoading"
                 :rules="brandLabelFormRules"
                 label-width="100px"
                 style="margin: 0 3%">

          <el-form-item label="标签名称" prop="labelName">
            <el-input style="width: 360px;" v-model.trim="brandLabel.labelName"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveBrandLabel" :loading="saveLoading">确定</el-button>
          <el-button @click="resetForm">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import { fetchBrandLabelList, fetchDeleteBrandLabel, fetchSaveBrandLabel, fetchUpdateBrandLabel } from 'api/brandLabel';

  export default {
    created() {
      this.getBrandLabelList()
    },
    data() {
      return {
        brandLabelSearch: {
          labelName: ''
        },
        brandLabelList: [],
        brandLabelListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        menus: [],
        brandLabel: {
          id: '',
          labelName: ''
        },
        brandLabelFormRules: {
          labelName: [
            {
              validator: (rule, value, callback) => {
                if (value == '' || value.replace(/(^\s*)|(\s*$)/g, '') === '') {
                  callback(new Error("请输入标签名称"));
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
      getBrandLabelList() {
        this.brandLabelListLoading = true
        fetchBrandLabelList(this.brandLabelSearch, this.page, this.size).then(response => {
          this.brandLabelListLoading = false
          this.brandLabelList = response.response
          this.total = response.total
        })
      },
      brandLabelEdit(index, row) {
        this.dialogShow = true
        this.formLoading = true
        fetchUpdateBrandLabel(row.id).then(response => {
          this.formLoading = false
          this.brandLabel = response.response
        })
      },
      brandLabelDelete(index, row) {
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.brandLabelListLoading = true
          fetchDeleteBrandLabel(row.id).then(response => {
            this.getBrandLabelList()
            this.$message.success('删除成功')
          })
        })
      },
      addBrandLabe() {
        this.brandLabel.id = ''
        this.brandLabel.labelName = ''
        this.dialogShow = true
      },
      saveBrandLabel() {
        this.$refs['brandLabelForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            fetchSaveBrandLabel(this.brandLabel).then(response => {
              if (response.code === 0) {
                this.getBrandLabelList()
                this.saveLoading = false
                this.$message.success('保存成功')
                this.resetForm()
              } else {
                this.saveLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      switchChange(data) {
        const params = {
          request: {
            id: data.id,
            isShow: data.isShow
          }
        }
        console.log('params.id=' + params.request.id)
        console.log('params.isShow=' + params.request.isShow)
        fetchSaveBrandLabel(params.request).then(response => {
          if (response.code === 0) {
            this.$message.success('切换标签状态成功')
          } else {
            if (data.isShow === 0) {
              data.isShow = 1
            } else {
              data.isShow = 0
            }
            this.$message.success('切换标签状态失败')
          }
        })
      },
      resetForm() {
        this.dialogShow = false
        this.$refs['brandLabelForm'].resetFields();
        this.saveLoading = false
      },
      handleSizeChange(val) {
        this.size = val
        this.getBrandLabelList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getBrandLabelList()
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
