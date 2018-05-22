<template>
  <el-tabs v-model="activeName">
    <el-tab-pane name="stockCountList">
      <span slot="label"><i class="el-icon-document"></i>区域商品列表</span>
  <div style="margin: 1% 2%;">
    <el-row :gutter="20">
      <el-form :inline="true" :model="stockCountForm"  class="demo-form-inline">


        <el-col :span="8">
          <el-form-item label="时间" prop="dateTime">
            <el-date-picker
              v-model="stockCountForm.dateTime"
              type="datetimerange"
              :picker-options="pickerOption"
              placeholder="请选择申请时间范围">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="大区列表">
            <el-select v-model="stockCountForm.companyId" @change="freshenCompany" filterable clearable placeholder="选择大区">
              <el-option v-for="company in companys" :key="company.id" :label="company.name"
                         :value="parseInt(company.id)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="设备列表">
            <el-select v-model="stockCountForm.machineId" @change="freshenMachine" filterable clearable placeholder="选择设备">
              <el-option v-for="machine in machines" :key="machine.id" :label="machine.machineName" :text="machine.machineName"
                         :value="parseInt(machine.id)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col >
          <el-form-item>
            <el-button type="primary" @click="findStockCountList" icon="search">查询</el-button>
          </el-form-item>
        </el-col>

        <el-col >
          <el-form-item style="margin-left: 0px;margin-right: 0px">
            <h3 v-if="this.stockCountForm.companyId == '' ">所有区域：
              亏损总数：{{this.allLossNumber}}个 亏损总进价：{{this.allLossPurchaseAmount}}￥ 亏损总售价：{{this.allLossSaleAmount}}￥</h3>
          </el-form-item>
          <el-form-item style="margin-left: 0px;">
            <h3 v-if="this.stockCountForm.companyId != '' ">{{this.companys.find(item => item.id === this.stockCountForm.companyId)['name']}}：
              亏损总数：{{this.allAreaLossNumber}}个 亏损总进价：{{this.allAreaLossPurchaseAmount}}￥ 亏损总售价：{{this.allAreaLossSaleAmount}}￥</h3>
          </el-form-item>
          <el-form-item>
            <h3 v-if="this.stockCountForm.machineId != '' ">{{this.machines.find(item => item.id === this.stockCountForm.machineId)['machineName']}}：
              亏损总数：{{this.allMachineLossNumber}}个 亏损总进价：{{this.allMachineLossPurchaseAmount}}￥ 亏损总售价：{{this.allMachineLossSaleAmount}}￥</h3>
          </el-form-item>
        </el-col>

        <el-col >
          <el-form-item>
            <h3>当前列表; 亏损总数：{{this.lossNumber}}个 亏损总进价：{{this.lossPurchaseAmount}}￥ 亏损总售价：{{this.lossSaleAmount}}￥</h3>
          </el-form-item>
        </el-col>



      </el-form>
    </el-row>

    <el-table
      v-loading="stockCountLoading"
      @selection-change="handleStockCountsSelectionChange"
      :data="stockCountList.machinePageList"
      stripe
      border
      height="750"
      style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="machineId" label="设备ID" align="center"></el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
      <el-table-column prop="companyName" label="大区" align="center"></el-table-column>
      <el-table-column prop="lossNumber" label="设备亏损总数" align="center"></el-table-column>
      <el-table-column prop="lossPurchaseAmount" label="设备亏损进价总额" align="center"></el-table-column>
      <el-table-column prop="lossSaleAmount" label="设备亏损售价总额" align="center"></el-table-column>
      <el-table-column label="盘库时间" prop="createTime" align="center" ></el-table-column>
      <el-table-column label="操作" width="400px" align="center" >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="info"
            @click="toStockCountProductPage(scope.row)">设备商品亏损明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
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
    </el-tab-pane>

    <el-tab-pane name="productList">
      <span slot="label"><i class="el-icon-date"></i> 商品信息</span>
        <div style="margin: 1% 2%;">
          <el-row :gutter="20">
          <el-form :inline="true" :model="stockCountProductForm"  class="demo-form-inline">

            <el-col :span="7">
            <el-form-item label="商品名称">
              <el-input v-model="stockCountProductForm.productName" placeholder="商品名称"></el-input>
            </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item>
                <el-button type="primary" @click="findStockCountProductList" icon="search">查询</el-button>
              </el-form-item>
            </el-col>

          </el-form>
          </el-row>
    <el-table
      v-loading="stockCountProductLoading"
      @selection-change="handleStockCountProductsSelectionChange"
      :data="stockCountProductList"
      stripe
      border
      height="800"
      style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="product" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="tasteName" label="口味" align="center"></el-table-column>
      <el-table-column prop="purchasePrice" label="商品进价" align="center"></el-table-column>
      <el-table-column prop="salePrice" label="商品售价" align="center"></el-table-column>
      <el-table-column prop="stockBefore" label="盘库前数量" align="center"></el-table-column>
      <el-table-column prop="stockAfter" label="盘库后数量" align="center"></el-table-column>
      <el-table-column prop="lossNumber" label="设备亏损总数" align="center"></el-table-column>
      <el-table-column prop="lossPurchaseAmount" label="设备亏损进价总额" align="center"></el-table-column>
      <el-table-column prop="lossSaleAmount" label="设备亏损售价总额" align="center"></el-table-column>
      <el-table-column label="盘库时间" prop="createTime" align="center" ></el-table-column>
    </el-table>
      <!--分页-->
      <p class="block" style="float:right">
        <el-pagination
          @size-change="spHandleSizeChange"
          @current-change="spHandleCurrentChange"
          :current-page="spPage"
          :page-sizes="spSizes"
          :page-size="spSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="spTotal">

        </el-pagination>
      </p>
      </div>
    </el-tab-pane>


  </el-tabs>
