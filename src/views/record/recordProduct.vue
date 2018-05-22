<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="selectTab">
      <el-tab-pane name="productList">
        <span slot="label">商品列表</span>
        <el-form :model="recordProductSearch" class="demo-form-inline" label-width="70px" label-position="left">
          <el-input v-show="false" v-model="recordProductSearch.id"></el-input>
          <el-row :gutter="20">
            <el-col  :span="10">
              <el-form-item label="机构" label-width="50px">
                <el-cascader
                  :options="offices"
                  v-model="recordProductSearch.officeIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  style="width: 100%;"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备名称" >
                <el-input v-model="recordProductSearch.machineName" placeholder="设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品名称">
                <el-input v-model="recordProductSearch.productName" placeholder="商品名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="时间" prop="dateTime" label-width="50px">
                <el-date-picker
                  v-model="recordProductSearch.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品类" label-width="50px">
                <el-select v-model="recordProductSearch.categoryId" filterable clearable placeholder="选择品类">
                  <el-option v-for="category in categorys" :key="category.id" :label="category.categoryName" :value="parseInt(category.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="getRecordProductList">查询</el-button>
                <el-button @click="getRecordProductExcel" icon="el-icon-share" round style="margin-right: 0" :loading="exportLoading">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-tooltip class="item" effect="dark" content="双击商品展示详情" placement="top-end">
          <el-table
            ref="multipleTable"
            v-loading="recordProductListLoading"
            :data="recordProductList"
            @row-dblclick="searchOrder"
            :border="hasBorder"
            :summary-method="getSummaries"
            show-summary
            stripe
            tooltip-effect="dark">
            <el-table-column
              prop="id"
              label="商品ID"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="商品名称"
              show-overflow-tooltip>
            </el-table-column>

            <el-table-column
              prop="categoryName"
              label="商品分类"
              show-overflow-tooltip>
            </el-table-column>

            <el-table-column
              prop="buyOrder"
              label="销售金额"
              show-overflow-tooltip>
            </el-table-column>

            <el-table-column
              prop="saleCount"
              label="商品销量"
              show-overflow-tooltip>
            </el-table-column>

            <el-table-column
              prop="orderCount"
              label="订单数"
              show-overflow-tooltip>
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
            @size-change="recordProductHandleSizeChange"
            @current-change="recordProductHandleCurrentChange"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </p>
      </el-tab-pane>
      <a id="getExcel" style="display: none"></a>
      <el-tab-pane name="orderList">
        <span slot="label">商品详细信息</span>
        <el-alert v-if="!currentProductId" :closable="false"
                  title="请选择一台商品,才能查看更多信息！！！" type="warning">
        </el-alert>
        <el-card class="box-card" v-if="currentProductId">
          <el-form label-position="left" inline label-width="80px" class="record-table-expand">

            <el-form-item label="商品编号" style="width: 30%">
              <span>{{ product.id }}</span>
            </el-form-item>
            <el-form-item label="商品名称" style="width: 30%">
              <span>{{ product.productName }}</span>
            </el-form-item>
            <el-form-item label="商品分类" style="width: 30%">
              <span>{{ product.categoryName }}</span>
            </el-form-item>
            <el-form-item label="销售金额" style="width: 30%">
              <span>{{ product.buyOrder }}</span>
            </el-form-item>
            <el-form-item label="商品销量" style="width: 30%">
              <span>{{ product.saleCount }}</span>
            </el-form-item>
            <el-form-item label="订单数" style="width: 30%">
              <span>{{ product.orderCount }}</span>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top:10px" v-if="currentProductId">
          <div v-show="contentShow">
            <el-table v-if="orderList"
                      v-loading.body="orderListLoading"
                      :data="orderList"
                      stripe
                      highlight-current-row
                      :border="hasBorder"
                      style="width: 100%;">
              <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
              <el-table-column prop="mobile" label="顾客手机号" align="center" ></el-table-column>
              <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
              <el-table-column prop="totalPrice" label="总价" align="center" ></el-table-column>
              <el-table-column prop="orderType" label="订单类型" align="center" ></el-table-column>
              <el-table-column prop="status" label="订单状态" align="center" ></el-table-column>
              <el-table-column prop="paidPrice" label="支付金额" align="center" ></el-table-column>
              <el-table-column prop="paidType" label="支付类型" align="center" ></el-table-column>
              <div style="display: none" prop="createdDate"></div>
            </el-table>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchRecordProductList,fetchProductList,fetchRecordProduct } from 'api/recordProduct';
  import { fetchOfficeTree } from 'api/office';
  import { fetchCategoryList } from 'api/category';

  export default {
    created() {
      this.getRecordProductList()
      this.getCategory()
      this.getOffices()
    },
    data() {
      return {
        activeName:'productList',
        recordProductSearch:{
          id:'',
          machineName:'',
          productName:'',
          barCode:'',
          dateTime:'',
          categoryId: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: []
        },
        recordProductList:[],
        recordProductListLoading: false,
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
        categorys:[],
        filterText: '',
        recordProduct: {
          productName: '',
          officeName: '',
          regionName: '',
          companyName: '',
          buyOrder: '',
          rechargeOrder: '',
          buyOrderCount: '',
          rechargeOrderCount: '',
          buyUnitPrice: '',
          rechargeUnitPrice: ''
        },
        hasBorder : true,
        orderList: [],
        contentShow: true,
        tipsShow: false,
        orderListLoading: false,
        currentProductId:'',
        orderPage: 1,
        orderSize: 10,
        orderTotal: 0,
        orderSizes: [10, 20, 50, 100],
        product:{},
        exportLoading: false,
        recordProductSearch2:{
          id:'',
          machineName:'',
          productName:'',
          barCode:'',
          dateTime:'',
          categoryId: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: []
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
          },{
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
      getCategory() {
        fetchCategoryList({},1,100000).then(response =>{
          this.categorys = response.response
        })
      },
      getRecordProductList() {
        this.recordProductListLoading = true
        fetchRecordProductList(this.recordProductSearch, this.page, this.size).then(response =>{
          this.recordProductListLoading = false
          this.recordProductList = response.response
          //console.log("this.total==="+ response.total)
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

      handleChange(value) {
        if (value[0]) {
          this.recordProductSearch.companyId = value[0]
        }else{
          this.recordProductSearch.companyId = ''
        }
        if (value[1]) {
          this.recordProductSearch.regionId = value[1]
        }else{
          this.recordProductSearch.regionId = ''
        }
        if (value[2]) {
          this.recordProductSearch.officeId = value[2]
        }else{
          this.recordProductSearch.officeId = ''
        }
      },

      recordProductHandleSizeChange(val) {
        this.size = val
        this.getRecordProductList()
      },
      recordProductHandleCurrentChange(val) {
        this.page = val
        this.getRecordProductList()
      },

      handleSizeChange(val) {
        this.orderSize = val;
        this.selectOrderList(this.currentProductId)
      },

      handleCurrentChange(val) {
        this.orderPage = val;
        this.selectOrderList(this.currentProductId)
      },

      //查询订单记录
      searchOrder(row, event) {
        this.activeName = 'orderList';
        this.currentProductId = row.id;
        this.product = {
          id:row.id,
          productName: row.productName,
          buyOrder: row.buyOrder,
          categoryName: row.categoryName,
          saleCount: row.saleCount,
          orderCount: row.orderCount,
          machineName: this.recordProductSearch.machineName,
          dateTime: this.recordProductSearch.dateTime,
          companyId: this.recordProductSearch.companyId,
          regionId: this.recordProductSearch.regionId,
          officeId: this.recordProductSearch.officeId,
          pid: row.id,
        }
        this.orderListLoading = true;
        this.selectOrderList()
      },

      selectOrderList(){
        fetchProductList(this.product, this.orderPage, this.orderSize).then(response => {
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
                if(index===2 || index===6) {
                  return (Number(prev) + Number(curr)).toFixed(2);
                }else{
                  return prev + curr
                }
              } else {
                return prev
              }
            }, 0);

            if(index===3){
              sums[index] += ' 件';
            }else if(index===4){
              sums[index] += ' 单';
            }else if(index===5){
              sums[index] += '';
            }else {
              sums[index] += ' 元';
            }
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      //若是没有选中订单则提示用户
      selectTab(va) {
        if(va.name == "orderList") {
          if(this.currentProductId == '') {
            this.contentShow = false;
          } else {
            this.contentShow = true;
          }
        }
      },
      getRecordProductExcel() {
        if (this.recordProductList == '') {
          this.$message({
            showClose: true,
            message: '没有可导出的数据',
            duration: 3000,
            type: 'warning'
          });
        } else {
          this.exportLoading = false
          fetchRecordProduct(this.recordProductSearch).then(response => {
            this.exportLoading = false
            if(response.response === '') {
              this.$message({
                showClose: true,
                message: '获取excel失败',
                duration: 3000,
                type: 'warning'
              });
            } else {
              var oGetExcel = document.getElementById('getExcel');
              //console.log(response.response);
              oGetExcel.setAttribute("href", response.response[0]);
              oGetExcel.setAttribute("download", response.response[1]);
              oGetExcel.click();
            }
          })
        }
      }
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
