<template>
  <div style="margin: 1% 2%;">

    <el-card class="box-card" style="padding: 0;">
      <div slot="header" class="clearfix" style="padding: 0;height: 40px">
        <el-form :model="chartSearchForm"
                 ref="chartSearchForm"
                 class="demo-form-inline"
                 label-position="right"
                 label-width="40px">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="时间" prop="dateTime">
                <div class="block">
                  <el-date-picker
                    v-model="chartSearchForm.dateTime"
                    type="datetimerange"
                    :picker-options="pickerOption"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="机构" prop="officeIds">
                <el-cascader
                  :options="offices"
                  v-model="chartSearchForm.officeIds"
                  :props="props"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构"
                  style="width:100%"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="设备" prop="machineId">
                <el-select v-model="chartSearchForm.machineId"
                           clearable
                           filterable
                           placeholder="请选择设备">
                  <el-option
                    v-for="item in machines"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button icon="el-icon-search" round type="primary" @click="getData">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-row type="flex" justify="center" style="margin-bottom: 1%;height: 50px">
        <el-col style="line-height: 50px; text-align: center;">实际总收入:<b>{{saleTotalMoney}}</b>元</el-col>
        <el-col style="line-height: 50px; text-align: center;">交易笔数:<b>{{saleTotalCount}}</b>笔</el-col>
        <el-col style="line-height: 50px; text-align: center;">人均消费:<b>{{salePersonAverage}}</b>元</el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-radio-group v-model="chartSearchForm.groupBy" style="margin: 0 auto" @change="getData">
          <el-radio-button label="按天" size="large"></el-radio-button>
          <el-radio-button label="按周" size="large"></el-radio-button>
          <el-radio-button label="按月" size="large"></el-radio-button>
          <el-radio-button label="按年" size="small"></el-radio-button>
        </el-radio-group>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="getData">
        <el-tab-pane name="saleMoneyChart">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2764"><path
          d="M116.419048 615.521524c58.831238-170.593524 51.004952-135.558095 51.004952-135.558095 48.737524-110.83581 186.343619-200.679619 307.590095-200.679619h73.264762c121.173333 0 261.241905 88.868571 308.272762 200.655238 0 0-18.773333-64.853333 50.371048 135.728762 69.168762 200.582095 60.879238 193.974857 60.879238 193.974857 30.841905 117.101714-42.349714 212.041143-163.523048 212.041143H219.014095c-121.173333 0-194.82819-95.232-162.718476-212.065524 0 0 1.29219-23.478857 60.123429-194.072381z m361.008762 171.032381c0 26.916571-0.170667 49.93219 0.048761 72.97219 0.170667 17.408 9.337905 27.672381 26.624 28.086857 17.603048 0.463238 26.282667-10.288762 27.623619-27.233523 0.463238-5.973333 0.24381-11.995429 0.24381-17.993143 0.170667-55.783619 0.170667-55.783619 57.173333-55.808 18.846476 0 38.375619 2.82819 56.32-1.243429 10.410667-2.364952 23.722667-14.628571 26.038857-24.673524 3.657143-15.896381-8.338286-27.306667-25.6-28.281904-17.944381-0.975238-35.986286-0.390095-53.979428-0.414477-19.260952-0.048762-38.546286 0-57.856 0v-34.767238h102.107428c19.139048 0.048762 35.57181-5.680762 36.08381-27.452952 0.585143-23.405714-16.481524-29.598476-36.571429-29.744762-19.260952-0.146286-38.473143-0.024381-60.903619-0.024381 5.851429-11.312762 9.508571-18.870857 13.628953-26.160762 19.285333-34.328381 38.790095-68.510476 58.026666-102.863238 9.362286-16.749714 15.847619-34.523429-5.217523-46.884571-20.943238-12.312381-33.353143 0.853333-42.886096 18.334476-4.900571 9.020952-9.99619 17.92-15.091809 26.843428-24.795429 43.715048-49.590857 87.430095-75.654095 133.290667-4.632381-6.217143-7.460571-9.313524-9.508572-12.897524-28.769524-50.590476-57.368381-101.278476-86.089143-151.893333-9.362286-16.481524-22.77181-24.088381-40.423619-13.750857-16.457143 9.630476-16.700952 24.576-8.338285 40.106666 8.923429 16.579048 18.358857 32.889905 27.501714 49.322667l48.152381 86.552381c-24.624762 0-44.324571 0.097524-64-0.048762-19.821714-0.146286-36.693333 4.705524-39.204572 27.721143-1.999238 18.285714 13.433905 29.330286 39.692191 29.500952 33.206857 0.24381 66.413714 0.073143 100.449524 0.073143v34.742857c-36.327619 0-71.41181-1.536-106.179048 0.902096-11.215238 0.78019-26.112 9.508571-31.597714 19.065904-9.97181 17.383619 5.607619 34.133333 30.232381 34.499048 35.766857 0.487619 71.509333 0.121905 109.153524 0.121905zM287.353905 74.898286c-23.698286-59.245714 5.485714-88.990476 65.877333-67.754667 0 0 88.892952 38.375619 154.965333 38.375619S663.503238 7.070476 663.503238 7.070476c59.904-21.77219 89.234286 8.655238 65.536 67.852191L693.638095 163.449905c-15.018667 37.546667-59.855238 67.925333-100.205714 67.925333h-170.471619c-40.326095 0-85.113905-30.232381-100.181333-67.925333L287.353905 74.898286z"
          fill="#C5CDD4" p-id="2765"></path></svg> 销售金额</span>

          <div class="components-container"
               style='height: 1600px;'
               v-loading="saleMoneyDataLoading"
               element-loading-text="小喵使出了洪荒之力为您加载。。。">
            <div class='chart-container'>
              <saleMoneyChart :data="saleMoneyData" id="chart" height="900px" width="100%"
                              :witch="witch"/>
            </div>
            <hr style="width: 120%;"/>
            <div class='chart-container' style="margin-left: 15%;">
              <saleMoneyDetailPieChart :data="saleMoneyData" id="pieChart"
                                       style="margin-top: 5%" height="700px" width="100%"
                                       :witch="witch"/>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="saleCountChart">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2806"><path
          d="M785.067 102.4H238.933c-20.48 0-34.133-13.653-34.133-34.133s13.653-34.134 34.133-34.134h546.134c20.48 0 34.133 13.654 34.133 34.134S802.133 102.4 785.067 102.4z m68.266 136.533H170.667c-20.48 0-34.134-13.653-34.134-34.133s13.654-34.133 34.134-34.133h682.666c20.48 0 34.134 13.653 34.134 34.133s-17.067 34.133-34.134 34.133z m0 68.267H170.667c-75.094 0-136.534 61.44-136.534 136.533v409.6c0 75.094 61.44 136.534 136.534 136.534h682.666c75.094 0 136.534-61.44 136.534-136.534v-409.6c0-75.093-61.44-136.533-136.534-136.533zM921.6 853.333c0 37.547-30.72 68.267-68.267 68.267H170.667c-37.547 0-68.267-30.72-68.267-68.267v-409.6c0-37.546 30.72-68.266 68.267-68.266h682.666c37.547 0 68.267 30.72 68.267 68.266v409.6z"
          p-id="2807"></path></svg> 订单笔数</span>

          <div class="components-container"
               style='height: 1700px;'
               v-loading="saleCountDataLoading"
               element-loading-text="小喵使出了洪荒之力为您加载。。。">
            <div class='chart-container'>
              <saleCountChart :data="saleCountData" id="saleCountChart" height="900px" width="100%"
                              :witch="witch"/>
            </div>
            <hr style="width: 120%;"/>
            <div class='chart-container' style="margin-left: 15%;">
              <saleCountPieChart :data="saleCountData.pieData" id="saleCountPieChart" height="600px" width="100%"
                                 :witch="witch" style="margin-top: 5%"/>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="salePersonChart">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2806"><path
          d="M947.73248 848.28672c0 24.03328-19.24608 43.57632-42.92096 43.57632-23.68 0-42.92608-19.53792-42.92608-43.57632 0-0.22016 0.10752-0.55808 0.10752-0.76288h-0.31744c0-0.9984 0.11264-1.9712 0.11264-2.94912 0-71.12704-27.7504-135.55712-72.50944-182.84032l0.22016-0.2304a41.84064 41.84064 0 0 1-12.39552-29.76256c0-23.05024 18.50368-41.85088 41.20064-41.85088 11.52512 0 21.95456 4.8128 29.38368 12.55424l0.11264-0.10752a348.81536 348.81536 0 0 1 99.94752 245.28384h-0.11264c0.09728 0.128 0.09728 0.3328 0.09728 0.6656m-341.51424-266.50112c-0.22016 0.13312-0.44544 0.13312-0.65024 0.13312-141.57312 0-256.29184 117.49376-256.29184 262.55872 0 0.75776 0.10752 1.38752 0.10752 2.05824 0 0.55808 0.22528 1.09568 0.22528 1.65888 0 24.02816-19.27168 43.5712-42.94656 43.5712-23.65952 0-42.92608-19.53792-42.92608-43.5712 0-0.22528 0.13312-0.5632 0.13312-0.768h-0.47104c0-141.01504 82.93888-262.12864 201.86624-316.62592a225.64864 225.64864 0 0 1-81.1264-173.89056c0-124.14464 99.0976-224.7424 221.42464-224.7424 122.24512 0 221.45024 100.59776 221.45024 224.78336-0.02048 124.032-98.91328 224.5376-220.8 224.85504m-0.6656-368.05632c-77.79328 0-140.94848 64.00512-140.94848 143.09888 0 78.95552 63.04256 143.07328 140.94848 143.07328 77.78816 0 140.96896-64.00512 140.96896-143.07328-0.08704-79.09376-63.16032-143.09888-140.96896-143.09888m-261.66784 39.54176a111.7184 111.7184 0 0 0-81.55136 107.4688A111.4624 111.4624 0 0 0 322.03776 459.50464c14.4128 7.54176 28.40064 21.92896 30.65856 46.83776 1.9456 21.61664-4.29568 54.15936-32.47104 62.03904-96.34816 26.94144-164.13696 113.2032-167.53664 213.1968 0.22528 1.64864 0.5376 3.28704 0.5376 4.9152 0 21.28896-17.00864 38.6816-38.08768 38.6816-20.97152 0-38.0928-17.25952-38.0928-38.6816 0-0.44544 0.13824-0.75264 0.13824-1.07008h-0.22528c0-129.64864 75.82208-232.86272 182.35392-277.51424-81.5872-62.86848-96.75264-179.968-33.88928-261.55008a186.53696 186.53696 0 0 1 70.81472-56.064c30.21312-13.78304 52.16768 2.64192 57.56416 23.81312 6.43584 25.33376-9.92256 39.18336-9.92256 39.18336"
          p-id="1057"></path></svg> 购买人数</span>

          <div class="components-container"
               style='height: 900px;'
               v-loading="personCountDataLoading"
               element-loading-text="小喵使出了洪荒之力为您加载。。。">
            <div class='chart-container'>
              <personCountChart :data="personCountData" id="personCount" height="900px" width="100%"
                                :witch="witch"/>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="rechargeChart">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2806"><svg
          class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
          viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3069"><path
          d="M442.4 194.3l50.7-31.7 52.8 69.7-27.4 23.2-2.1 10.6 323 0 0 48.6L157.5 314.7l0-44.3 335.6-8.4L442.4 194.3zM421.3 304.1 203.9 515.2l35.9 40.1c0 0 386.3-33.8 470.7-19l14.8 0 35.9 46.4 48.6-29.6L645.1 361.1l-46.4 23.2 67.5 95c0 0-198.4 0-365.2 19l192.1-183.6L421.3 304.1zM370.7 525.7 370.7 627c0 0-33.8 154.1-225.9 194.2l27.4 40.1c0 0 221.6-61.2 240.6-211.1l8.4-124.5L370.7 525.7zM567 525.7l0 255.4c0 0-2.1 78.1 78.1 80.2l116.1 0c0 0 95 0 99.2-154.1L795 677.7c0 0 35.9 116.1-59.1 130.9l-80.2 0c0 0-46.4-4.2-42.2-92.9l2.1-190L567 525.7zM372.8 285.1l177.3 0 0 29.6L372.8 314.7 372.8 285.1z"
          p-id="3070"></path></svg></svg> 充值金额</span>
          <div class="components-container"
               style='height: 900px;'
               v-loading="rechargeDataLoading"
               element-loading-text="小喵使出了洪荒之力为您加载。。。">
            <div class='chart-container'>
              <rechargeCountChart :data="rechargeData" id="rechargeCount" height="900px" width="100%"
                                  :witch="witch"/>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>


  </div>
