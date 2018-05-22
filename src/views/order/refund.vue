<template>
  <div style="margin: 1% 2%;">
    <el-form :model="refundSearchForm" ref="refundSearchForm" class="demo-form-inline" label-width="70px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-form-item label="机构" label-width="45px" prop="parentIdList">
            <el-cascader
              :disabled="officeDisabled"
              :options="offices"
              v-model="refundSearchForm.parentIdList"
              :props="cascProps"
              clearable
              @change="handleChange"
              change-on-select
              placeholder="请选择机构"
              style="width: 100%"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备" prop="machineId" label-width="40px">
            <el-select v-model="refundSearchForm.machineId"
                       clearable
                       filterable
                       placeholder="请选择设备"
                       style="width: 100%">
              <el-option
                v-for="item in machines"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退款原因" prop="reason">
            <el-input v-model="refundSearchForm.reason" placeholder="请输入退款原因" style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-form-item label="时间" prop="dateTime" label-width="45px">
            <div class="block">
              <el-date-picker
                v-model="refundSearchForm.dateTime"
                type="datetimerange"
                :picker-options="pickerOption"
                placeholder="请选择时间范围"
                align="right"
                style="width:97%;">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号" prop="primaryOrderId" label-width="55px">
            <el-input v-model="refundSearchForm.primaryOrderId" placeholder="请输入订单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label=" 手机号" prop="mobile" label-width="70px">
            <el-input type="text"
                      v-model="refundSearchForm.mobile"
                      style="width: 100%"
                      placeholder="请输入顾客手机号"
                      pattern="^[0-9]*[1-9][0-9]*$"
                      :maxlength="11"
                      v-on:blur="checkMobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label=" 查询范围">
            <el-switch active-text="全部" inactive-text="成功" v-model="refundSearchForm.status"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="10" :push="1">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" round @click="search">查询</el-button>
            <el-button icon="el-icon-delete" round @click="resetForm">重置</el-button>
            <el-button icon="el-icon-share" round @click="exportExcel" :loading="exportExcelLoading">导出Excel</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--:summary-method="getSummaries"
    show-summary-->
    <el-table
      v-loading.body="refundListLoading"
      element-loading-text="小喵使出了洪荒之力为您加载。。。"
      :data="refundList"
      stripe
      :border="true"
      highlight-current-row
      ref="refOrderList"
      style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" style="width: 100%;margin-left: 5%">
            <el-form-item class="detail" label="订单编号:">
              <span>{{ props.row.primaryOrderId }}</span>
            </el-form-item>
            <el-form-item class="detail" label="退款单编号:">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item class="detail" label="设备名称:">
              <span>{{ props.row.machineName }}</span>
            </el-form-item>
            <el-form-item class="detail" label="申请金额:">
              <span>￥{{ props.row.totalMoney }}元</span>
            </el-form-item>
            <el-form-item class="detail" label="申请时间:">
              <span>{{ props.row.createdDate ? props.row.createdDate.substring(0, props.row.createdDate.length - 2) : ''
                }}</span>
            </el-form-item>
            <el-tooltip class="item" effect="dark" :content="props.row.reason" placement="bottom-start">
              <el-form-item style="margin-right: 5%;margin-bottom: 10px;width: 60%;" label="退 款 原 因:">
                <span>{{ props.row.reason }}</span>
              </el-form-item>
            </el-tooltip>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="primaryOrderId" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="totalMoney" label="退款金额" align="center" :formatter="formatterMoney"></el-table-column>
      <el-table-column prop="mobile" label="顾客手机号" align="center"></el-table-column>
      <el-table-column prop="officeName" label="机构名称" align="center"></el-table-column>
      <el-table-column prop="status" label="退款状态" align="center"></el-table-column>
    </el-table>

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
  </div>
</template>

<script>

  import { fetchOfficeTree } from '../../api/office';
  import { fetchRefundList, getExcel } from '../../api/refund';
  import { getMachineListForSelect } from '../../api/chart';

  export default {
    created() {
      this.search();
      this.fetchOfficeCasc();
    },
    data() {
      return {
        refundSearchForm: {
          parentIdList: [],
          mobile: '',
          primaryOrderId: '',
          reason: '',
          machineId: '',
          status: true,
          dateTime: '',
          companyId: '',
          regionId: '',
          officeId: ''
        },
        machines: [],
        offices: [],
        refundList: [],

        // 分页
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        exportExcelLoading: false,

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
        },

        cascProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },

        refundListLoading: false,
        officeDisabled: false
      }
    },
    methods: {
      // 查询退款信息记录
      search() {
        this.refundListLoading = true;
        fetchRefundList(this.refundSearchForm, this.page, this.size).then(response => {
          this.refundListLoading = false;
          this.refundList = [];
          this.refundList = response.response;
          this.total = response.total;
        });
      },
      // 重置表单
      resetForm() {
        this.$refs.refundSearchForm.resetFields();
        this.refundSearchForm.status = true;
      },
      // 初始化机构
      fetchOfficeCasc() {
        fetchOfficeTree().then(response => {
          this.offices = response.response[0].children;
        });
      },
      // 去除输入的非数字
      checkMobile() {
        this.refundSearchForm.mobile = this.refundSearchForm.mobile.replace(/[^0-9]/ig, '');
      },
      handleSizeChange(val) {
        this.size = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元';
        } else {
          return cellValue;
        }
      },
      handleChange(value) {
        if (value[0]) {
          this.refundSearchForm.companyId = value[0]
        } else {
          this.refundSearchForm.companyId = ''
        }
        if (value[1]) {
          this.refundSearchForm.regionId = value[1]
        } else {
          this.refundSearchForm.regionId = ''
        }
        if (value[2]) {
          this.refundSearchForm.officeId = value[2]
        } else {
          this.refundSearchForm.officeId = ''
        }
        this.refundSearchForm.machineId = '';
        if (value.length > 0) {
          getMachineListForSelect(this.refundSearchForm.companyId, this.refundSearchForm.regionId, this.refundSearchForm.officeId).then(response => {
            if (response.code === 0) {
              this.machines = response.response
            }
          })
        } else {
          this.machines = [];
        }
      },
      exportExcel() {
        this.exportExcelLoading = true;
        getExcel(this.refundSearchForm).then(response => {
          this.exportExcelLoading = false;
          if (response.code === 0 && response.response !== undefined && response.response != null && response.response.length > 0) {
            const oGetExcel = document.getElementById('getExcel');
            oGetExcel.setAttribute('href', response.response[0]);
            oGetExcel.setAttribute('download', response.response[1]);
            oGetExcel.click();
          } else {
            this.$notify.info({
              title: '导出Excel',
              message: response.desc,
              duration: 3000
            });
          }
        });
      }
      // 统计
      /* getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if(index === 2) {
            const values = data.map(item => Number(item[column.property]));
            console.log("values" + values)
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
               /!* if((values.status) == "退款失败")
                  curr = 0;*!/
                console.log("prev" + prev + "curr" + curr)
                const value = Number(curr);
                console.log(value)
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 元';
            }
          }
        });
        return sums;
      } */
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .detail {
    margin-right: 5%;
    margin-bottom: 10px;
    width: 18%;
  }
</style>
