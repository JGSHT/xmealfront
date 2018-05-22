<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="selectTab">
      <el-tab-pane name="machineList">
        <span slot="label">设备列表</span>
        <el-form :model="recordMachineSearch" class="demo-form-inline" label-width="70px" label-position="left">
          <el-row  :gutter="20">
            <el-col :span="10">
              <el-form-item label="机构" label-width="50px">
                <el-cascader
                  :options="offices"
                  v-model="recordMachineSearch.officeIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  style="width: 100%;"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" label-width="50px">
                <el-select v-model="recordMachineSearch.machineStatus" clearable placeholder="请选择设备状态">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="设备名称">
                <el-input v-model="recordMachineSearch.machineName" placeholder="设备名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="时间" prop="dateTime" label-width="50px">
                <el-date-picker
                  v-model="recordMachineSearch.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="getRecordMachineList">查询</el-button>
                <el-button @click="getRecordMachineExcel" icon="el-icon-share" round style="margin-right: 0" :loading="exportLoading">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-tooltip class="item" effect="dark" content="双击设备展示详情" placement="top-end">
          <el-table
            ref="multipleTable"
            v-loading="recordMachineListLoading"
            :data="recordMachineList"
            @row-dblclick="searchOrder"
            :border="hasBorder"
            :summary-method="getSummaries"
            show-summary
            stripe
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="machineName"
              label="设备名称">
            </el-table-column>

            <el-table-column
              prop="companyName"
              label="公司名称">
            </el-table-column>

            <el-table-column
              prop="regionName"
              label="大区名称">
            </el-table-column>

            <el-table-column
              prop="officeName"
              label="机构名称">
            </el-table-column>

            <el-table-column
              prop="buyOrder"
              label="销售金额"
              sortable>
            </el-table-column>
            <el-table-column
              prop="rechargeOrder"
              label="充值金额"
              sortable>
            </el-table-column>

            <el-table-column
              prop="buyOrderCount"
              label="购买订单数">
            </el-table-column>

            <el-table-column
              prop="rechargeOrderCount"
              label="充值订单数">
            </el-table-column>

            <el-table-column
              prop="buyUnitPrice"
              label="购买客单价">
            </el-table-column>

            <el-table-column
              prop="rechargeUnitPrice"
              label="充值客单价">
            </el-table-column>

            <el-table-column
              prop="grossProfit"
              label="毛利"
              sortable>
            </el-table-column>

          </el-table>
        </el-tooltip>
        <p class="block" style="float:right">
          <el-pagination
            @size-change="recordMachineHandleSizeChange"
            @current-change="recordMachineHandleCurrentChange"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </p>
        <a id="getExcel" style="display: none"></a>
      </el-tab-pane>
      <el-tab-pane name="orderList">
        <span slot="label">设备详细信息</span>
        <el-alert v-if="!currentMachineId" :closable="false"
                  title="请选择一台设备,才能查看更多信息！！！" type="warning">
        </el-alert>
        <el-card class="box-card" v-if="currentMachineId">
          <el-form label-position="left" inline label-width="80px" class="record-table-expand">
            <el-input id="machineId" type="hidden" >{{ machine.id}}</el-input>
            <el-form-item label="设备ID" style="width: 30%">
              <span>{{ machine.id }}</span>
            </el-form-item>
            <el-form-item label="设备名称" style="width: 30%">
              <span>{{ machine.machineName }}</span>
            </el-form-item>
            <el-form-item label="所在地" style="width: 30%">
              <span>{{ machine.preAddress }}</span>
            </el-form-item>
            <el-form-item label="大区" style="width: 30%">
              <span>{{ machine.companyName }}</span>
            </el-form-item>
            <el-form-item label="中心" style="width: 30%">
              <span>{{ machine.regionName }}</span>
            </el-form-item>
            <el-form-item label="片区" style="width: 30%">
              <span>{{ machine.officeName }}</span>
            </el-form-item>

            <el-form-item label="地址" style="width: 100%">
              <span>{{ machine.address }}</span>
            </el-form-item>
            <el-form-item label="备注" style="width: 100%">
              <span>{{ machine.note }}</span>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top:10px" v-if="currentMachineId">
          <div v-show="contentShow">
            <el-tooltip class="item" effect="dark" content="双击订单展示详情" placement="top-end">
              <el-table v-if="orderList"
                        v-loading.body="orderListLoading"
                        :data="orderList"
                        stripe
                        highlight-current-row
                        :border="hasBorder"
                        @row-dblclick="getOrderDetail"
                        style="width: 100%;">
                <el-table-column prop="id" label="订单编号" :data-id="id" align="center"></el-table-column>
                <el-table-column prop="mobile" label="顾客手机号" align="center" ></el-table-column>
                <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
                <el-table-column prop="totalPrice" label="总价" align="center" ></el-table-column>
                <el-table-column prop="orderType" label="订单类型" align="center" ></el-table-column>
                <el-table-column prop="status" label="订单状态" align="center" ></el-table-column>
                <el-table-column prop="paidPrice" label="支付金额" align="center" ></el-table-column>
                <el-table-column prop="paidType" label="支付类型" align="center" ></el-table-column>
                <div style="display: none" prop="createdDate"></div>
              </el-table>
            </el-tooltip>
            <p class="block" style="float:right; "  v-if="orderList">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="orderPage"
                :page-sizes="orderSizes"
                :page-size="orderSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="orderTotal">
              </el-pagination>
            </p>
          </div>
        </el-card>
        <el-dialog title="订单详情" :visible.sync="orderDetailDialogShow">
          <el-card class="box-card" style="margin-top: 5px;">
            <el-form label-position="left" inline style="margin-left: 80px">
              <el-form-item class="detailInfoForm" label="订单号:" style="width: 40%">
                <span> {{orderBuyerInfo.orderId}}</span>
              </el-form-item>
              <el-form-item class="detailInfoForm" label="顾客联系方式:" style="width: 40%">
                <span>{{orderBuyerInfo.mobile}}</span>
              </el-form-item>
              <el-form-item class="detailInfoForm" label="下单时间:" style="width: 40%">
                <span>{{orderBuyerInfo.createdDate}}</span>
              </el-form-item>
              <el-form-item class="detailInfoForm" label="付款时间:" style="width: 40%">
                <span>{{orderBuyerInfo.paidDate}}</span>
              </el-form-item>
            </el-form>
          </el-card>
          <el-table class="box-card"
                    v-loading.body="orderDetailLoading"
                    :data="orderDetailList"
                    stripe
                    style="width: 100%;">
            <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="count" label="购买量" align="center"></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价" align="center"></el-table-column>
            <el-table-column prop="salePrice" label="商品售价" align="center"></el-table-column>
            <el-table-column prop="barCode" label="商品条形码" align="center"></el-table-column>
          </el-table>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchRecordMachineList,fetchOrderList,fetchOrderDetailList,fetchRecordMachine } from 'api/recordMachine';
  import { fetchOfficeTree } from 'api/office';

  export default {
    created() {
      this.getRecordMachineList()
      this.getOffices()
    },
    data() {
      return {
        activeName:'machineList',
        recordMachineSearch:{
          machineName:'',
          machineStatus:'',
          mobile:'',
          dateTime:'',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: []
        },
        recordMachineList:[],
        recordMachineListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        offices: [],
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        filterText: '',
        currentMachineId:'',
        contentShow: true,
        tipsShow: false,
        recordMachine: {
          id: '',
          machineName: '',
          officeName: '',
          regionName: '',
          companyName: '',
          buyOrder: '',
          rechargeOrder: '',
          buyOrderCount: '',
          rechargeOrderCount: '',
          buyUnitPrice: '',
          rechargeUnitPrice: '',
          grossProfit:'',
          preAddress: '',
          address: '',
          note: ''
        },
        machine: {

        },
        options1: [{
          value: 1,
          label: '未安装',
          disabled: false
        }, {
          value: 2,
          label: '运营中',
          disabled: true
        }, {
          value: 3,
          label: '已撤点',
          disabled: true
        }],
        hasBorder : true,
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
        orderList: [],
        orderDetailList: [],
        orderBuyerInfo: {},
        orderListLoading: false,
        orderDetailLoading: false,
        orderDetailDialogShow: false,
        orderPage: 1,
        orderSize: 10,
        orderTotal: 0,
        orderSizes: [10, 20, 50, 100],
        exportLoading: false
      }
    },
    methods: {
      getRecordMachineList() {
        this.recordMachineListLoading = true
        fetchRecordMachineList(this.recordMachineSearch, this.page, this.size).then(response =>{
          this.recordMachineListLoading = false
          this.recordMachineList = response.response
          this.machine = response.response
          this.total = response.total
        })
      },

      getOffices() {
        fetchOfficeTree().then(response => {
          if (response.response) {
            this.offices = response.response[0].children
          }
        })
      },

      recordMachineHandleSizeChange(val) {
        this.size = val
        this.getRecordMachineList()
      },
      recordMachineHandleCurrentChange(val) {
        this.page = val
        this.getRecordMachineList()
      },

      //查询订单记录
      searchOrder(row, event) {
        this.activeName = 'orderList';
        this.currentMachineId = row.id;
        this.machine = {
          id:row.id,
          machineName: row.machineName,
          officeName: row.officeName,
          regionName: row.regionName,
          companyName: row.companyName,
          address: row.address,
          note: row.note,
          preAddress: row.preAddress,
          machineStatus: this.recordMachineSearch.machineStatus,
          dateTime:this.recordMachineSearch.dateTime,
          officeId: this.recordMachineSearch.officeId,
          regionId: this.recordMachineSearch.regionId,
          companyId: this.recordMachineSearch.companyId,
        }
        this.orderListLoading = true;
        this.selectOrderList()
      },

      selectOrderList(){
        fetchOrderList(this.machine, this.orderPage, this.orderSize).then(response => {
          if (response.response != null) {
            this.orderList = response.response;
            this.orderTotal = response.total;
          } else {
            this.orderList = [];
          }
          this.orderListLoading = false;
          this.contentShow = true;
        });
      },

      getOrderDetail(row, event) {
        if(row.orderType ==='充值订单'){
          this.$message({
            showClose: true,
            message: '充值订单没有商品详情！！！',
            duration: 3000,
            type: 'warning'
          });
          return false;
        }
        this.currentOrderId = row.id;
        this.orderBuyerInfo = {
          orderId: this.currentOrderId,
          mobile: row.mobile,
          createdDate: row.createdDate,
          paidDate: row.paidDate
        };
        this.orderDetailDialogShow = true;
        this.orderDetailLoading = true;
        fetchOrderDetailList(this.currentOrderId).then(response => {
          this.orderDetailLoading = false;
          this.orderDetailList = response.response;
          this.contentShow = true;
          this.tipsShow = false;
        })
      },

      handleSizeChange(val) {
        this.orderSize = val;
        this.selectOrderList(this.currentMachineId)
      },

      handleCurrentChange(val) {
        this.orderPage = val;
        this.selectOrderList(this.currentMachineId)
      },

      handleChange(value) {
        if (value[0]) {
          this.recordMachineSearch.companyId = value[0]
        }else{
          this.recordMachineSearch.companyId = ''
        }
        if (value[1]) {
          this.recordMachineSearch.regionId = value[1]
        }else{
          this.recordMachineSearch.regionId = ''
        }
        if (value[2]) {
          this.recordMachineSearch.officeId = value[2]
        }else{
          this.recordMachineSearch.officeId = ''
        }
      },
      //若是没有选中订单则提示用户
      selectTab(va) {
        if(va.name == "orderList") {
          if(this.currentMachineId == '') {
            this.contentShow = false;
          } else {
            this.contentShow = true;
          }
        }
      },

      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                if(index===6 || index===7){
                  return prev + curr
                }else{
                  return (Number(prev) + Number(curr)).toFixed(2)
                }
              } else {
                if(index===6 || index===7){
                  return prev
                }else{
                  return (Number(prev)).toFixed(2);
                }
              }
            }, 0);
            if(index===6 || index===7){
              sums[index] += ' 单';
            }else{
              sums[index] += ' 元';
            }
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      getRecordMachineExcel() {
        if (this.recordMachineList == '') {
          this.$message({
            showClose: true,
            message: '没有可导出的数据',
            duration: 3000,
            type: 'warning'
          });
        } else {
          this.exportLoading = true
          fetchRecordMachine(this.recordMachineSearch).then(response => {
            this.exportLoading = false
            if(response.response === '') {
              this.$message({
                showClose: true,
                message: '获取excel失败',
                duration: 3000,
                type: 'warning'
              });
            } else {
              var machineExcel = document.getElementById('getExcel');
              //console.log(response.response);
              machineExcel.setAttribute("href",response.response[0]);
              machineExcel.setAttribute("download", response.response[1]);
              machineExcel.click();
            }
          })
        }
      },
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
