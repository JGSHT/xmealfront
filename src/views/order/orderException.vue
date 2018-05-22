<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="selectTab">
      <el-tab-pane name="orderAllList">

        <span slot="label"><i class="el-icon-document"></i> 订单列表</span>
        <el-form :model="orderSearchForm" ref="orderSearchForm" class="demo-form-inline" label-width="75px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="订单号" prop="orderId" label-width="18%">
                <input v-model="orderSearchForm.orderId"
                       placeholder="请输入订单号"
                       class="el-input__inner"
                       @input="checkNum(orderSearchForm.orderId)"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="orderSearchForm.machineName" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="商品名称" prop="productNameForSearch">
                <el-input v-model="orderSearchForm.productNameForSearch" placeholder="请输入商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间" prop="dateTime" label-width="9%">
                <div class="block">
                  <el-date-picker
                    v-model="orderSearchForm.dateTime"
                    type="datetimerange"
                    :picker-options="pickerOption"
                    placeholder="请选择时间范围"
                    align="right"
                    style="width:80%">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="手机号" prop="mobile" label-width="18%">
                <el-input type="text" v-model="orderSearchForm.mobile" placeholder="请输入顾客手机号"
                          pattern="^[0-9]*[1-9][0-9]*$"
                          :maxlength="11" v-on:blur="checkMobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="订单状态" prop="status">
                <el-select v-model="orderSearchForm.status" clearable placeholder="请选择订单状态" style="width:100%">
                  <el-option
                    v-for="item in orderStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="机构" prop="parentIdList" label-width="15%">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="orderSearchForm.parentIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构"
                  style="width:100%"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="search">查询</el-button>
                <el-button icon="el-icon-delete" round @click="resetForm">重置</el-button>
                <el-button icon="el-icon-share" round @click="exportExcel" :loading="exportExcelLoading">导出Excel</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-tooltip class="item" effect="dark" content="双击订单展示详情" placement="top-end">
          <el-table
            v-loading.body="orderListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="orderList"
            stripe
            highlight-current-row
            ref="refOrderList"
            :border="hasBorder"
            show-summary
            :summary-method="getOrderSummaries"
            @row-dblclick="getOrderDetail"
            style="width: 100%;">
            <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
            <el-table-column prop="mobile" label="顾客手机号" align="center"></el-table-column>
            <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
            <el-table-column prop="preDiscountPrice" label="折前价" align="center"
                             :formatter="formatterPreDiscountPrice"></el-table-column>
            <el-table-column prop="status" label="订单状态" align="center" :formatter="formatterStatus"></el-table-column>
            <el-table-column prop="isException" label="是否异常" align="center" :formatter="formatterIsException"></el-table-column>
            <el-table-column prop="totalPrice" label="折后价" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="" label="理论金额" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="paidPrice" label="支付金额" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="paidType" label="支付类型" align="center"
                             :formatter="formatterPaidType"></el-table-column>
            <el-table-column prop="weight" label="理论重量" align="center" :formatter="formatterWeight"></el-table-column>
            <el-table-column prop="actualWeight" label="实际重量" align="center" :formatter="formatterWeight"></el-table-column>
            <el-table-column label="操作" align="center">
              <template  slot-scope="scope">
                <el-button
                  v-if="scope.row.status=='1' && scope.row.isException=='-1'"
                  size="small"
                  type="text"
                  @click="updateByTotalPrice(scope.$index, scope.row)">修改价格
                </el-button>
                <el-button
                  v-if="scope.row.status=='2' && scope.row.isException=='1'"
                  size="small"
                  type="text"
                  @click="repairOrderDialog(scope.$index, scope.row)">补单
                </el-button>
                <!--<el-button
                  v-if="scope.row.videoUrl"
                  size="small"
                  type="text"
                  @click="showVideoUrl(scope.$index, scope.row)">视频
                </el-button>-->
                <a v-if="scope.row.videoUrl" :href="scope.row.videoUrl" target="_Blank"><font color="#4db3ff">视频</font></a>
              </template>
            </el-table-column>
            <div style="display: none" prop="createdDate"></div>
          </el-table>
        </el-tooltip>

        <p class="block" style="float:right; ">
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
        <el-dialog title="修改订单金额" :visible.sync="orderInfoDialogShow">
          <div style="align-content:center">
            <el-form :model="orderInfo"
                     ref="orderInfoForm"
                     :rules="orderInfoRules"
                     v-loading="orderInfoLoading">
              <el-form-item prop="id" v-show="false">
                <el-input type="text" v-model="orderInfo.id"></el-input>
              </el-form-item>
              <el-form-item prop="status" v-show="false">
                <el-input type="text" v-model="orderInfo.status"></el-input>
              </el-form-item>
              <el-form-item label="订单金额" prop="totalPrice">
                <el-input type="number" v-model="orderInfo.totalPrice" placeholder="订单金额"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveOrderInfo(orderInfo)" :loading="saveOrderInfoLoading">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="订单差价补单" :visible.sync="repairOrderDialogShow">
          <div style="align-content:center;">
            <el-form :model="repairOrder" ref="repairOrderForm" :rules="repairOrderRules"
                     v-loading="repairOrderLoading">
              <el-form-item prop="id" v-show="false">
                <el-input type="text" v-model="repairOrder.id"></el-input>
              </el-form-item>
              <el-form-item label="商品个数" prop="count">
                <el-input style="width: 480px;" type="number" v-model="repairOrder.count" focus="this.value=this.value.replace(/[^1-9]/g,'')" placeholder="商品个数"></el-input>
              </el-form-item>
              <el-form-item>
                <p><font color="red">补单时商品单价默认是0.1元</font></p>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveRepairOrder(repairOrder)" :loading="saveRepairOrderLoading">确定</el-button>
            <el-button @click="cancelRepairOrder">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="视频" :visible.sync="videoDialogShow" :close="resetShowVideoUrl">
          <div align="center">
            <el-form :model="videoUrl" ref="showVideoUrlForm">
              <el-form-item>
                <video controls autobuffer id="videoUrl1">
                  <source type="video/mp4" :src="videoUrl">
                  <source type="video/ogg" :src="videoUrl">
                  <source type="video/webm" :src="videoUrl">
                  <object :data="videoUrl">
                    <embed :src="videoUrl">
                  </object>
                </video>
              </el-form-item>
            </el-form>
          </div>
            <!--<video>
              <source src="videoUrl" />
            </video>-->

        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="orderDetail">
        <span slot="label"><i class="el-icon-edit"></i> 订单详情</span>
        <div v-show="tipsShow" style="text-align: center; display: block">
          <span style="margin: 0 auto">请先选择订单</span>
        </div>
        <div v-show="contentShow">
          <el-card class="box-card" style="margin-top: 5px;">
            <el-form label-position="left" inline>
              <el-row :gutter="1" style="height: 50px">
                <el-col :span="4">
                  <el-form-item label="订单号:" style="line-height: 50px">
                    <span style="line-height: 50px"> {{orderBuyerInfo.orderId}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="支付金额:" style="line-height: 50px">
                    <span style="line-height: 50px"> {{orderBuyerInfo.paidPrice}}元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="顾客联系方式:" style="line-height: 50px">
                    <span style="line-height: 50px">{{orderBuyerInfo.mobile}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6" style="height: 50px;">
                  <el-form-item label="下单时间:" style="line-height: 50px">
                    <span
                      style="line-height: 50px">{{ orderBuyerInfo.createdDate ? orderBuyerInfo.createdDate.substring(0, orderBuyerInfo.createdDate.length - 2) : ''}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="付款时间:" style="line-height: 50px">
                    <span
                      style="line-height: 50px">{{ orderBuyerInfo.paidDate ? orderBuyerInfo.paidDate.substring(0, orderBuyerInfo.paidDate.length - 2) : ''}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

          </el-card>

          <el-table class="box-card"
                    v-loading.body="orderDetailLoading"
                    element-loading-text="小喵使出了洪荒之力为您加载。。。"
                    :data="orderDetailList"
                    stripe
                    show-summary
                    :summary-method="getDetailSummaries"
                    style="width: 100%;">
            <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="count" label="购买量" align="center"></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价" align="center"
                             :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="salePrice" label="商品原价" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="preDiscountPrice" label="商品售价" align="center"
                             :formatter="formatterMoney"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>

  import {fetchOfficeTree} from "../../api/office";
  import {fetchOrderDetailList, fetchOrderList, getExcel,fetchUpdateByTotalPrice,fetchSaveRepairOrder} from "../../api/order";

  export default {
    created() {
      this.search();
      this.fetchOfficeCasc();
    },
    data() {
      return {
        orderSearchForm: {
          parentIdList: [],
          machineName: '',
          productNameForSearch: '',
          createdDate: '',
          orderId: '',
          mobile: '',
          dateTime: '',
          companyId: '',
          regionId: '',
          officeId: '',
          status: ''
        },
        offices: [],
        orderList: [],
        orderDetailList: [],
        //分页
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        //标签页
        activeName: 'orderAllList',
        //记录当前选中的订单编号
        currentOrderId: '',
        hasBorder: true,
        contentShow: true,
        tipsShow: false,
        //初始化时间快捷选项
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
        },
        orderStatus: [{
          value: '3',
          label: '全部'
        }, {
          value: '2',
          label: '已支付'
        }, {
          value: '1',
          label: '未支付'
        }],
        isException: [{
          value: '-1',
          label: '异常订单'
        },{
            value: '1',
            label: '异常订单'
        },{
          value: '2',
          label: '正常订单'
        }],
        orderBuyerInfo: {},
        orderListLoading: false,
        orderDetailLoading: false,
        exportExcelLoading: false,
        officeDisabled: false,
        orderInfoDialogShow: false,
        orderInfoLoading: false,
        saveOrderInfoLoading: false,
        orderInfo: {
          id: '',
          status: '',
          totalPrice: ''
        },
        orderInfoRules: {
          totalPrice: [
            { required: true, message: '请输入订单价格', trigger: 'blur' }
          ]
        },
        videoUrl:'',
        videoDialogShow: false,
        repairOrderDialogShow: false,
        repairOrderLoading: false,
        saveRepairOrderLoading: false,
        repairOrder: {
          id: '',
          count: ''
        },
        repairOrderRules: {
          count: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if ((/^[1-9]\d*$/.test(value) == false)) {
                  callback(new Error("商品数量请输入正整数"));
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
      //查询订单记录
      search() {
        this.orderListLoading = true;
        fetchOrderList(this.orderSearchForm, this.page, this.size).then(response => {
          if (response.response != null) {
            this.orderList = response.response;
            this.total = response.total;
          } else {
            this.orderList = [];
          }
          this.orderListLoading = false;
        });
      },
      exportExcel() {
        this.exportExcelLoading = true;
        getExcel(this.orderSearchForm).then(response => {
          this.exportExcelLoading = false;
          if (response.code === 0 && response.response != undefined && response.response != null) {
            let oGetExcel = document.getElementById('getExcel');
            oGetExcel.setAttribute("href", response.response[0]);
            oGetExcel.setAttribute("download", response.response[1]);
            oGetExcel.click();
          } else {
            this.$notify.info({
              title: '导出Excel',
              message: response.desc,
              duration: 3000
            });
          }
        });
      },
      //重置表单
      resetForm() {
        this.$refs['orderSearchForm'].resetFields();
      },
      //初始化机构
      fetchOfficeCasc() {
        fetchOfficeTree().then(response => {
          if (response.code === 0 && response.response) {
            this.offices = response.response[0].children;
          }
        });
      },
      //去除输入的非数字
      checkMobile() {
        this.orderSearchForm.mobile = (this.orderSearchForm.mobile).replace(/[^0-9]/ig, "");
      },
      //处理输入非数字
      checkNum(val) {
        this.orderSearchForm.orderId = val.replace(/[^\d]/g, '');
      },
      handleSizeChange(val) {
        this.size = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      getOrderDetail(row, event) {
        this.activeName = 'orderDetail';
        this.currentOrderId = row.id;
        this.orderBuyerInfo = {
          orderId: this.currentOrderId,
          mobile: row.mobile,
          createdDate: row.createdDate,
          paidDate: row.paidDate,
          paidPrice: row.paidPrice
        };
        this.orderDetailLoading = true;
        fetchOrderDetailList(this.currentOrderId).then(response => {
          this.orderDetailLoading = false;
          this.orderDetailList = response.response;
          this.contentShow = true;
          this.tipsShow = false;
        })
      },
      //若是没有选中订单则提示用户
      selectTab(va) {
        if (va.name == "orderDetail") {
          if (this.currentOrderId == '') {
            this.contentShow = false;
            this.tipsShow = true;
          } else {
            this.contentShow = true;
            this.tipsShow = false;
          }
        }
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元';
        } else {
          return cellValue;
        }
      },
      formatterStatus(row, column, cellValue) {
        if (cellValue) {
          if (cellValue === '1') {
            return '未付款';
          } else if (cellValue === '2') {
            return '已付款';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },
      formatterIsException(row, column, cellValue) {
        if (cellValue) {
          if (cellValue === -1) {
            return '异常订单';
          } else if (cellValue === 1) {
            return '异常订单';
          } else if (cellValue === 2) {
            return '正常订单';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },

      formatterWeight(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '克';
        } else {
          return cellValue;
        }
      },
      formatterPaidType(row, column, cellValue) {
        if (cellValue) {
          if (row.status === '2') {
            if (cellValue === '0') {
              return '余额支付';
            } else if (cellValue === '1') {
              return '微信支付';
            } else {
              return '其他支付方式';
            }
          } else {
            return '';
          }
        }
      },
      formatterPreDiscountPrice(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元'
        } else {
          if (row.totalPrice) {
            return row.totalPrice + '元';
          } else {
            return cellValue;
          }
        }
      },
      handleChange(value) {
        if (value[0]) {
          this.orderSearchForm.companyId = value[0]
        } else {
          this.orderSearchForm.companyId = ''
        }
        if (value[1]) {
          this.orderSearchForm.regionId = value[1]
        } else {
          this.orderSearchForm.regionId = ''
        }
        if (value[2]) {
          this.orderSearchForm.officeId = value[2]
        } else {
          this.orderSearchForm.officeId = ''
        }
      },
      //统计
      getDetailSummaries(param) {
        const {columns, data} = param;
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
                return (Number(prev) + Number(curr)).toFixed(2);
              } else {
                return prev;
              }
            }, 0);
            if (index !== 0 && index !== 1) {
              sums[index] += ' 元';
            } else if (index == 1) {
              sums[index] = parseInt(sums[index])
            }
          }
        });
        return sums;
      },
      getOrderSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index !== 0 && index !== 1 && index !== 2 && index !== 4 && index !== 5 && index !==9) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return (Number(prev) + Number(curr)).toFixed(2);
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 元';
            }
          }
          if (index ==10 || index===11) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return (Number(prev) + Number(curr)).toFixed(2);
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 克';
            }
          }
        });
        return sums;
      },
      resetOrderInfo1() {
        if (this.$refs['orderInfoForm']) {
          this.$refs['orderInfoForm'].resetFields();
        }
      },
      cancel() {
        this.resetOrderInfo1()
        this.orderInfoDialogShow = false
      },
      updateByTotalPrice(index, row) {
        this.orderInfo.id = row.id
        this.orderInfoDialogShow = true
      },
      saveOrderInfo(data) {
        this.saveOrderInfoLoading = true
        this.$refs['orderInfoForm'].validate((valid) => {
          if (valid) {
            fetchUpdateByTotalPrice(data).then(response => {
              if (response.code === 0) {
                this.saveOrderInfoLoading = false
                this.search()
                this.resetOrderInfo1()
                this.orderInfoDialogShow = false
              } else {
                this.orderInfoDialogShow = false
              }
            })
          } else {
            this.saveDealLoading = false
            return false
          }
        })
      },
      resetShowVideoUrl() {
        if (this.$refs['showVideoUrlForm']) {
          this.$refs['showVideoUrlForm'].resetFields();
        }
      },
      showVideoUrl (index, row){
        // console.log("row======="+ JSON.stringify(row))
        // console.log("row.videoUrl======="+ JSON.stringify(row.videoUrl))
        this.resetShowVideoUrl()
        this.videoUrl = row.videoUrl
        this.videoDialogShow = true
      },
      repairOrderDialog(index, row) {
        this.repairOrder.id = row.id
        this.repairOrderDialogShow = true
      },
      saveRepairOrder(data) {
        this.saveRepairOrderLoading = true
        this.$refs['repairOrderForm'].validate((valid) => {
          if (valid) {
            fetchSaveRepairOrder(data).then(response => {
              if (response.code === 0) {
                this.saveRepairOrderLoading = false
                this.search()
                this.resetRepairOrder()
                this.repairOrderDialogShow = false
              } else {
                this.repairOrderDialogShow = false
              }
            })
          } else {
            this.saveRepairOrderLoading = false
            return false
          }
        })
      },
      resetRepairOrder() {
        if (this.$refs['repairOrderForm']) {
          this.$refs['repairOrderForm'].resetFields();
        }
      },
      cancelRepairOrder() {
        this.resetRepairOrder()
        this.repairOrderDialogShow = false
      },
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
