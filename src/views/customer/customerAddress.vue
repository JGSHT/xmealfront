<template>
  <div style="margin: 1% 2%;">

    <el-row :gutter="20">
      <el-form :inline="true" :model="addressSearch" class="demo-form-inline">
        <el-col :span="5">
        <el-form-item label="姓名">
          <el-input v-model="addressSearch.name" placeholder="姓名"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="手机号码" prop="mobile">
            <el-input type="text" v-model="addressSearch.mobile" placeholder="请输入手机号码"
                      pattern="^[0-9]*[1-9][0-9]*$"
                      :maxlength="11" style=";width: 132%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
        <el-form-item>
          <el-button type="primary" icon="search" @click="getCustomerAddressList">查询</el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </el-row>

      <el-table
        ref="multipleTable"
        v-loading="customerListLoading"
        :data="customerAddressList"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号码"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="area"
          label="地区"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="address"
          label="详细收货地址"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="code"
          label="邮政编码"
          align="center"
          show-overflow-tooltip>
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
  </div>
</template>

<script>
  import { fetchCustomerAddressList } from 'api/customerAddress';

  export default {
    created() {
      this.getCustomerAddressList()
    },
    data() {
      return {
        addressSearch: {
          name: '',
          mobile: ''
        },
        customerAddressList: [],
        customerListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        formLoading: false,
        filterText: ''
      }
    },
    methods: {
      getCustomerAddressList() {
        if (this.addressSearch.mobile !== "") {
          this.addressSearch.mobile = (this.addressSearch.mobile).replace(/[^0-9]/ig, "");
          if (this.addressSearch.mobile === "") {
            this.$message.warning("手机号码输入框中请输入数字")
            return
          }
        }
        this.customerListLoading = true
        fetchCustomerAddressList(this.addressSearch, this.page, this.size).then(response => {
          this.customerListLoading = false
          this.customerAddressList = response.response
          this.total = response.total
        })
      },
      resetForm() {
        this.dialogShow = false
        this.$refs['categoryForm'].resetFields();
        this.saveLoading = false
      },
      handleSizeChange(val) {
        this.size = val
        this.getCustomerAddressList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getCustomerAddressList()
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
