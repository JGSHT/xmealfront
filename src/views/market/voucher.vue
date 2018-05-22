<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName"
             @tab-click="selectTab">
      <el-tab-pane name="voucherListActive">

        <span slot="label">兑换券列表</span>
        <el-form :inline="true" :model="voucherForm" ref="voucherForm" class="demo-form-inline">
          <div style="margin-bottom: 10px">
            <div>
              <el-form-item label="机构" prop="parentIdList">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="voucherForm.parentIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构"
                  style="width:250px"></el-cascader>
              </el-form-item>
              <el-form-item style="margin-left: 5%">
                <el-button type="primary" round icon="el-icon-search" @click="search">查询</el-button>
              </el-form-item>
              <el-button type="primary" round icon="el-icon-plus" @click="createDialog" style="float: right; margin-right: 10px">
                生成兑换券
              </el-button>
            </div>
          </div>
        </el-form>

        <el-tooltip class="item" effect="dark" content="双击行显示详情" placement="top-end">
          <el-table
            v-loading.body="voucherListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="voucherList"
            stripe
            border
            highlight-current-row
            ref="voucherList"
            @row-dblclick="getVoucherDetail"
            style="width: 100%;">
            <el-table-column prop="officeName" label="机构名称" align="center"></el-table-column>
            <el-table-column prop="beginDate" label="生成日期" :formatter="formatterDateTime" align="center"></el-table-column>
            <el-table-column prop="endDate" label="截至日期" :formatter="formatterDateTime" align="center"></el-table-column>
            <el-table-column prop="countUsed" label="已使用数量" align="center" :formatter="formatterNumber"></el-table-column>
            <el-table-column prop="total" label="总数" align="center" :formatter="formatterNumber"></el-table-column>
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

      </el-tab-pane>

      <el-tab-pane name="voucherDetailPane">
        <span slot="label">兑换券详情</span>

        <label>状态</label>
        <el-select v-model="searchType"
                   clearable
                   filterable
                   placeholder="请选择搜索的兑换券的状态"
                   style="width: 220px;margin-top: 10px; margin-bottom: 20px;margin-left: 10px"
                   @change="statusChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="getDetailExcel" type="primary"
                   style="float: right; margin-right: 10px;margin-top: 10px; margin-bottom: 20px"
                   round
                   :disabled="!voucherDetail || voucherDetail.length <= 0"
                   icon="el-icon-share">导出excel
        </el-button>
        <el-table :data="voucherDetail"
                  v-loading.body="voucherDetailLoading"
                  element-loading-text="小喵使出了洪荒之力为您加载。。。"
                  border
                  style="width: 100%;">
          <el-table-column property="voucherCode" label="兑换码" align="center"></el-table-column>
          <el-table-column property="worth" label="面值" align="center":formatter="formatterMoney"></el-table-column>
          <el-table-column property="useState" label="状态" align="center"></el-table-column>
        </el-table>

      </el-tab-pane>

    </el-tabs>

    <!--用于导出excel-->
    <a id="getExcel" style="display: none"></a>

    <!--生成兑换券-->

    <el-dialog title="生成兑换券" clearable :visible.sync="dialogTableVisible"
               @close="closeDialog">
      <el-card class="box-card" style="margin-top: 5px">
        <el-form label-position="left" :model="createdVoucher" inline
                 style="margin-left: 10px; margin-top: 20px" ref="createdVoucher">
          <el-form-item label="机构" prop="officeForCreated">
            <el-select v-model="createdVoucher.officeForCreated" clearable placeholder="请选择机构"
                       :filterable="true"
                       style="width: 300px;">
              <el-option
                v-for="item in officeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="money" label="金额" style="margin-left: 20px;">
            <el-input v-model="createdVoucher.money" placeholder="兑换券金额"
                      v-on:blur="checkNum(0, createdVoucher.money)">
            </el-input>
          </el-form-item>
          <el-form-item label="时间" prop="dateTime">
            <div class="block">
              <el-date-picker
                v-model="createdVoucher.dateTime"
                type="datetimerange"
                :picker-options="pickerOption"
                placeholder="请选择时间范围"
                align="right"
                style="width: 300px;">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item prop="count" label="数量" style="margin-left: 20px;">
            <el-input v-model="createdVoucher.count" placeholder="兑换券数量" v-on:blur="checkNum(1, createdVoucher.count)">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item style="margin-left: 300px;margin-top: 10px">
            <el-button type="primary" round icon="el-icon-edit" :loading="createdVoucherLoading" @click="createdVoucherList">生成</el-button>
            <el-button @click="resetForm('createdVoucher')" round icon="el-icon-delete">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

    </el-dialog>


  </div>
