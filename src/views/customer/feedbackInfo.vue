<template>
  <div style="margin: 1% 2%;">
    <el-row :gutter="20">
      <el-form :inline="true" :model="feedbackSearchForm" ref="feedbackSearchForm" class="demo-form-inline">
        <el-col :span="5">
        <el-form-item label="设备名称" prop="machineName">
          <el-input v-model="feedbackSearchForm.machineName" placeholder="设备名称"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="5">
        <el-form-item label="手机号码" prop="mobile">
          <el-input type="text" v-model="feedbackSearchForm.mobile" placeholder="请输入手机号码"
                    pattern="^[0-9]*[1-9][0-9]*$"
                    :maxlength="11" style=";width: 132%"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="5">
        <el-form-item label="反馈信息" prop="content">
          <el-input v-model="feedbackSearchForm.content" placeholder="反馈信息"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="时间" prop="dateTime">
          <div class="block">
            <el-date-picker
              v-model="feedbackSearchForm.dateTime"
              type="datetimerange"
              :picker-options="pickerOption"
              placeholder="请选择反馈时间范围"
              align="right">
            </el-date-picker>
          </div>
        </el-form-item>
        </el-col>

        <el-col :span="5">
        <el-form-item label="处理状态"  prop="status">
          <el-select v-model="feedbackSearchForm.status" clearable placeholder="请选择审核状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="5">
        <el-form-item>
          <el-button type="primary" icon="search" @click="getFeedbackList">查询</el-button>
          <el-button type="primary" @click="resetForm" icon="delete">重置</el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </el-row>

      <el-table
        v-loading="feedbackListLoading"
        :data="feedbackList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="ID" align="center">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="手机号码" align="center">
                <span>{{ props.row.mobile }}</span>
              </el-form-item>
              <el-form-item label="反馈信息" align="center">
                <span>{{ props.row.content }}</span>
              </el-form-item>
              <el-form-item label="设备名称" align="center">
                <span>{{props.row.machineName}}</span>
              </el-form-item>
              <el-form-item label="地址" align="center">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="日期" align="center">
                <span>{{ props.row.createdDate }}</span>
              </el-form-item>
              <el-form-item label="处理详情" align="center">
                <span>{{ props.row.dealDetail }}</span>
              </el-form-item>
              <el-form-item label="处理人" align="center">
                <span>{{ props.row.handler }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号码" align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="反馈信息" align="center">
        </el-table-column>
        <el-table-column
          prop="machineName"
          label="设备名称" align="center">
        </el-table-column>
        <el-table-column
          prop="createdDate"
          label="日期"
          align="center">
        </el-table-column>
        <el-table-column
          prop="dealDetail"
          label="处理详情" align="center">
        </el-table-column>
        <el-table-column
          prop="handler"
          label="处理人"
          align="center">
        </el-table-column>
        <el-table-column prop="tag" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" v-loading="dealLoading" :disabled="scope.row.status === 0 ? false:true"
                       v-show="scope.row.status === 0 ? true:false"
                       size="small"
                       @click="preFeedbackDeal(scope.$index, scope.row)">处理
            </el-button>
            <el-button type="primary" :disabled="scope.row.status === 0 ? false:true"
                       size="small" v-show="scope.row.status === 0 ? false:true"
            >已处理
            </el-button>
          </template>
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
      <el-dialog :title="dialogTitle" :visible.sync="dialogShow" v-on:close="resetForm2">
        <div style="align-content:center">
          <el-form :model="feedbackDelDetail" ref="feedbackDelDetailForm" :rules="feedbackDelDetailRules"
                   v-loading="formLoading"
                  >
            <el-form-item prop="feedbackId" v-show="false">
              <el-input type="text" v-model="feedbackDelDetail.feedbackId"></el-input>
            </el-form-item>
            <el-form-item prop="dealDetail">
              <el-input type="textarea" v-model="feedbackDelDetail.dealDetail" :autosize="{ minRows: 4}" placeholder="请输入处理详情"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveFeedbackdeal(feedbackDelDetail)" :loading="saveLoading">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import {fetchFeedbackList, fetchDealFeedback} from 'api/feedback';

  export default {
    created() {
      this.getFeedbackList()
    },
    data() {
      return {
        feedbackSearchForm: {
          mobile: '',
          machineName: '',
          content: '',
          dateTime: '',
          status: ''
        },
        feedbackDelDetail: {
          feedbackId: '',
          dealDetail: ''
        },
        feedbackList: [],
        feedbackListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        formLoading: false,
        dealLoading: false,
        saveLoading: false,
        filterText: '',
        mobileLength: 11,
        menus: [],
        dialogTitle: '',
        dialogShow: false,

        feedbackDelDetailRules: {
          dealDetail: [
            { required: true, message: '请输入处理详情', trigger: 'blur' }
          ]
        },
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
        },
        options: [{
          value: 0,
          label: '未处理'
        }, {
          value: 1,
          label: '已处理'
        }]
      }
    },
    methods: {
      getFeedbackList() {
        if(this.checkMobile()){
          return;
        }
        this.feedbackListLoading = true
        fetchFeedbackList(this.feedbackSearchForm, this.page, this.size).then(response => {
          this.feedbackListLoading = false
          this.feedbackList = response.response
          this.total = response.total
        })
      },
      preFeedbackDeal(index, feedback) {
        this.feedbackDelDetail.feedbackId = feedback.id
        this.dialogTitle = '处理详情'
        this.dialogShow = true
      },
      saveFeedbackdeal(feedbackDelDet) {
        this.saveLoading = true
        this.$refs['feedbackDelDetailForm'].validate((valid) => {
          if (valid){
            fetchDealFeedback(feedbackDelDet).then(response => {
              this.dealLoading = false
              if (response.code === 0) {
                this.getFeedbackList()
                this.resetForm2()
                this.saveLoading = false
                this.dialogShow = false
              } else {
                this.saveLoading = false
              }
            })
          } else {
            this.saveLoading = false
            return false
          }
        })
      },
      //重置表单
      resetForm() {
        this.$refs['feedbackSearchForm'].resetFields();
      },
      resetForm2() {
        if (this.$refs['feedbackDelDetailForm']) {
          this.$refs['feedbackDelDetailForm'].resetFields();
          console.log("##################################################")
        }
      },
      cancel() {
        this.resetForm2()
        this.dialogShow = false
      },
      //去除输入的非数字
      checkMobile() {
        if(this.feedbackSearchForm.mobile !== "") {
          this.feedbackSearchForm.mobile = (this.feedbackSearchForm.mobile).replace(/[^0-9]/ig, "");
          if(this.feedbackSearchForm.mobile === "") {
            this.open('手机号码输入框中请输入数字');
            return true;
          }
        }
      },
      open(mes) {
        this.$message({
          message: mes,
          type: 'warning'
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleSizeChange(val) {
        this.size = val
        this.getFeedbackList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getFeedbackList()
      }
    },

    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
    width: 30%;
  }
</style>
