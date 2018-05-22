<template>
  <div style="margin: 1% 2%;">
    <el-row :gutter="20">
      <el-form :inline="true" :model="branchSearchForm" ref="branchForm" class="demo-form-inline">
        <el-col :span="5">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="branchSearchForm.companyName" placeholder="公司名称"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="5">
        <el-form-item label="申请人" prop="userName">
          <el-input v-model="branchSearchForm.userName" placeholder="请输入申请人姓名"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="8">
        <el-form-item label="时间" prop="dateTime">
            <el-date-picker
              v-model="branchSearchForm.dateTime"
              type="datetimerange"
              :picker-options="pickerOption"
              placeholder="请选择申请时间范围">
            </el-date-picker>
        </el-form-item>
        </el-col>

        <el-col :span="5">
        <el-form-item label="审核状态"  prop="status">
          <el-select v-model="branchSearchForm.status" clearable placeholder="请选择审核状态">
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
          <el-button type="primary" icon="search" @click="getBranchList">查询</el-button>
          <el-button type="primary" @click="resetForm" icon="delete">重置</el-button>
          <el-button icon="plus" @click="addBranch">新增</el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </el-row>

      <el-table
        v-loading="branchListLoading"
        :data="branchList"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <branchDetail :branch="props.row"></branchDetail>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="公司名称" align="center">
        </el-table-column>
        <el-table-column
          prop="peopleNumber"
          label="公司人数" align="center">
        </el-table-column>
        <el-table-column
          prop="buildingName"
          label="楼宇名称" align="center">
        </el-table-column>
        <el-table-column
          prop="area"
          label="隶属区域"
          align="center">
        </el-table-column>
        <el-table-column
          prop="rejectReason"
          label="驳回理由" align="center">
        </el-table-column>
        <el-table-column
          prop="createdDate"
          label="申请日期"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="申请人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="power"
          label="排插"
          align="center">
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          align="center">
        </el-table-column>
        <el-table-column prop="tag" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="branchEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="primary" :disabled="scope.row.status === 0 ? false:true"
                       v-show="scope.row.status != 2 ? true:false"
                       size="small"
                       @click="pass(scope.$index, scope.row)">通过
            </el-button>
            <el-button type="primary" v-loading="dealLoading" :disabled="scope.row.status === 0 ? false:true"
                       v-show="scope.row.status != 1 ? true:false"
                       size="small"
                       @click="preRejectDeal(scope.$index, scope.row)">驳回
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
      <el-dialog :title="dialogTitle" :visible.sync="addBranchDialogShow" :close="resetForm3">
        <div style="align-content:center">
          <el-form :inline="true" :model="branch" label-position="left" ref="branch2Form" :rules="branch2FormRules"
                   v-loading="formLoading" label-width="200px"
                   style="margin: 0 3%">

            <el-form-item label="公司名称" prop="companyName" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.companyName" placeholder="请输入公司名称"></el-input>
            </el-form-item>

            <el-form-item label="人数" prop="peopleNumber" label-width="100px">
              <el-input style="width: 480px;" type="number" pattern="[0-9]*"
                        v-model.number="branch.peopleNumber" placeholder="请输入公司人数"></el-input>
            </el-form-item>

            <el-form-item label="年龄层" prop="ageGroup" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.ageGroup" placeholder="请输入年龄层"></el-input>
            </el-form-item>

            <el-form-item label="男女比例" prop="ratio" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.ratio" placeholder="请输入男女比例"></el-input>
            </el-form-item>

            <el-form-item label="上班时间" prop="workBeginTime" label-width="100px">
              <el-time-select
                v-model="branch.workBeginTime"
                :picker-options="{start: '00:00',step: '00:15',end: '23:59'}"
                placeholder="请选择上班时间"
                style="width: 480px;">
              </el-time-select>
            </el-form-item>

            <el-form-item label="下班时间" prop="workEndTime" label-width="100px">
              <el-time-select
                v-model="branch.workEndTime"
                :picker-options="{start: '00:00',step: '00:15',end: '23:59'}"
                placeholder="请选择下班时间"
                style="width: 480px;">
              </el-time-select>
            </el-form-item>

            <el-form-item label="晚上是否加班" prop="nightWork" label-width="110px">
              <el-select v-model="branch.nightWork" style="width:480px">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="周末是否加班" prop="weekendWork" label-width="110px">
              <el-select v-model="branch.weekendWork" style="width:480px">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="公司地址" prop="companyAddress" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.companyAddress" placeholder="请输入公司地址"></el-input>
            </el-form-item>

            <el-form-item label="楼宇名称" prop="buildingName" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.buildingName" placeholder="请输入楼宇名称"></el-input>
            </el-form-item>

            <el-form-item label="设备台数" prop="machineNumber" label-width="100px">
              <el-input style="width: 480px;" type="number" pattern="[0-9]*"
                        v-model.number="branch.machineNumber" placeholder="请输入设备台数"></el-input>
            </el-form-item>

            <el-form-item label="设备型号" prop="machineType" label-width="100px">
              <el-input style="width: 480px;" v-model="branch.machineType" placeholder="请输入设备型号"></el-input>
            </el-form-item>

            <el-form-item label="设备放置点" prop="machinePosition" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.machinePosition" placeholder="请输入设备放置点"></el-input>
            </el-form-item>

            <el-form-item label="联系人" prop="linkman" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.linkman" placeholder="请输入联系人姓名"></el-input>
            </el-form-item>

            <el-form-item label="手机号码" prop="mobile" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.mobile" placeholder="请输入联系人手机号码"></el-input>
            </el-form-item>

            <el-form-item label="隶属区域" prop="officeIdList" label-width="100px">
              <el-cascader
                :options="offices"
                v-model="branch.officeIdList"
                :props="cascaderProps"
                clearable
                @change="handleBranchChange"
                placeholder="机构"
                style="width:480px">
              </el-cascader>
            </el-form-item>

            <el-form-item label="是否需要排插" prop="power" label-width="110px">
              <el-select v-model.trim="branch.power" style="width:480px">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="note" label="备注" align="center" label-width="100px">
              <el-input style="width: 480px;" v-model.trim="branch.note" ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveBranch" :loading="saveBranchLoading">确定</el-button>
          <el-button @click="addBranchDialogShow = false">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="dialogTitle" :visible.sync="dialogShow" v-on:close="resetForm2">
        <div style="align-content:center">
          <el-form :model="branchInfo" ref="branchDelDetailForm" :rules="rejectDelDetailRules"
                   v-loading="formLoading"
          >
            <el-form-item prop="id" v-show="false">
              <el-input type="text" v-model="branchInfo.id"></el-input>
            </el-form-item>
            <el-form-item prop="rejectReason">
              <el-input type="textarea" v-model="branchInfo.rejectReason" :autosize="{ minRows: 4}"
                        placeholder="请输入驳回理由"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveRejectdeal(branchInfo)" :loading="saveLoading">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import {fetchBranchList, fetchUadate, fetchSaveBranch, fetchUpdateBranch} from 'api/branchInfo';
  import branchDetail from './branchDetail';
  import {fetchOfficeTree} from 'api/office';
  import {fetchOffice2} from 'utils/office';

  export default {
    created() {
      this.getBranchList()
      this.getOffices()
    },
    components: {
      branchDetail
    },
    data() {
      return {
        branchSearchForm: {
          companyName: '',
          userName: '',
          dateTime: '',
          status: ''
        },
        branchInfo: {
          id: '',
          rejectReason: ''
        },
        addBranchDialogShow: false,
        saveBranchLoading: false,
        offices: [],
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        branch: {
          id: '',
          companyName: '',
          buildingName: '',
          peopleNumber: '',
          area: '',
          companyAddress: '',
          linkman: '',
          mobile: '',
          machineNumber: '',
          machinePosition: '',
          workBeginTime: '',
          workEndTime: '',
          nightWork: '',
          weekendWork: '',
          ageGroup: '',
          ratio: '',
          machineType: '',
          note: '',
          officeIdList: [],
          companyId: '',
          regionId: '',
          officeId: '',
          officeName: '',
          regionName: '',
          compName: '',
          power:'',
          remarks:''
        },
        options1: [{
          value: '1',
          label: '是'
        }, {
          value: '2',
          label: '否'
        }],
        branchList: [],
        branchListLoading: false,
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

        rejectDelDetailRules: {
          rejectReason: [
            {required: true, message: '请输入驳回理由', trigger: 'blur'}
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
        branch2FormRules: {
          companyName: [
            {required: true, message: '请输入公司名称', trigger: 'blur'}
          ],
          buildingName: [
            {required: true, message: '请输入楼宇名称', trigger: 'blur'}
          ],
          peopleNumber: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value == '' || !(/^\+?[1-9]\d*$/.test(value))) {
                  callback(new Error("请规范输入公司人数"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          companyAddress: [
            {required: true, message: '请输入公司地址', trigger: 'blur'}
          ],
          linkman: [
            {required: true, message: '请输入联系人姓名', trigger: 'blur'}
          ],
          mobile: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value === '' || !(/^1[34578]\d{9}$/.test(value))
                ) {
                  callback(new Error("请规范输入手机号码"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          machineNumber: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value == '' || !(/^\+?[1-9]\d*$/.test(value))) {
                  callback(new Error("请规范输入设备台数"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          machinePosition: [
            {required: true, message: '请输入设备放置点', trigger: 'blur'}
          ],
          workBeginTime: [
            {required: true, message: '请输入上班时间', trigger: 'blur'}
          ],
          workEndTime: [
            {required: true, message: '请输入下班时间', trigger: 'blur'}
          ],
          nightWork: [
            {required: true, message: '请选择晚上是否加班', trigger: 'blur'}
          ],
          weekendWork: [
            {required: true, message: '请选择周末是否加班', trigger: 'blur'}
          ],
          ageGroup: [
            {required: true, message: '请输入年龄层', trigger: 'blur'}
          ],
          ratio: [
            {required: true, message: '请输入男女比例', trigger: 'blur'}
          ],
          machineType: [
            {required: true, message: '请输入设备型号', trigger: 'blur'}
          ],
          officeIdList: [
            {type: 'array', required: true, message: '请选择隶属区域', trigger: 'change'}
          ],
          power: [
            {required: true, message: '请选择是否需要排插', trigger: 'blur'}
          ],
          remarks: [
            {required: true,  trigger: 'blur'}
          ],
        },
        options: [{
          value: 1,
          label: '通过'
        }, {
          value: 2,
          label: '驳回'
        }
        ]
      }
    },
    methods: {
      getOffices() {
        fetchOfficeTree().then(response => {
          if (response.response) {
            this.offices = response.response[0].children
          }
        })
      },
      handleBranchChange(value) {
        if (value[0]) {
          this.branch.companyId = value[0]
        } else {
          this.branch.companyId = ''
        }
        if (value[1]) {
          this.branch.regionId = value[1]
        } else {
          this.branch.regionId = ''
        }
        if (value[2]) {
          this.branch.officeId = value[2]
        } else {
          this.branch.officeId = ''
        }
        fetchOffice2(this.offices, this.branch, value);
      },
      saveBranch() {
        this.$refs['branch2Form'].validate((valid) => {
          if (valid) {
            this.saveBranchLoading = true
            fetchSaveBranch(this.branch).then(response => {
              if (response.code === 0){
                //console.log('jlk8888888888888')
                console.log(this.branch)
                this.getBranchList()
                this.saveBranchLoading = false
                this.$message.success('保存成功')
                this.addBranchDialogShow = false
              } else {
                this.saveBranchLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      branchEdit(index, row) {
        this.resetForm3()
        this.dialogTitle = '编辑网点'
        this.addBranchDialogShow = true
        fetchUpdateBranch(row).then(response => {
          this.formLoading = false;
          this.branch = response.response;
          this.branch.officeIdList = [];
          this.branch.officeIdList.push(response.response.companyId.toString());
          this.branch.officeIdList.push(response.response.regionId.toString());
          this.branch.officeIdList.push(response.response.officeId.toString());
        })
      },
      getBranchList() {
        this.branchListLoading = true
        fetchBranchList(this.branchSearchForm, this.page, this.size).then(response => {
          this.branchListLoading = false
          this.branchList = response.response
          this.total = response.total
        })
      },
      addBranch() {
        this.resetForm3()
        this.dialogTitle = '新增网点';
        this.addBranchDialogShow = true
      },
      pass(index, data) {
        let branch = data
        branch.status = 1
        fetchUadate(branch).then(response => {
          if (response.code === 0) {
            data.status = 1
          }
        })
      },
      preRejectDeal(index, branch) {
        this.branchInfo.id = branch.id
        this.dialogTitle = '驳回理由'
        this.dialogShow = true
      },
      saveRejectdeal(branchDelDet) {
        this.saveLoading = true
        let branch = branchDelDet
        branch.status = 2
        this.$refs['branchDelDetailForm'].validate((valid) => {
          if (valid) {
            fetchUadate(branch).then(response => {
              this.dealLoading = false
              if (response.code === 0) {
                this.getBranchList()
                this.resetForm2()
                this.saveLoading = false
                this.dialogShow = false
                branchDelDet.status = 2
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
        if (this.$refs['branchForm']) {
          this.$refs['branchForm'].resetFields();
        }
      },
      resetForm2() {
        if (this.$refs['branchDelDetailForm']) {
          this.$refs['branchDelDetailForm'].resetFields();
          //console.log("##################################################")
        }
      },
      resetForm3() {
        if (this.$refs['branch2Form']) {
          this.$refs['branch2Form'].resetFields();
        }
        this.branch.id = ''
      },
      cancel() {
        this.resetForm2()
        this.dialogShow = false
      },
      open(mes) {
        this.$message({
          message: mes,
          type: 'warning'
        });
      },
      handleSizeChange(val) {
        this.size = val
        this.getBranchList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getBranchList()
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