</template>

<script>
  //import stockCountDetail from './stockCountDetail'
  import {fetchStockCountList,fetchStockCountProductList,fetchMachineList,fetchCompanyList} from '../../api/stockCount'
  export default {
    created: function () {
      this.getStockCountList();
      this.getMachines();
      this.getCompanys();
    },
    data() {
      return {
        stockCountForm:{
          machineId:'',
          companyId:'',
          dateTime: '',
          isCompany:'',
          isMachine:''
        },
        stockCountProductForm:{
          productName:''
        },
        activeName: 'stockCountList',
        stockCountLoading: false,
        stockCountProductLoading: false,
        stockCountMachine:[],
        machine:[],
        machines:[],
        companys:[],
        lossNumber:0,
        lossPurchaseAmount:'0.0',
        lossSaleAmount:'0.0',
        allLossNumber:0,
        allLossPurchaseAmount:'0.0',
        allLossSaleAmount:'0.0',
        allMachineLossNumber:0,
        allMachineLossPurchaseAmount:'0.0',
        allMachineLossSaleAmount:'0.0',
        allAreaLossNumber:0,
        allAreaLossPurchaseAmount:'0.0',
        allAreaLossSaleAmount:'0.0',
        lossNumberKeep:0,
        lossPurchaseAmountKeep:'0.0',
        lossSaleAmountKeep:'0.0',
        stockCountList:{
          allList:[],
          areaAllList:[],
          machineAllList:[],
          machinePageList:[]
        },
        stockCountProductList:[],
        stockCountsSelection:[],
        productListSelection:[],
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        spPage: 1,
        spSize: 10,
        spTotal: 0,
        spSizes: [10, 20, 50, 100],



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
        }
      }
    },
    methods:{
      getStockCountList(){
        this.stockCountLoading = true;
        if(this.stockCountForm.machineId != ''){
          this.stockCountForm.isMachine = "Y";
        }
        if(this.stockCountForm.companyId != ''){
          this.stockCountForm.isCompany = "Y";
        }
        fetchStockCountList(this.stockCountForm,this.page,this.size).then(response => {
          this.stockCountLoading = false;
          this.lossNumber = 0;
          this.lossPurchaseAmount = '0.0';
          this.lossSaleAmount = '0.0';
          this.stockCountList = response.response;
          console.log(this.stockCountList)
          //console.log(response.response[0])
          this.total = response.total;
          if( this.stockCountList.machinePageList != null){
            var ln = 0;
            var lpa = 0.0;
            var lsa = 0.0;
            for(var i in this.stockCountList.machinePageList){
              ln += this.stockCountList.machinePageList[i].lossNumber;
              lpa += this.stockCountList.machinePageList[i].lossPurchaseAmount;
              lsa += this.stockCountList.machinePageList[i].lossSaleAmount;
            }
            this.lossNumber = ln;
            this.lossPurchaseAmount = lpa.toFixed(2);
            this.lossSaleAmount = lsa.toFixed(2);
            this.lossNumberKeep = ln;
            //console.log(this.lossPurchaseAmount)
            this.lossPurchaseAmountKeep = lpa.toFixed(2);
            this.lossSaleAmountKeep = lsa.toFixed(2);
          }
          if( this.stockCountList.machineAllList != null){
            var ln = 0;
            var lpa = 0.0;
            var lsa = 0.0;
            for(var i in this.stockCountList.machineAllList){
              ln += this.stockCountList.machineAllList[i].lossNumber;
              lpa += this.stockCountList.machineAllList[i].lossPurchaseAmount;
              lsa += this.stockCountList.machineAllList[i].lossSaleAmount;
            }
            this.allMachineLossNumber = ln;
            this.allMachineLossPurchaseAmount = lpa.toFixed(2);
            this.allMachineLossSaleAmount = lsa.toFixed(2);
          }
          if( this.stockCountList.areaAllList != null){
            var ln = 0;
            var lpa = 0.0;
            var lsa = 0.0;
            for(var i in this.stockCountList.areaAllList){
              ln += this.stockCountList.areaAllList[i].lossNumber;
              lpa += this.stockCountList.areaAllList[i].lossPurchaseAmount;
              lsa += this.stockCountList.areaAllList[i].lossSaleAmount;
            }
            this.allAreaLossNumber = ln;
            this.allAreaLossPurchaseAmount = lpa.toFixed(2);
            this.allAreaLossSaleAmount = lsa.toFixed(2);
          }
          if( this.stockCountList.allList != null){
            var ln = 0;
            var lpa = 0.0;
            var lsa = 0.0;
            for(var i in this.stockCountList.allList){
              ln += this.stockCountList.allList[i].lossNumber;
              lpa += this.stockCountList.allList[i].lossPurchaseAmount;
              lsa += this.stockCountList.allList[i].lossSaleAmount;
            }
            this.allLossNumber = ln;
            this.allLossPurchaseAmount = lpa.toFixed(2);
            this.allLossSaleAmount = lsa.toFixed(2);
          }
        })
      },
      oStockCountProductPage(stockCountMachine){
        this.activeName = 'productList'
        this.getStockCountMachineProduct(stockCountMachine)
        this.machine = stockCountMachine
      },
      getStockCountMachineProduct(stockCountMachine){
        this.stockCountProductLoading = true;
        fetchStockCountProductList(stockCountMachine,this.stockCountProductForm,this.spPage,this.spSize).then(response => {
          //console.log(response.response)
          this.stockCountProductLoading = false;
          this.stockCountProductList = response.response;
          this.spTotal = response.total;

        })
      },
      findStockCountList(){
        this.getStockCountList();
      },
      findStockCountProductList(){
        this.getStockCountMachineProduct(this.machine);
      },
      getMachines() {
        fetchMachineList(this.stockCountForm).then(response => {
          this.machines = response.response
        })
      },
      freshenCompany(){
        this.stockCountForm.machineId = ''
        this.getMachines();
        this.getStockCountList();
      },
      freshenMachine(){
        this.getMachines();
        this.getStockCountList();
      },
      getCompanys() {
        fetchCompanyList().then(response => {
          this.companys = response.response
        })
      },
      handleStockCountsSelectionChange(val) {
        this.stockCountsSelection = val
        if( this.stockCountsSelection != null && this.stockCountsSelection.length != 0){
          var ln = 0;
          var lpa = 0.0;
          var lsa = 0.0;
          for(var i in this.stockCountsSelection){
            ln += this.stockCountsSelection[i].lossNumber;
            lpa += this.stockCountsSelection[i].lossPurchaseAmount;
            lsa += this.stockCountsSelection[i].lossSaleAmount;
          }
          this.lossNumber = ln;
          this.lossPurchaseAmount = lpa.toFixed(2);
          this.lossSaleAmount = lsa.toFixed(2);
        }else {
          this.lossNumber = this.lossNumberKeep;
          this.lossPurchaseAmount = this.lossPurchaseAmountKeep;
          this.lossSaleAmount = this.lossSaleAmountKeep;
        }
        //console.log(this.lossPurchaseAmountKeep)
      },
      handleStockCountProductsSelectionChange(val) {
        this.productListSelection = val
      },
      handleSizeChange(val) {
        this.size = val
        this.getStockCountList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getStockCountList()
      },
      spHandleSizeChange(val) {
        this.pmsize = val
        this.getStockCountMachineProduct(this.machine)
      },
      spHandleCurrentChange(val) {
        this.pmpage = val
        this.getStockCountMachineProduct(this.machine)
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table label {
    width: 10px;
    color: #99a9bf;
  }

  .demo-table .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  }
</style>