</template>

<script>

  import { fetchOfficeTree } from '../../api/office';
  import saleMoneyChart from '@/components/Charts/saleMoneyChart'
  import saleMoneyDetailPieChart from '@/components/Charts/saleMoneyDetailPieChart'
  import saleCountChart from '@/components/Charts/saleCountChart'
  import saleCountPieChart from '@/components/Charts/saleCountPieChart'
  import personCountChart from '@/components/Charts/personCountChart'
  import rechargeCountChart from '@/components/Charts/rechargeCountChart'
  import {
    fetchPersonCountData,
    fetchRechargeCountData,
    fetchSaleCountData,
    fetchSaleData,
    getMachineListForSelect
  } from '../../api/chart';
  // import personCountPieChart from '@/components/Charts/saleCountPieChart'

  export default {
    components: {
      saleMoneyChart,
      saleCountChart,
      saleMoneyDetailPieChart,
      saleCountPieChart,
      personCountChart,
      rechargeCountChart
      // personCountPieChart
    },
    created() {
      this.getSaleData();
      this.witch = 1;
      this.fetchOfficeCasc();
    },
    data() {
      return {
        /* 销售金额报表 */
        saleMoneyData: {
          balanceSales: [],
          wechatSales: [],
          alipaySales: [],
          douyaSales: [],
          groups: [],
          totalSales: [],
          firstPieData: [],
          secondPieData: []
        },
        saleMoneyDataLoading: false,
        /* 成交笔数 */
        saleCountData: {
          paidCount: [],
          unpaidCount: [],
          groups: [],
          totalOrderCount: [],
          pieData: [{
            value: 0,
            name: '已付款订单'
          }, {
            value: 0,
            name: '未付款订单'
          }]
        },
        saleCountDataLoading: false,

        /* 人数 */
        personCountData: {
          groups: [],
          personCount: []
        },
        personCountDataLoading: false,
        /* 充值 */
        rechargeData: {
          groups: [],
          recharge: []
        },
        rechargeDataLoading: false,
        /* 通用 */
        saleTotalMoney: 0,
        saleTotalCount: 0,
        salePersonAverage: 0,
        witch: 0,
        chartSearchForm: {
          dateTime: '',
          officeIds: [],
          companyId: null,
          regionId: null,
          officeId: null,
          groupBy: '按月',
          machineId: ''
        },
        offices: [],
        machines: [],
        activeName: 'saleMoneyChart',
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        // 初始化时间快捷选项
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
    methods: {
      /* 销售金额报表 */
      getSaleData() {
        this.saleMoneyDataLoading = true;
        fetchSaleData(this.chartSearchForm).then(response => {
          this.saleMoneyDataLoading = false;
          if (response.code === 0) {
            this.saleMoneyData = response.response;
            this.saleTotalMoney = response.response.saleTotalMoney;
            this.saleTotalCount = response.response.saleTotalCount;
            this.salePersonAverage = response.response.salePersonAverage;
          }
        })
      },

      /* 成交笔数 */
      getSaleCountData() {
        this.saleCountDataLoading = true;
        fetchSaleCountData(this.chartSearchForm).then(response => {
          this.saleCountDataLoading = false;
          if (response.code === 0) {
            this.saleCountData = response.response;
            this.saleTotalMoney = response.response.saleTotalMoney;
            this.saleTotalCount = response.response.saleTotalCount;
            this.salePersonAverage = response.response.salePersonAverage;
          }
        })
      },

      /* 人数 */
      getPersonCountData() {
        this.personCountDataLoading = true;
        fetchPersonCountData(this.chartSearchForm).then(response => {
          this.personCountDataLoading = false;
          if (response.code === 0) {
            this.personCountData = response.response;
            this.saleTotalMoney = response.response.saleTotalMoney;
            this.saleTotalCount = response.response.saleTotalCount;
            this.salePersonAverage = response.response.salePersonAverage;
          }
        })
      },

      /* 充值 */
      getRechargeData() {
        this.rechargeDataLoading = true;
        fetchRechargeCountData(this.chartSearchForm).then(response => {
          this.rechargeDataLoading = false;
          if (response.code === 0) {
            this.rechargeData = response.response;
            this.saleTotalMoney = response.response.saleTotalMoney;
            this.saleTotalCount = response.response.saleTotalCount;
            this.salePersonAverage = response.response.salePersonAverage;
          }
        })
      },
      /* 通用 */
      getData() {
        switch (this.activeName) {
          case 'saleMoneyChart':
            this.getSaleData();
            this.witch = 1;
            break;
          case 'saleCountChart':
            this.getSaleCountData();
            this.witch = 2;
            break;
          case 'salePersonChart':
            this.getPersonCountData();
            this.witch = 3;
            break;
          case 'rechargeChart':
            this.getRechargeData();
            this.witch = 4;
            break;
          default:
            break;
        }
      },
      // 初始化机构
      fetchOfficeCasc() {
        fetchOfficeTree().then(response => {
          if (response.code === 0 && response.response) {
            this.offices = response.response[0].children;
          }
        });
      },
      handleChange(value) {
        let cId = null;
        let rId = null;
        let oId = null;
        if (value) {
          if (value[0]) {
            this.chartSearchForm.companyId = value[0]
            cId = value[0];
          } else {
            this.chartSearchForm.companyId = null
          }
          if (value[1]) {
            this.chartSearchForm.regionId = value[1]
            rId = value[1]
          } else {
            this.chartSearchForm.regionId = null
          }
          if (value[2]) {
            this.chartSearchForm.officeId = value[2]
            oId = value[2]
          } else {
            this.chartSearchForm.officeId = null
          }
        }
        this.chartSearchForm.machineId = '';
        if (value.length > 0) {
          getMachineListForSelect(cId, rId, oId).then(response => {
            if (response.code === 0) {
              this.machines = response.response
            }
          })
        } else {
          this.machines = [];
        }
      }
    }
  }
</script>
