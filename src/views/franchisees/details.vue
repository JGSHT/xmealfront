<template>
  <div style="margin: 0% 2%;">
    <el-tabs v-model="activeName" @tab-click="selectTab">
      <el-tab-pane name="franchiseesMachineAccountListPane">
        <span slot="label"><i class="el-icon-document"></i> 设备流水列表</span>
        <el-form :model="machineAccountListSearchForm"
                 ref="machineAccountListSearchForm"
                 class="demo-form-inline"
                 label-position="right"
                 label-width="68px">

          <el-row :gutter="20">

            <el-col :span="6">
              <el-form-item label="加盟商" prop="franchiseesId">
                <el-select v-model="machineAccountListSearchForm.franchiseesId"
                           filterable
                           clearable
                           placeholder="请选择加盟商">
                  <el-option
                    v-for="item in franchiseesSelectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9" :push="1">
              <el-form-item label="时间" prop="dateTime" label-width="50px">
                <div class="block">
                  <el-date-picker
                    v-model="machineAccountListSearchForm.dateTime"
                    type="datetimerange"
                    :picker-options="pickerOption"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    style="width:100%">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="7" :push="2">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="machineAccountListSearchForm.machineName" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" style="margin-left: 30%">
              <el-form-item>
                <el-button type="primary" round icon="el-icon-search" @click="searchMachineAccountList">查询</el-button>
                <el-button icon="el-icon-delete" round @click="resetForm('machineAccountListSearchForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          v-loading="machineAccountListLoading"
          element-loading-text="小喵使出了洪荒之力为您加载。。。"
          :data="machineAccountList"
          stripe
          border
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand" label-width="70px">
                <el-form-item label="购买笔数">
                  <span>{{ (props.row.saleQuantity) ? props.row.saleQuantity : 0 }}</span>
                </el-form-item>
                <el-form-item label="退款单数">
                  <span>{{ (props.row.refundQuantity) ? props.row.refundQuantity : 0 }}</span>
                </el-form-item>
                <el-form-item label="人均购买金额" label-width="100px">
                  <span>{{ (props.row.perCapitaPurchaseAmount) ? Number(props.row.perCapitaPurchaseAmount).toFixed(2) + '元' : ''
                    }}</span>
                </el-form-item>
                <el-form-item label="负责人">
                  <span>{{ props.row.leadingOfficialName }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="machineId" label="设备编号" align="center"></el-table-column>
          <el-table-column prop="machineName" label="设备名" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="companyName" label="公司名称" align="center"></el-table-column>
          <el-table-column prop="regionName" label="大区名称" align="center"></el-table-column>
          <el-table-column prop="officeName" label="机构名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="totalSaleAmount" label="销售总金额" align="center"
                           :formatter="formatterMoney"></el-table-column>
          <el-table-column prop="totalRefundAmount" label="退款总金额" align="center"
                           :formatter="formatterMoney"></el-table-column>
          <el-table-column prop="actualSalesAmount" label="实际营业额" align="center"
                           :formatter="formatterMoney"></el-table-column>
          <!-- <el-table-column v-show="false" prop="grossProfit" label="毛利" align="center"
                           :formatter="formatterMoney"></el-table-column> -->
          <el-table-column prop="franchiseeName" label="加盟商" align="center"></el-table-column>
        </el-table>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleMachineAccountListSizeChange"
            @current-change="handleMachineAccountListCurrentChange"
            :current-page="machineAccountListPage"
            :page-sizes="machineAccountListSizes"
            :page-size="machineAccountListSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="machineAccountListTotal">
          </el-pagination>
        </p>
      </el-tab-pane>

      <el-tab-pane name="franchiseesAccountListPane">
        <span slot="label"><i class="el-icon-time"></i> 加盟商结算列表</span>
        <el-form :model="franchiseesAccountListSearchForm"
                 ref="franchiseesAccountListSearchForm"
                 label-position="right"
                 label-width="68px"
                 class="demo-form-inline">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="加盟时间" prop="dateTime">
                <div class="block">
                  <el-date-picker
                    v-model="franchiseesAccountListSearchForm.dateTime"
                    type="datetimerange"
                    :picker-options="pickerOption"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    style="width:100%">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="加盟商" prop="franchiseesId">
                <el-select v-model="franchiseesAccountListSearchForm.franchiseesId"
                           filterable
                           clearable
                           placeholder="请选择加盟商">
                  <el-option
                    v-for="item in franchiseesSelectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" round icon="el-icon-search" @click="searchFranchiseesAccountList">查询</el-button>
                <el-button icon="el-icon-delete" round @click="resetForm('franchiseesAccountListSearchForm')">重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-tooltip content="双击展示结算详情" placement="top-end" effect="light">
          <el-table
            v-loading="franchiseesAccountListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="franchiseesAccountList"
            stripe
            border
            @row-dblclick="showFranchiseesAccountDetailList"
            style="width: 100%;">
            <el-table-column prop="id" label="加盟商编号" align="center"></el-table-column>
            <el-table-column prop="name" label="加盟商名称" align="center"></el-table-column>
            <el-table-column prop="payPeriod" label="结算周期" align="center"
                             :formatter="formatterPayPeriod"></el-table-column>
            <el-table-column prop="settlementAmount" label="已结算金额" align="center"
                             :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="totalTurnover" label="累计营业额" align="center"
                             :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="unSettlementAmount" label="据上次结算营业额" align="center"
                             :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="joinDate" label="加盟时间" align="center"
                             :formatter="formatterDateTime"></el-table-column>
            <el-table-column prop="lastAccountDate" label="上次结算时间" align="center"
                             :formatter="formatterDateTime"></el-table-column>
          </el-table>
        </el-tooltip>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleFranchiseesAccountListSizeChange"
            @current-change="handleFranchiseesAccountListCurrentChange"
            :current-page="franchiseesAccountListPage"
            :page-sizes="franchiseesAccountListSizes"
            :page-size="franchiseesAccountListSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="franchiseesAccountListTotal">
          </el-pagination>
        </p>
      </el-tab-pane>

      <el-tab-pane name="franchiseesAccountDetailListPane">
        <span slot="label"><i class="el-icon-information"></i> 结算详情列表</span>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="!showTips" style="line-height: 36px;font-size: 20px">请先选择某一个加盟商</span>
            <el-form v-if="showTips"
                     :model="franchiseesAccountDetailListSearchForm"
                     ref="franchiseesAccountDetailListSearchForm"
                     class="demo-form-inline"
                      label-position="right"
                    label-width="68px">
              <el-row :gutter="20">
                <el-col :span="9">
                  <el-form-item label="结算时间" prop="dateTime">
                    <div class="block">
                      <el-date-picker
                        v-model="franchiseesAccountDetailListSearchForm.dateTime"
                        type="datetimerange"
                        :picker-options="pickerOption"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        :disabled="!showTips"
                        style="width:100%">
                      </el-date-picker>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item>
                    <el-button type="primary"
                               :disabled="!showTips"
                               round
                               icon="el-icon-search"
                               @click="searchFranchiseesAccountDetailList">查询
                    </el-button>
                    <el-button icon="el-icon-share"
                               round
                               :disabled="!showTips"
                               @click="exportOne"
                               :loading="exportOneLoading"
                               style="margin-left: 20px">导出
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <el-tooltip content="双击查看详情" placement="top-end" effect="light">
            <el-table
              v-loading="franchiseesAccountDetailListLoading"
              element-loading-text="小喵使出了洪荒之力为您加载。。。"
              :data="franchiseesAccountDetailList"
              stripe
              border
              @row-dblclick="showDetail"
              style="width: 100%;">
              <el-table-column prop="franchiseeId" label="加盟商编号" align="center"></el-table-column>
              <el-table-column prop="name" label="加盟商名称" align="center"></el-table-column>
              <el-table-column prop="thisSettlementDate" label="结算时间" align="center"
                               :formatter="formatterDateTime"></el-table-column>
              <el-table-column prop="profit" label="结算分利" align="center" :formatter="formatterProfit"></el-table-column>
              <el-table-column prop="totalSaleAmount" label="结算周期营业额" align="center"
                               :formatter="formatterMoney"></el-table-column>
              <el-table-column prop="settlementAmount" label="所得分润" align="center"
                               :formatter="formatterMoney"></el-table-column>
            </el-table>
          </el-tooltip>

          <p class="block" style="float:right">
            <el-pagination
              @size-change="handleFranchiseesAccountDetailListSizeChange"
              @current-change="handleFranchiseesAccountDetailListCurrentChange"
              :current-page="franchiseesAccountDetailListPage"
              :page-sizes="franchiseesAccountDetailListSizes"
              :page-size="franchiseesAccountDetailListSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="franchiseesAccountDetailListTotal">
            </el-pagination>
          </p>
        </el-card>

        <el-dialog title="分润详情" :visible.sync="franchiseesProfitMachineDetailDialogVisible">
          <div style="overflow:auto;">
            <el-table
              v-loading="franchiseesProfitMachineDetailListLoading"
              element-loading-text="小喵使出了洪荒之力为您加载。。。"
              :data="franchiseesProfitMachineDetailList"
              stripe
              border
              :fit="true"
              style="width: 100%;">
              <el-table-column prop="id" label="编号" align="center"></el-table-column>
              <el-table-column prop="machineName" label="设备名称" width="150" align="center"></el-table-column>
              <el-table-column prop="profit" label="结算分利" align="center" :formatter="formatterProfit"></el-table-column>
              <el-table-column prop="totalSaleAmount" label="已结算周期营业额" width="150" align="center"
                               :formatter="formatterMoney"></el-table-column>
              <el-table-column prop="settlementAmount" label="所得分润" align="center"
                               :formatter="formatterMoney"></el-table-column>
              <el-table-column prop="status" label="状态" align="center" width="78"></el-table-column>
              <el-table-column prop="thisSettlementDate" label="结算时间" align="center" width="190"
                               :formatter="formatterDateTime"></el-table-column>
            </el-table>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>

    <a id="getExcel" style="display: none"></a>
  </div>
</template>

<script>

  import {
    exportOneFranchiseeAccountExcel,
    getAccountList,
    getFranchiseesAccountDetailList,
    getFranchiseesAccountList, getFranchiseesDetailBySettlementDate,
    getFranchiseesSelectList
  } from "../../api/franchisees";

  export default {
    created() {
      this.getFranchiseesSelect();
      this.searchMachineAccountList();
    },
    data() {
      return {
        /* 加盟商设备流水 */
        machineAccountListSearchForm: {
          dateTime: '',
          machineName: '',
          franchiseesId: ''
        },
        machineAccountList: [],
        franchiseesSelectList: [],
        machineAccountListLoading: false,
        machineAccountListPage: 1,
        machineAccountListSizes: [10, 20, 50, 100],
        machineAccountListSize: 10,
        machineAccountListTotal: 0,
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

        /* 加盟商结算 */
        franchiseesAccountListSearchForm: {
          dateTime: '',
          franchiseesId: ''
        },
        franchiseesAccountList: [],
        franchiseesProfitMachineDetailList: [],
        selectFranchiseesAccount: '',
        franchiseesAccountListLoading: false,
        franchiseesProfitMachineDetailListLoading: true,
        franchiseesProfitMachineDetailDialogVisible: false,
        franchiseesAccountListPage: 1,
        franchiseesAccountListSizes: [10, 20, 50, 100],
        franchiseesAccountListSize: 10,
        franchiseesAccountListTotal: 0,

        //加盟商结算详情
        showTips: false,
        franchiseesAccountDetailList: [],
        franchiseesAccountDetailListSearchForm: {
          dateTime: ''
        },
        exportOneLoading: false,
        franchiseesAccountDetailListLoading: false,
        franchiseesAccountDetailListPage: 1,
        franchiseesAccountDetailListSizes: [10, 20, 50, 100],
        franchiseesAccountDetailListSize: 10,
        franchiseesAccountDetailListTotal: 0,

        /*公用*/
        activeName: 'franchiseesMachineAccountListPane',

      }
    },
    methods: {
      /* 加盟商设备流水 */
      searchMachineAccountList() {
        this.machineAccountListLoading = true;
        getAccountList(this.machineAccountListSearchForm, this.machineAccountListPage, this.machineAccountListSize).then(response => {
          this.machineAccountListLoading = false;
          this.machineAccountList = response.response;
          this.machineAccountListTotal = response.total;
        })
      },
      showFranchiseesAccountDetailList(row) {
        this.activeName = 'franchiseesAccountDetailListPane';
        this.showTips = true;
        this.selectFranchiseesAccount = row.id;
        this.searchFranchiseesAccountDetailList();
      },
      getFranchiseesSelect() {
        getFranchiseesSelectList().then(response => {
          if (response.code === 0) {
            this.franchiseesSelectList = response.response;
          }
        });
      },
      handleMachineAccountListSizeChange(size) {
        this.machineAccountListSize = size;
        this.searchMachineAccountList();
      },
      handleMachineAccountListCurrentChange(page) {
        this.machineAccountListPage = page;
        this.searchMachineAccountList();
      },

      /* 加盟商结算 */
      searchFranchiseesAccountList() {
        this.franchiseesAccountListLoading = true;
        getFranchiseesAccountList(this.franchiseesAccountListSearchForm, this.franchiseesAccountListPage, this.franchiseesAccountListSize).then(response => {
          this.franchiseesAccountListLoading = false;
          if (response.code === 0) {
            this.franchiseesAccountList = response.response;
            this.franchiseesAccountListTotal = response.total;
          }
        })
      },
      handleFranchiseesAccountListSizeChange(size) {
        this.machineAccountListSize = size;
        this.searchFranchiseesAccountList();
      },
      handleFranchiseesAccountListCurrentChange(page) {
        this.machineAccountListPage = page;
        this.searchFranchiseesAccountList();
      },

      /* 结算详情*/
      searchFranchiseesAccountDetailList() {
        if (this.selectFranchiseesAccount) {
          let data = {
            'dateTime': this.franchiseesAccountDetailListSearchForm.dateTime,
            'id': this.selectFranchiseesAccount
          };
          this.franchiseesAccountDetailListLoading = true;
          getFranchiseesAccountDetailList(data, this.franchiseesAccountDetailListPage, this.franchiseesAccountDetailListSize).then(response => {
            this.franchiseesAccountDetailListLoading = true;
            if (response.code === 0) {
              this.franchiseesAccountDetailList = response.response;
              this.franchiseesAccountDetailListTotal = response.total;
            }
          });
        }
      },
      showDetail(row, event) {
        let data = {
          'endDate': row.thisSettlementDate,
          'id': row.franchiseeId
        };
        this.franchiseesProfitMachineDetailListLoading = true;
        getFranchiseesDetailBySettlementDate(data).then(response => {
          this.franchiseesProfitMachineDetailListLoading = false;
          if (response.code === 0) {
            this.franchiseesProfitMachineDetailDialogVisible = true;
            this.franchiseesProfitMachineDetailList = response.response;
          } else {
            this.franchiseesProfitMachineDetailDialogVisible = false;
          }
        })
      },
      exportOne() {
        if (this.selectFranchiseesAccount) {
          let data = {
            'dateTime': this.franchiseesAccountDetailListSearchForm.dateTime,
            'id': this.selectFranchiseesAccount
          };
          this.exportOneLoading = true;
          exportOneFranchiseeAccountExcel(data).then(response => {
            this.exportOneLoading = false;
            if (response.code === 0) {
              if (response.response && response.response.length > 0) {
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
            } else {
              this.$notify.info({
                title: '导出Excel',
                message: '导出失败',
                duration: 3000
              });
            }
          });
          let _this = this;
          let close = setTimeout(function () {
            if (_this.exportOneLoading === true) {
              _this.exportOneLoading = false;
              _this.$notify.info({
                title: '-_-||',
                message: '导出Excel失败',
                duration: 3000
              });
            }
          }, 300000);
        }
      },
      handleFranchiseesAccountDetailListSizeChange(size) {
        this.franchiseesAccountDetailListSize = size;
        this.searchFranchiseesAccountDetailList();
      },
      handleFranchiseesAccountDetailListCurrentChange(page) {
        this.franchiseesAccountDetailListPage = page;
        this.searchFranchiseesAccountDetailList();
      },

      /*公用*/
      selectTab(va) {
        if (va.name === "franchiseesAccountListPane") {
          this.searchFranchiseesAccountList();
        }
        if (va.name !== 'franchiseesAccountDetailListPane') {
          this.showTips = false;
          this.selectFranchiseesAccount = '';
          this.franchiseesAccountDetailList = [];
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return Number(cellValue).toFixed(2) + '元';
        } else {
          return "0元";
        }
      },
      //格式化时间
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 2)
        } else {
          return cellValue;
        }
      },
      formatterStatus(row, column, cellValue) {
        if (cellValue || cellValue === 0) {
          if (cellValue === 0) {
            return '已结算';
          } else if (cellValue === 1) {
            return '未结算';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },
      formatterProfit(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '%';
        }
      },
      formatterPayPeriod(row, column, cellValue) {
        if (cellValue) {
          return 'T + ' + cellValue;
        }
      },
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
