<template>
  <div style="margin: 1% 2%;">
        <el-form :model="recordOrderSearch" class="demo-form-inline" label-width="70px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="机构" label-width="50px">
                <el-cascader
                  :options="offices"
                  v-model="recordOrderSearch.officeIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  style="width: 100%"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="设备名称">
                <el-input v-model="recordOrderSearch.machineName" placeholder="设备名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="商品名称">
                <el-input v-model="recordOrderSearch.productName" placeholder="商品名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="时间" prop="dateTime" label-width="50px">
                <el-date-picker
                  v-model="recordOrderSearch.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  placeholder="选择时间范围"
                  align="right"  style="width:100%">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="条形码" label-width="60px">
                <el-input v-model="recordOrderSearch.barCode" placeholder="商品条形码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="品类" label-width="50px">
                <el-select v-model="recordOrderSearch.categoryId" filterable clearable placeholder="选择品类" >
                  <el-option v-for="category in categorys" :key="category.id" :label="category.categoryName" :value="parseInt(category.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label-width="0">
                <el-button type="primary" icon="el-icon-search" round @click="getRecordOrderList">查询</el-button>
                <el-button @click="getRecordOrderExcel" style="margin-right: 0" icon="el-icon-share" round :loading="exportLoading">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="multipleTable"
          v-loading="recordOrderListLoading"
          :data="recordOrderList"
          :border="hasBorder"
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <recordOrderDetail :recordOrder="props.row"></recordOrderDetail>
            </template>
          </el-table-column>
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
            prop="productName"
            label="商品名称"
            sortable>
          </el-table-column>

          <el-table-column
            prop="tasteName"
            label="商品口味"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="categoryName"
            label="商品品类">
          </el-table-column>

          <el-table-column
            prop="mobile"
            label="顾客手机号"
            sortable>
          </el-table-column>

          <el-table-column
            prop="paidType"
            label="支付类型">
          </el-table-column>

          <el-table-column
            prop="status"
            label="订单状态">
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
        <a id="getExcel" style="display: none"></a>
  </div>
</template>

<script>
  import { fetchRecordOrderList,fetchRecordOrder,GetDateDiff,dealDateTime,dealDate } from 'api/recordOrder';
  import { fetchOfficeTree } from 'api/office';
  import { fetchCategoryList } from 'api/category';
  import recordOrderDetail from './recordOrderDetail'

  export default {
    created() {
      this.getRecordOrderList()
      this.getOffices()
      this.getCategory()
    },
    components: {
      recordOrderDetail
    },
    data() {
      return {
        recordOrderSearch:{
          machineName:'',
          productName:'',
          barCode:'',
          categoryId: '',
          mobile:'',
          dateTime:'',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: []
        },
        recordOrderList:[],
        recordOrderListLoading: false,
        exportLoading: false,
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
        contentShow: true,
        tipsShow: false,
        categorys:[],
        recordOrder: {
          paidDate: '',
          orderInfoId: '',
          status: '',
          mobile: '',
          machineId: '',
          machineName: '',
          companyName: '',
          regionName: '',
          officeName: '',
          preAddress: '',
          address: '',
          barCard:'',
          productId: '',
          productName: '',
          shelfLife: '',
          categoryName: '',
          count: '',
          productSalePrice: '',
          orderSalePrice: '',
          totalPrice: '',
          paidType: '',
          purchasePrice: '',
          grossProfit: ''
        },
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
      }
    },
    methods: {
      getCategory() {
        fetchCategoryList({},1,100000).then(response =>{
          this.categorys = response.response
        })
      },
      getRecordOrderList() {
        this.recordOrderListLoading = true
        fetchRecordOrderList(this.recordOrderSearch, this.page, this.size).then(response =>{
          this.recordOrderListLoading = false
          this.recordOrderList = response.response
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

      handleSizeChange(val) {
        this.size = val;
        this.getRecordOrderList()
      },

      handleCurrentChange(val) {
        this.page = val;
        this.getRecordOrderList()
      },

      handleChange(value) {
        if (value[0]) {
          this.recordOrderSearch.companyId = value[0]
        }else{
          this.recordOrderSearch.companyId = ''
        }
        if (value[1]) {
          this.recordOrderSearch.regionId = value[1]
        }else{
          this.recordOrderSearch.regionId = ''
        }
        if (value[2]) {
          this.recordOrderSearch.officeId = value[2]
        }else{
          this.recordOrderSearch.officeId = ''
        }
      },
      getRecordOrderExcel() {
        if (this.recordOrderList == '') {
          this.$message({
            showClose: true,
            message: '没有可导出的数据',
            duration: 3000,
            type: 'warning'
          });
        } else {
          if(this.recordOrderSearch.dateTime === ''){
            this.$message({
              showClose: true,
              message: '导出请选择时间范围才能导出！',
              duration: 3000,
              type: 'warning'
            });
            return false;
          }else{
            var beginDate, endDate
            beginDate = dealDateTime(this.recordOrderSearch.dateTime[0]);
            endDate = dealDateTime(this.recordOrderSearch.dateTime[1]);
            if(!beginDate){
              this.$message({
                showClose: true,
                message: '导出请选择时间范围才能导出！',
                duration: 3000,
                type: 'warning'
              });
              return false;
            }
            var bool = dealDate(beginDate,endDate)
            if(bool === false){
              this.$message({
                showClose: true,
                message: '导出数据最多间隔32天的数据量！',
                duration: 3000,
                type: 'warning'
              });
              return false;
            }else{
              this.exportLoading = true
              fetchRecordOrder(this.recordOrderSearch).then(response => {
                this.exportLoading = false
                if(response.response === '') {
                  this.$message({
                    showClose: true,
                    message: '获取excel失败',
                    duration: 3000,
                    type: 'warning'
                  });
                } else {
                  var orderExcel = document.getElementById('getExcel');
                  orderExcel.setAttribute("href", response.response[0]);
                  orderExcel.setAttribute("download", response.response[1]);
                  orderExcel.click();
                }
              })
            }
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
