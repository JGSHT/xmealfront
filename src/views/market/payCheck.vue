<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="payCheckList">
        <span slot="label"><i class="el-icon-document"></i> 充值配置</span>
        <el-form :inline="true" :model="payCheckSearch" class="demo-form-inline">
          <el-form-item label="充值名称">
            <el-input v-model="payCheckSearch.payName" placeholder="充值名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="getPayCheckList" @click="getPayCheckList">查询</el-button>
            <el-button icon="plus" @click="addPayCheck">新增</el-button>
          </el-form-item>
        </el-form>

        <el-table
          ref="multipleTable"
          v-loading="payCheckListLoading"
          :data="payCheckList"
          :border="hasBorder"
          height="450"
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="payName"
            label="充值名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="payPrice"
            label="充值金额"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="realPayPrice"
            label="实际充值金额"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="payCheckEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="payCheckDelete(scope.$index, scope.row)">删除</el-button>
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
          <div style="align-content:center">
            <el-form :inline="true" :model="payChecks" label-position="left" ref="payCheckForm" v-loading="formLoading" label-width="200px"
                     style="margin: 0 3%">

              <el-form-item label="充值名称" prop="payName">
                <el-input style="width: 360px;" v-model="payChecks.payName" ></el-input>
              </el-form-item>

              <el-form-item label="充值金额" prop="payPrice">
                <el-input style="width: 360px;" type="number" pattern="[0-9]*" v-model.number="payChecks.payPrice" ></el-input>
              </el-form-item>

              <el-form-item label="实际充值金额" prop="realPayPrice">
                <el-input style="width: 360px;" type="number" pattern="[0-9]*" v-model.number="payChecks.realPayPrice" ></el-input>
              </el-form-item>

              <el-form-item prop="id">
                <el-input :hidden="true" v-model="payChecks.id" ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="savePayCheck" :loading="saveLoading">确定</el-button>
            <el-button @click="dialogShow = false">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="userRechargeList" >
        <span slot="label"><i class="el-icon-document"></i> 充值明细</span>
        <el-form :model="userRechargeSearch" class="demo-form-inline"  label-width="70px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="日期范围" prop="dateTime">
                <el-date-picker
                  v-model="userRechargeSearch.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  placeholder="选择时间范围"
                  align="right" style="width:100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="设备名称">
                <el-input v-model="userRechargeSearch.machineName" placeholder="设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="手机号码">
                <el-input v-model="userRechargeSearch.mobile" placeholder="手机号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-button type="primary" icon="getUserRechargeList" @click="getUserChargeList">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          ref="multipleTable"
          v-loading="userRechargeListLoading"
          :data="userRechargeList"
          :border="hasBorder"
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="订单号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="充值人手机号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="machineName"
            label="设备名称"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="totalPrice"
            label="总价"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="status"
            label="订单状态"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="createdDate"
            label="下单时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="paidDate"
            label="充值时间"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="paidPrice"
            label="充值金额"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <p class="block" style="float:right">
          <el-pagination
            @size-change="userChargeHandleSizeChange"
            @current-change="userChargeHandleCurrentChange"
            :current-page="userRechargePage"
            :page-sizes="userRechargeSizes"
            :page-size="userRechargeSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userRechargeTotal">
          </el-pagination>
        </p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchPayCheckList,fetchDeletePayCheck,fetchSavePayCheck,fetchUpdatePayCheck } from 'api/payCheck';
  import { fetchUserRechargeList } from 'api/userRecharge';

  export default {
    created() {
      this.getPayCheckList()
    },
    data() {
      return {
        activeName:'payCheckList',
        payCheckSearch:{
          payName:'',
        },
        payCheckList:[],
        payCheckListLoading: false,
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
        payChecks: {
          id: '',
          payName: '',
          payPrice: '',
          realPayPrice: ''
        },
        userRechargeSearch:{
          machineName:'',
          mobile:'',
          dateTime:'',
        },
        hasBorder : true,
        userRechargeList:[],
        userRechargeListLoading: false,
        userRechargePage: 1,
        userRechargeSize: 10,
        userRechargeTotal: 0,
        userRechargeSizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        filterText: '',
        menus: [],
        userRecharge: {
          id: '',
          payName: '',
          payPrice: '',
          realPayPrice: ''
        },
        pickerOptions: {
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setHours(0, 0, 0, 0);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              end.setHours(23, 59, 59, 999);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '今天',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setHours(0, 0, 0, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {
      getPayCheckList() {
        this.payCheckListLoading = true
        fetchPayCheckList(this.payCheckSearch, this.page, this.size).then(response =>{
          this.payCheckListLoading = false
          this.payCheckList = response.response
          this.total = response.total
        })
      },
      payCheckEdit(index, row) {
        this.dialogShow = true
        this.formLoading = true
        fetchUpdatePayCheck(row.id).then(response =>{
          this.formLoading = false
          this.payChecks = response.response
        })
      },
      payCheckDelete(index, row) {
        this.$confirm('此操作将永久删除该充值配置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.payCheckListLoading = true
          fetchDeletePayCheck(row.id).then(response =>{
            this.getPayCheckList()
            this.$message.success('删除成功')
          })
        })

      },
      addPayCheck() {
        this.dialogShow = true
        this.resetForm()
      },
      savePayCheck () {
        this.saveLoading = true
        fetchSavePayCheck(this.payChecks).then(response =>{
          this.getPayCheckList()
          this.saveLoading = false
          this.$message.success('保存成功')
          this.dialogShow = false
        })
      },
      resetForm() {
        if (this.$refs['payCheckForm']) {
          this.$refs['payCheckForm'].resetFields();
        }
        this.saveLoading = false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleSizeChange(val) {
        this.size = val
        this.getPayCheckList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getPayCheckList()
      },
      getUserChargeList() {
        this.userRechargeListLoading = true
        fetchUserRechargeList(this.userRechargeSearch, this.userRechargePage, this.userRechargeSize).then(response =>{
          this.userRechargeListLoading = false
          this.userRechargeList = response.response
          this.userRechargeTotal = response.total
        })
      },

      userChargeHandleSizeChange(val) {
        this.userRechargeSize = val
        this.getUserChargeList()
      },
      userChargeHandleCurrentChange(val) {
        this.userRechargePage = val
        this.getUserChargeList()
      },
      tabClick(tab, event) {
        if (tab.name === 'payCheckList') {
          if (this.payCheckList.length < 1) {
            this.getPayCheckList()
          }
        }
        if (tab.name === 'userRechargeList') {
          if (this.userRechargeList.length < 1) {
            this.getUserChargeList()
          }
        }
      }
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
