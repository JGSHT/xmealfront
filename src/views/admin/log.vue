<template>
  <div style="margin: 1% 2%;">
    <el-row :gutter="20">
      <el-form :inline="true" :model="logParamsForm"  class="demo-form-inline">

        <el-col :span="5">
          <el-form-item label="用户名称">
            <el-input v-model="logParamsForm.userName" placeholder="用户名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="菜单名称">
            <el-input v-model="logParamsForm.title" placeholder="菜单名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="请求方式">
            <el-select v-model="logParamsForm.method" filterable clearable placeholder="选择请求方式">
              <el-option  value='GET' label="GET"></el-option>
              <el-option  value="POST" label="POST"></el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="8">
          <el-form-item label="时间" prop="dateTime">
            <el-date-picker
              v-model="logParamsForm.dateTime"
              type="datetimerange"
              :picker-options="pickerOption"
              placeholder="请选择申请时间范围">
            </el-date-picker>
          </el-form-item>
        </el-col>


        <el-col :span="5">
          <el-form-item>
            <el-button type="primary" @click="getLogList" icon="search">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>

    </el-row>
    <el-table
      v-loading="logListLoading"
      :data="logList"
      stripe
      border
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        prop="type"
        label="日志类型" align="center"
        :formatter="formatterLogType">
      </el-table-column>
      <el-table-column
        prop="title"
        label="日志标题" align="center">
      </el-table-column>
      <el-table-column
        prop="remoteAddr"
        label="操作地址" align="center">
      </el-table-column>
      <el-table-column
        prop="userAgent"
        label="硬件设备"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="requestUri"
        label="请求路径" align="center">
      </el-table-column>
      <el-table-column
        prop="method"
        label="请求方式"
        align="center">
      </el-table-column>
      <el-table-column
        prop="params"
        label="请求参数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createdBy"
        label="创建者"
        align="center"
        :formatter="formatterLogCreatedBy">
      </el-table-column>
      <el-table-column
        prop="createdDate"
        label="创建时间"
        align="center">
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
  </div>
</template>

<script>

  import {fetchLogList} from "../../api/log";

  export default {
    created: function () {
      this.getLogList();
    },
    data() {
      return {
        logParamsForm:{
          userName: '',
          title:'',
          method:'',
          dateTime: ''
        },
        menuFormRules: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ]
        },
        log: {
          id: '',
          type: '',
          title: '',
          remoteAddr: '',
          userAgent: '',
          requestUri: '',
          method: '',
          params: '',
          createdBy: '',
          createdDate: ''
        },
        logList: [],
        logLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        saveLoading: false,
        logListLoading:false,


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
      getLogList(){
        this.logListLoading = true;
        fetchLogList(this.logParamsForm,this.page,this.size).then(response => {
          this.logListLoading = false;
        this.logList = response.response;
        this.total = response.total;

      })
      },
      resetForm(){

      },
      handleSizeChange(val) {
        this.size = val
        this.getLogList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getLogList()
      },
      formatterLogType(logs) {
        if (logs.type == 1) {
          return '系统管理';
        }
        if(logs.type == 2){
          return '普通用户';
        }
      },
      formatterLogCreatedBy(logs) {
        if (logs.createdBy == 1) {
          return '超级管理员';
        }else
        if (logs.createdBy ==  31) {
          return '测试';
        }else
        if (logs.createdBy ==  39) {
          return '测试';
        }else
        if (logs.createdBy !=  1) {
          return '普通用户';
        }
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
