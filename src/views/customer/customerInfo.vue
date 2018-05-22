<template>
  <div style="margin: 0% 2%;">
    <el-tabs v-model="activeName">
      <el-tab-pane  name="customerList">
        <span slot="label"><i class="el-icon-document"></i> 顾客信息列表</span>
          <el-form :inline="true" :model="customerSearch" class="demo-form-inline">
            <el-row :gutter="20">
            <el-col :span="7">
            <el-form-item label="手机号码" prop="mobile">
              <el-input type="text" v-model="customerSearch.mobile" placeholder="请输入手机号码"
                        pattern="^[0-9]*[1-9][0-9]*$"
                        :maxlength="11" v-on:blur="checkMobile" style=";width: 132%"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="设备名称" prop="machineId">
              <el-select v-model="customerSearch.machineId" filterable clearable placeholder="选择设备">
                <el-option v-for="machine in machineList" :key="machine.id" :label="machine.machineName"
                           :value="parseInt(machine.id)"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="时间" prop="dateTime">
              <div class="block">
                <el-date-picker
                  v-model="customerSearch.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOption"
                  placeholder="请选择注册时间范围"
                  align="right">
                </el-date-picker>
              </div>
            </el-form-item>
            </el-col>
        </el-row>
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item >
                  <el-button type="primary" icon="search" @click="search">查询</el-button>
                  <el-button @click="getCustomerInfoExcel" style="margin-right: 0" :loading="exportLoading">导出</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
           v-loading="customerListLoading"
           :data="customers"
           stripe
           border
           style="width: 100%;">
           <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="顾客ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="微信昵称">
                <span>{{ props.row.nickname }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.userSex }}</span>
              </el-form-item>
              <el-form-item label="城市">
                <span>{{props.row.city}}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ props.row.mobile }}</span>
              </el-form-item>
              <el-form-item label="账户余额">
                <span>{{ props.row.accountBalance }}</span>
              </el-form-item>
              <el-form-item label="消费总金额">
                <span>{{ props.row.monetary }}</span>
              </el-form-item>
              <el-form-item label="退款总金额">
                <span>{{ props.row.refundAmt }}</span>
              </el-form-item>
              <el-form-item label="注册日期">
                <span>{{ props.row.createdDate }}</span>
              </el-form-item>
                <el-form-item label="喜好商品标签">
                  <span>{{ props.row.labelName }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
            <el-table-column prop="nickname" label="微信昵称"  align="center"></el-table-column>
           <el-table-column prop="mobile" label="联系方式"  align="center"></el-table-column>
           <el-table-column prop="accountBalance" label="账户余额（元）" align="center" ></el-table-column>
            <el-table-column prop="monetary" label="消费总金额（元）"  align="center"></el-table-column>
            <el-table-column prop="refundAmt" label="退款总金额（元）" align="center" ></el-table-column>
            <!--<el-table-column prop="createdDate" label="注册日期" align="center" ></el-table-column>-->
            <el-table-column prop="labelName" label="喜好商品标签" align="center" ></el-table-column>
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
        <a id="getExcel" style="display: none"></a>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchCustomerList,fetchCustomerOrders,fetchExportCustomerInfo } from 'api/customer';
  import { getToken } from 'utils/auth';
  import { fetchMachineList } from 'api/machine';

  export default {
    created() {
      this.search()
      this.getMachineList()
    },
    data() {
      return {
        exportLoading: false,
        activeName: 'customerList',

        customerSearch: {
          mobile: '',
          dateTime: '',
          machineId: ''
        },
        customers: [],
        customerListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        uploadDialogShow: false,
        formLoading: false,
        saveLoading: false,
        customerOrdersLoading: false,
        mobileLength: 11,
        customer: {
          id: '',
          nickname: '',
          userSex: '',
          city: '',
          mobile: '',
          monetary: '',
          refundAmt: '',
          createdDate: '',
          accountBalance: ''
        },
        customerDetail: {

        },
        customerOrders: [],
        customerOrdersSelection: [],
        machineList: [],

        /*初始化带快捷选项的日期*/
        pickerOption: {
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
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 182);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        }
      }
    },
    methods: {
      search() {
        this.customerListLoading = true
        fetchCustomerList(this.customerSearch, this.page, this.size).then(response =>{
          this.customerListLoading = false
          this.customers = response.response
          this.total = response.total
        })
      },
      getCustomerInfoExcel() {
        if (this.customers.length === 0) {
          this.$message({
            showClose: true,
            message: '没有可导出的数据',
            duration: 3000,
            type: 'warning'
          });
        } else {
          this.exportLoading = true
          fetchExportCustomerInfo(this.customerSearch).then(response => {
            console.log(response.response)
            this.exportLoading = false
            if (response.response === '') {
              this.$message({
                showClose: true,
                message: '获取excel失败',
                duration: 3000,
                type: 'warning'
              });
            } else {
              var CustomerExcel = document.getElementById('getExcel');
              console.log(response.response);
              CustomerExcel.setAttribute("href", response.response[0]);
              CustomerExcel.setAttribute("download", response.response[1]);
              CustomerExcel.click();
            }
          })
        }
      },
      resetForm() {
        if (this.$refs['product']) {
          this.$refs['product'].resetFields();
        }
        this.saveLoading = false
      },
      getMachineList() {
        fetchMachineList({}, 1, 100000).then(response => {
          this.machineList = response.response
        })
      },
      //去除输入的非数字
      checkMobile() {
        if(this.customerSearch.mobile !== "") {
          this.customerSearch.mobile = (this.customerSearch.mobile).replace(/[^0-9]/ig, "");
          if(this.customerSearch.mobile === "") {
            this.open();
          }
        }

      },
      open() {
        this.$message({
          message: '手机号码输入框中请输入数字',
          type: 'warning'
        });
      },
      handleSizeChange(val) {
        this.size = val
        this.search()
      },
      handleCurrentChange(val) {
        this.page = val
        this.search()
      },
      handleCustomerOrdersSelectionChange(val) {
        this.customerOrdersSelection = val
      },
      handleMachinesSelectionChange(val) {
        this.machinesSelection = val
      }
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  }

</style>