</template>
<script>

  import { fetchOfficeTree } from '../../api/office';
  import { fetchCreatedVoucher, fetchExcel, fetchVoucher, getDetailVoucher } from '../../api/voucher';

  export default {
    created() {
      this.search();
      this.fetchOfficeCasc();
    },
    data() {
      return {
        voucherForm: {
          parentIdList: [],
          companyId: '',
          regionId: '',
          officeId: ''
        },
        offices: [],
        voucherList: [],
        // 兑换券分页
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        // 标签页
        activeName: 'voucherListActive',
        hasBorder: true,
        // 机构下拉框数据源
        officeList: [],
        // 当前选中行
        currentRow: '',
        // 创建兑换券
        createdVoucher: {
          // 机构下拉框选择数据
          officeForCreated: '',
          money: '',
          count: '',
          dateTime: ''
        },
        // 兑换券详情
        voucherDetail: [],
        searchType: '',
        voucherDetailLoading: false,
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '已使用'
        }, {
          value: '2',
          label: '未使用'
        }],
        dialogTableVisible: false,
        createdVoucherLoading: false,
        // 初始化时间快捷选项
        pickerOption: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '一周',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '一个月',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '半年',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 182);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        officeDisabled: false,
        voucherListLoading: false
      }
    },
    methods: {
      // 查询订单记录
      search() {
        this.voucherListLoading = true;
        fetchVoucher(this.voucherForm, this.page, this.size).then(response => {
          this.voucherListLoading = false;
          this.voucherList = response.response;
          this.total = response.total;
        });
      },
      // 初始化机构
      fetchOfficeCasc() {
        fetchOfficeTree().then(response => {
          this.offices = response.response[0].children;
        });
      },
      // 去除输入的非数字
      checkNum(type, val) {
        if (val != '') {
          val = parseInt(val.replace(/[^0-9]/ig, ''));
          if (type === 0) {
            if (isNaN(val)) {
              this.createdVoucher.money = '';
            } else {
              this.createdVoucher.money = val;
            }
          } else {
            if (isNaN(val)) {
              this.createdVoucher.count = '';
            } else {
              this.createdVoucher.count = val;
            }
          }
        }
      },
      handleSizeChange(val) {
        this.size = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      // selectTab(tab) {
      //   // if (tab.name === 'voucherDetailPane') {
      //   //   if (this.currentRow || this.currentRow === '') {
      //   //     this.$notify.info({
      //   //       title: '提示',
      //   //       message: '请先选择要展示详情的兑换券',
      //   //       duration: 3000
      //   //     });
      //   //   }
      //   // }
      // },
      showDetail() {
        this.activeName = 'voucherDetailPane';
        this.voucherDetailLoading = true;
        getDetailVoucher(this.currentRow.beginDate, this.currentRow.endDate, this.searchType, this.currentRow.officeId).then(response => {
          this.voucherDetailLoading = false;
          this.voucherDetail = response.response;
        });
      },
      statusChange(type) {
        this.searchType = type;
        this.showDetail();
      },
      // 获取兑换券详情
      getVoucherDetail(row, event) {
        this.currentRow = row;
        this.searchType = '';
        this.showDetail();
      },
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 2)
        } else {
          return cellValue;
        }
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元';
        } else {
          return cellValue;
        }
      },
      formatterNumber(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '张'
        } else {
          return cellValue;
        }
      },
      // 显示生产兑换券弹窗
      createDialog() {
        this.dialogTableVisible = true;
        if (this.officeList == '') {
          fetchOfficeTree().then(response => {
            for (let countRoot = 0; countRoot < response.response.length; countRoot++) {
              // 获取大区
              const companyList = response.response[countRoot].children;
              for (let countRegion = 0; countRegion < companyList.length; countRegion++) {
                const regionList = companyList[countRegion].children;
                for (let countOffice = 0; countOffice < regionList.length; countOffice++) {
                  const officeList = regionList[countOffice].children;
                  for (let count = 0; count < officeList.length; count++) {
                    const o = {
                      value: officeList[count].id,
                      label: officeList[count].name
                    };
                    this.officeList.push(o);
                  }
                }
              }
            }
          });
        }
      },
      // 生成兑换券
      createdVoucherList() {
        if (!this.createdVoucher.officeForCreated) {
          this.$message({
            showClose: true,
            message: '请选择机构',
            duration: 1000
          });
          return;
        }
        if (!this.createdVoucher.money) {
          this.$message({
            showClose: true,
            message: '请输入金额',
            duration: 1000
          });
          return;
        }
        if (!this.createdVoucher.count) {
          this.$message({
            showClose: true,
            message: '请输入兑换券数量',
            duration: 1000
          });
          return;
        }
        if (!this.createdVoucher.dateTime || this.createdVoucher.dateTime.length !== 2) {
          this.$message({
            showClose: true,
            message: '请输入兑换券使用时间区间',
            duration: 1000
          });
          return;
        }
        this.createdVoucherLoading = true;
        setTimeout(function() {
          if (this.createdVoucherLoading) {
            this.createdVoucherLoading = false;
          }
        }, 300000);
        fetchCreatedVoucher(this.createdVoucher).then(response => {
          this.createdVoucherLoading = false;
          const oGetExcel = document.getElementById('getExcel');
          if (response.code !== 0 || response.response.length !== 2 || !response.response[0] || !response.response[1]) {
            if (response.response.length !== 2 || !response.response[0] || !response.response[1]) {
              response.desc = '';
            }
            this.$message({
              message: '生成兑换券失败',
              type: 'error',
              duration: 1000
            });
          } else {
            oGetExcel.setAttribute('href', response.response[0]);
            oGetExcel.setAttribute('download', response.response[1]);
            oGetExcel.click();
            this.dialogTableVisible = false;
            this.clearCreatedVoucher();
            this.$message({
              message: '生成兑换券成功',
              type: 'success',
              duration: 2000
            });
          }
        });
      },
      getDetailExcel() {
        if (!this.currentRow || this.currentRow === '') {
          this.$message({
            showClose: true,
            message: '没有可导出的数据',
            duration: 3000,
            type: 'warning'
          });
        } else if (!this.voucherDetail || this.voucherDetail.length <= 0) {
          this.$message({
            showClose: true,
            message: '没有该使用状态的兑换券可供导出',
            duration: 3000,
            type: 'warning'
          });
        } else {
          this.createdVoucherLoading = true;
          setTimeout(function() {
            if (this.createdVoucherLoading) {
              this.createdVoucherLoading = false;
            }
          }, 300000);
          fetchExcel(this.currentRow, this.searchType).then(response => {
            this.createdVoucherLoading = false;
            if (response.code !== 0 || response.response.length !== 2 || !response.response[0] || !response.response[1]) {
              if (response.response.length !== 2 || !response.response[0] || !response.response[1]) {
                response.desc = '';
              }
              this.$message({
                showClose: true,
                message: '获取excel失败,' + response.desc,
                duration: 3000,
                type: 'warning'
              });
            } else {
              const oGetExcel = document.getElementById('getExcel');
              oGetExcel.setAttribute('href', response.response[0]);
              oGetExcel.setAttribute('download', response.response[1]);
              oGetExcel.click();
            }
          })
        }
      },
      handleChange(value) {
        if (value[0]) {
          this.voucherForm.companyId = value[0]
        } else {
          this.voucherForm.companyId = ''
        }
        if (value[1]) {
          this.voucherForm.regionId = value[1]
        } else {
          this.voucherForm.regionId = ''
        }
        if (value[2]) {
          this.voucherForm.officeId = value[2]
        } else {
          this.voucherForm.officeId = ''
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 关闭弹窗
      closeDialog() {
        this.search();
        this.clearCreatedVoucher();
      },
      // 清空生成兑换券表单数据
      clearCreatedVoucher() {
        this.createdVoucher = {
          // 机构下拉框选择数据
          officeForCreated: '',
          money: '',
          count: '',
          dateTime: ''
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
