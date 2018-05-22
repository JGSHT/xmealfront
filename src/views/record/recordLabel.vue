<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="selectTab">
      <el-tab-pane name="productList">
        <span slot="label">设备列表</span>
        <el-row :gutter="20">
        <el-form :inline="true" :model="recordLableSearch" label-width="70px" class="demo-form-inline">
          <el-col :span="7">
          <el-form-item label="商品标签">
            <el-select v-model="recordLableSearch.labelId" filterable clearable placeholder="选择标签" style="width: 120%;">
              <el-option v-for="label in labels" :key="label.id" :label="label.labelName" :value="parseInt(label.id)"></el-option>
            </el-select>
          </el-form-item>
          </el-col>

          <el-col :span="7">
          <el-form-item label="设备名称">
            <el-input v-model="recordLableSearch.machineName" placeholder="设备名称" style="width:120%"></el-input>
          </el-form-item>
          </el-col>

          <el-col :span="5">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" round @click="getRecordLabelList">查询</el-button>
            <el-button @click="getRecordLabelExcel" icon="el-icon-share" round style="margin-right: 0" :loading="exportLoading">导出</el-button>
          </el-form-item>
          </el-col>
        </el-form>
        </el-row>
        <el-tooltip class="item" effect="dark" content="双击设备展示各标签喜好人数详情" placement="top-end">

          <el-table
            border
            stripe
            v-loading.body="recordLabelListLoading"
            highlight-current-row
            :data="recordLabelList"
            @row-dblclick="searchMachine"
            show-summary
            :summary-method="getSummaries"
            style="width: 100%">
            <!--<el-table-column
              prop="machineId"
              label="设备ID"
              align="center">
            </el-table-column>-->
            <el-table-column
              prop="machineName"
              label="设备名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="labelName"
              label="商品标签名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="count"
              sortable
              label="喜好人数"
              align="center"
              >
            </el-table-column>
          </el-table>
        </el-tooltip>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="recordLabelHandleSizeChange"
            @current-change="recordLabelHandleCurrentChange"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </p>
      </el-tab-pane>
      <a id="getExcel" style="display: none"></a>
      <el-tab-pane name="machineLabelList">
        <span slot="label">设备标签统计</span>
        <el-alert v-if="!currentMachineId" :closable="false"
                  title="请选择一台设备,才能查看更多信息！！！" type="warning">
        </el-alert>
        <el-card class="box-card" style="margin-top:10px" v-if="currentMachineId">
          <div v-show="contentShow">
            <el-table v-if="machineLabelList"
                      v-loading.body="machineLabelListLoading"
                      :data="machineLabelList"
                      stripe
                      highlight-current-row
                      border
                      style="width: 100%;">
              <el-table-column prop="labelId" label="商品标签ID" align="center"></el-table-column>
              <el-table-column prop="labelName" label="商品标签名称" align="center" ></el-table-column>
              <el-table-column prop="count" label="喜好人数" align="center"></el-table-column>
            </el-table>
            <p class="block" style="float:right; "  v-if="machineLabelList">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="labelPage"
                :page-sizes="labelSizes"
                :page-size="labelSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="labelTotal">
              </el-pagination>
            </p>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchRecordLabelList, fetchMachineLabelList, fetchRecordLabel } from 'api/recordLabel';
  import { fetchBrandLabelList } from 'api/brandLabel';

  export default {
    created() {
      this.getRecordLabelList()
      this.getLabel()
    },
    data() {
      return {
        activeName:'productList',
        recordLableSearch:{
          machineId:'',
          machineName: '',
          labelId: '',
          labelName: ''
        },
        recordLabelList:[],
        recordLabelListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        labels: [],
        /*recordProduct: {
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
        },*/
        hasBorder : true,
        machineLabelList: [],
        contentShow: true,
        /*tipsShow: false,*/
        machineLabelListLoading: false,
        currentMachineId: '',
        labelPage: 1,
        labelSize: 10,
        labelTotal: 0,
        labelSizes: [10, 20, 50, 100],
        exportLoading: false,
      }
    },
    methods: {
      getLabel() {
        fetchBrandLabelList({},1,100000).then(response =>{
          this.labels = response.response
        })
      },
      getRecordLabelList() {
        this.recordLabelListLoading = true
        this.recordLableSearch.labelName = ''
        if (this.recordLableSearch.labelId) {
          this.recordLableSearch.labelName = this.labels.find((item) => {
            return item.id === this.recordLableSearch.labelId
          }).labelName
        }
        fetchRecordLabelList(this.recordLableSearch, this.page, this.size).then(response =>{
          this.recordLabelListLoading = false
          this.recordLabelList = response.response
          console.log("this.total==="+ response.total)
          this.total = response.total
        })
      },

      recordLabelHandleSizeChange(val) {
        this.size = val
        this.getRecordLabelList()
      },
      recordLabelHandleCurrentChange(val) {
        this.page = val
        this.getRecordLabelList()
      },

      handleSizeChange(val) {
        this.labelSize = val;
        this.selectLabelList(this.currentMachineId)
      },

      handleCurrentChange(val) {
        this.labelPage = val;
        this.selectLabelList(this.currentMachineId)
      },

      //统计同一设备所有标签喜好人数
      searchMachine(row, event) {
        this.activeName = 'machineLabelList';
        this.currentMachineId = row.machineId;
        this.machineLabelListLoading = true;
        this.selectLabelList(row.machineId)
      },

      selectLabelList(id){
        fetchMachineLabelList(id, this.labelPage, this.labelSize).then(response => {
          if (response.response != null) {
            this.machineLabelList = response.response;
            this.labelTotal = response.total;
          } else {
            this.machineLabelList = [];
          }
          this.machineLabelListLoading = false;
          this.contentShow = true;
        });
      },

      //若是没有选择设备则提示用户
      selectTab(va) {
        if (va.name == "machineLabelList") {
          if (this.currentMachineId == '') {
            this.contentShow = false;
          } else {
            this.contentShow = true;
          }
        }
      },
      getRecordLabelExcel() {
        if (this.recordLableSearch.labelName === '') {
          this.$message({
            showClose: true,
            message: '请选择商品标签并查询',
            duration: 3000,
            type: 'warning'
          });
        } else if (this.recordLabelList == '') {
          this.$message({
            showClose: true,
            message: '没有可导出的数据',
            duration: 3000,
            type: 'warning'
          });
        } else {
          this.exportLoading = false
          fetchRecordLabel(this.recordLableSearch).then(response => {
            this.exportLoading = true
            if (response.response === '') {
              this.$message({
                showClose: true,
                message: '获取excel失败',
                duration: 3000,
                type: 'warning'
              });
            } else {
              console.log('7777########')
              var oGetExcel = document.getElementById('getExcel');
              console.log(response.response);
              oGetExcel.setAttribute("href", response.response[0]);
              oGetExcel.setAttribute("download", response.response[1]);
              oGetExcel.click();
              this.exportLoading = false
            }
          })
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
          if (index === 1) {
            sums[index] = ' ';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 个';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      }
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
