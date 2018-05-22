<template>
  <div style="margin: 0% 2%;">
    <el-tabs v-model="activeName">
      <el-tab-pane name="franchiseesList">
        <span slot="label"><i class="el-icon-document"></i> 加盟商列表</span>
        <el-form :model="franchiseesSearch" ref="franchiseesSearch" class="demo-form-inline" label-width="50px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="名称" prop="name">
                <el-input v-model="franchiseesSearch.name" clearable placeholder="加盟商名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" :push="1">
              <el-form-item label="日期" prop="dateTime">
                <div class="block">
                  <el-date-picker
                    v-model="franchiseesSearch.dateTime"
                    type="datetimerange"
                    :picker-options="pickerOption"
                    placeholder="请选择加盟日期时间范围"
                    align="right"
                    style="width:100%">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6" :push="2">
              <el-form-item label="等级" prop="level">
                <el-select v-model="franchiseesSearch.level"
                           filterable
                           clearable
                           placeholder="请选择加盟商等级">
                  <el-option
                    v-for="item in franchiseesLevelSelectList"
                    :key="item.id"
                    :label="item.levelName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="状态" prop="status">
                <el-select v-model="franchiseesSearch.status"
                           filterable
                           clearable
                           placeholder="请选择加盟商状态">
                  <el-option
                    v-for="item in franchiseesStatusSelectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="searchFranchiseesInfo">查询</el-button>
                <el-button icon="el-icon-delete" round @click="resetForm('franchiseesSearch')">重置
                </el-button>
                <el-button v-if="couldAdd" icon="el-icon-plus" round @click="operatorFranchiseeDialogVisible = true">新增
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          v-loading="franchiseesListLoading"
          :data="franchiseesList"
          stripe
          border
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand" label-width="70px">
                <el-form-item label="联系方式">
                  <span>{{ props.row.mobile }}</span>
                </el-form-item>
                <el-form-item label="账户余额">
                  <span v-if="props.row.balance !== null || props.row.balance != undefined">{{ props.row.balance
                    }}元</span>
                </el-form-item>
                <el-form-item label="所交押金">
                  <span v-if="props.row.foregift">{{ props.row.foregift }}元</span>
                </el-form-item>
                <el-form-item label=" 加 盟 费 ">
                  <span v-if="props.row.franchiseFees">{{ props.row.franchiseFees }}元</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="status"
                           label="状态"
                           align="center">
                           <!--:filters="[{ text: '解除合作', value: '解除合作'}, { text: '签约未打款', value: '签约未打款' }, { text: '签约已打款', value: '签约已打款' }]"
                           :filter-method="filterStatus"
                           filter-placement="bottom-end"-->
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === '解除合作' ? 'danger': scope.row.status === '签约未打款' ? 'warning' : 'success'"
                close-transition>{{scope.row.status}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="name" label="加盟商名称" align="center"></el-table-column>
          <el-table-column prop="levelName" label="等级" align="center"></el-table-column>
          <el-table-column prop="payPeriod"
                           label="结算周期"
                           align="center"
                           :formatter="formatterPayPeriod"></el-table-column>
          <el-table-column prop="profit" label="分利" align="center" :formatter="formatterProfit"></el-table-column>
          <el-table-column prop="joinDate" label="加盟日期" align="center" :formatter="formatterDateTime" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endDate" label="加盟结束日期" align="center" show-overflow-tooltip
                           :formatter="formatterDateTime"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button :disabled="!couldAdd" @click="editFranchiseesInfo(scope.row)" size="small"
                         type="text">编辑
              </el-button>
              <el-button :disabled="!couldAdd" @click="showChangeFranchiseeBalanceChange(scope.row)"
                         size="small"
                         type="text">修改账户余额
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="franchiseesListPage"
            :page-sizes="franchiseesListSizes"
            :page-size="franchiseesListSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="franchiseesListTotal">
          </el-pagination>
        </p>

        <!--修改加盟商余额-->
        <el-dialog :title="changeFranchiseesBalanceDialogTitle"
                   :visible.sync="changeFranchiseesBalanceDialogVisible">
          <el-card class="box-card" style="overflow:scroll; height: 550px;">
            <div slot="header" class="clearfix">
            <span>
              <b>加盟商账户余额: </b>{{franchiseesBalance.oldBalance}}元
            </span>
            </div>
            <el-form :inline="true" :model="franchiseesBalance" ref="franchiseesBalance" class="demo-form-inline">
              <el-row :gutter="5">
                <el-form-item label="转账金额" prop="changeMoney">
                  <el-input v-model="franchiseesBalance.changeMoney" placeholder="请输入要转给加盟商的金额"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="转账截图">
                  <el-upload
                    class="upload-demo"
                    ref="uploadImg"
                    :action="uploadImgUrl"
                    :headers="uploadImgHeaders"
                    :data="uploadImgData"
                    :file-list="transferScreenshot"
                    :on-success="handleSuccess"
                    list-type="picture"
                    :auto-upload="false"
                    drag
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-form-item>
              </el-row>
              <el-col :span="4" :push="8">
                <el-form-item style="margin-top: 10px">
                  <el-button @click="saveFranchiseesBalanceChange" type="primary" round icon="el-icon-plus">保存</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="4" :push="8">
                <el-form-item style="margin-top: 10px">
                  <el-button @click="changeFranchiseesBalanceDialogVisible = false" round icon="el-icon-delete">取消</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-card>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="franchiseesLevel">
        <span slot="label"><i class="el-icon-information"></i> 加盟商等级</span>
        <el-form :inline="true" :model="franchiseesLevelSearchForm" ref="franchiseesLevelSearchForm"
                 style="margin-bottom: 15px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item style="margin: 5px auto" label="等级" prop="levelName">
                <el-input v-model="franchiseesLevelSearchForm.levelName"
                          placeholder="请输入等级名称"
                          clearable
                          style="width: 100%"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item style="margin: 5px auto">
                <el-button type="primary" round icon="el-icon-search" @click="searchLevel">查询</el-button>
                <el-button v-if="couldAdd" round icon="el-icon-plus" @click="franchiseesLevelDialogVisible = true" style="margin-left: 20px">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table v-loading="franchiseesListLevelLoading"
                  :data="franchiseesLevelList"
                  stripe
                  border
                  style="width: 100%;">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="levelName" label="等级名称" align="center"></el-table-column>
          <el-table-column prop="profit" label="分利" align="center" :formatter="formatterProfit"></el-table-column>
          <el-table-column prop="franchiseFees" label="加盟费" align="center"
                           :formatter="formatterMoney"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button :disabled="!couldAdd" @click="editLevel(scope.row)" size="small" type="text">编辑</el-button>
              <el-button :disabled="!couldAdd" @click="deleteLevel(scope.row)" size="small" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleFranchiseesLevelSizeChange"
            @current-change="handleFranchiseesLevelCurrentChange"
            :current-page="franchiseesLevelPage"
            :page-sizes="franchiseesLevelSizes"
            :page-size="franchiseesLevelSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="franchiseesLevelTotal">
          </el-pagination>
        </p>
      </el-tab-pane>
    </el-tabs>

    <!--新增或修改加盟商-->
    <el-dialog :title="operatorFranchiseeDialogTitle"
               :visible.sync="operatorFranchiseeDialogVisible">
      <div style="overflow:scroll; height: 650px;overflow-x: hidden">
        <el-form :model="operatorFranchiseeForm"
                 ref="operatorFranchiseeForm"
                 label-width="68px"
                 :rules="operatorFranchiseeFormRules"
                 label-position="left">
          <el-row :gutter="8">
            <el-col :push="3">
              <el-form-item label=" 名称 " prop="name">
                <el-input v-model="operatorFranchiseeForm.name" placeholder="请填写加盟商名称" style="width: 500px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :push="3">
              <el-form-item label=" 压 金 " prop="foregift">
                <input v-model="operatorFranchiseeForm.foregift"
                       placeholder="请输入加盟商缴纳押金"
                       class="el-input__inner"
                       style="width: 500px"
                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :push="3">
              <el-form-item label="联系方式" prop="mobile">
                <input v-model="operatorFranchiseeForm.mobile"
                       placeholder="请填写联系方式"
                       class="el-input__inner"
                       style="width: 500px"
                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :push="3">
              <el-form-item label="加盟时间" prop="join">
                <div class="block">
                  <el-date-picker
                    v-model="operatorFranchiseeForm.join"
                    type="datetime"
                    placeholder="请选择加盟时间"
                    align="right"
                    style="width: 500px">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :push="3">
              <el-form-item label="到期时间" prop="end">
                <div class="block">
                  <el-date-picker
                    v-model="operatorFranchiseeForm.end"
                    type="datetime"
                    placeholder="请选择加盟到期时间"
                    align="right"
                    style="width: 500px">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :push="3">
              <el-form-item label="结算周期" prop="payPeriod">
                <input v-model="operatorFranchiseeForm.payPeriod"
                       placeholder="请填写结算周期"
                       class="el-input__inner"
                       style="width: 500px"
                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :push="3">
              <el-form-item label=" 等 级 " prop="level">
                <el-select v-model="operatorFranchiseeForm.level"
                           filterable
                           clearable
                           placeholder="请选择加盟商等级"
                           style="width: 500px">
                  <el-option
                    v-for="item in franchiseesLevelSelectList"
                    :key="item.id"
                    :label="item.levelName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :push="3">
              <el-form-item label=" 负责人 " prop="leadingOfficial">
                <el-select v-model="operatorFranchiseeForm.leadingOfficial"
                           filterable
                           clearable
                           placeholder="请选择加盟商所属负责人"
                           style="width: 500px">
                  <el-option
                    v-for="item in leadingOfficialSelectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :push="3">
              <el-form-item label=" 状 态 " prop="status">
                <el-select v-model="operatorFranchiseeForm.status"
                           filterable
                           clearable
                           placeholder="请选择加盟商状态"
                           style="width: 500px">
                  <el-option
                    v-for="item in franchiseesStatusSelectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :push="3">
              <el-form-item label="管理人员" prop="userIds">
                <el-transfer
                  v-model="operatorFranchiseeForm.userIds"
                  :data="users"
                  :disabled="true"
                  :props="{key: 'id',label: 'name'}"
                  :button-texts="['减少', '增加']"
                  :titles="['可选管理人员', '已有管理人员']"
                  filterable
                  filter-placeholder="请输入管理人员名称">
                </el-transfer>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button @click="saveFranchiseesInfo" type="primary" round icon="el-icon-plus"
                       style="margin-top: 25px; margin-left: 37%">保存
            </el-button>
            <el-button @click="operatorFranchiseeDialogVisible = false" round type="primary">取消</el-button>
          </el-row>
        </el-form>
      </div>
    </el-dialog>

    <!--新增加盟商等级-->
    <el-dialog :title="franchiseesLevelDialogTitle"
               :visible.sync="franchiseesLevelDialogVisible">
      <el-form :model="franchiseesLevelForm" ref="franchiseesLevelForm" :rules="franchiseesLevelFormRules"
               label-position="left" label-width="85px">
        <el-row :gutter="8">
          <el-col :push="4">
            <el-form-item label="等级名称" prop="levelName">
              <el-input v-model="franchiseesLevelForm.levelName"
                        placeholder="请输入等级名称"
                        style="width: 500px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="8">
          <el-col :push="4">
            <el-form-item label=" 分 利 " prop="profit">
              <input v-model="franchiseesLevelForm.profit"
                     placeholder="请输入加盟商可分利润"
                     class="el-input__inner"
                     style="width: 500px"
                     onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                     onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :push="4">
            <el-form-item label=" 加 盟 费 " prop="franchiseFees">
              <input v-model="franchiseesLevelForm.franchiseFees"
                     placeholder="请输入需缴纳加盟费"
                     class="el-input__inner"
                     style="width: 500px"
                     onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                     onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="8">
          <el-button @click="saveFranchiseesLevel" type="primary" round icon="el-icon-plus"
                     style="margin-top: 25px; margin-left: 37%">保存
          </el-button>
          <el-button @click="franchiseesLevelDialogVisible = false" round type="primary">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

  import {
    getFranchiseesList,
    getFranchiseesAdmin,
    getFranchiseesAdminId,
    saveFranchisees,
    saveFranchiseesLevel,
    getLevelList,
    deleteFranchiseeLevel,
    getFranchiseesSelect,
    fetchFranchiseeRoleLevel,
    fetchChangeBalance
  } from "../../api/franchisees";
  import {dealDateTime} from "../../api/discount";
  import {getLeadingOfficial} from "../../api/user";
  import {getToken} from "../../utils/auth";

  export default {
    created() {
      this.searchFranchiseesInfo();
      this.getFranchiseesLevelSelect();
      this.getFranchiseeRoleLevel();
    },
    data() {
      return {
        /* 加盟商管理 */
        franchiseesSearch: {
          name: '',
          dateTime: '',
          level: '',
          status: ''
        },
        operatorFranchiseeForm: {
          join: '',
          end: '',
          name: '',
          payPeriod: '',
          userIds: [],
          id: '',
          level: '',
          mobile: '',
          status: '',
          foregift: '',
          leadingOfficial: ''
        },
        franchiseesBalance: {
          oldBalance: '',
          changeMoney: '',
          franchiseeId: ''
        },
        uploadImgUrl: process.env.BASE_API + '/api/private/franchisee/image',
        uploadImgHeaders: {
          'X-AUTH-TOKEN': getToken()
        },
        uploadImgData: {
          franchiseeId: '',
          id: ''
        },
        couldAdd: false,
        users: [],
        transferScreenshot: [],
        franchiseesList: [],
        franchiseesListBackup: [],
        franchiseesLevelSelectList: [],
        leadingOfficialSelectList: [],
        franchiseesStatusSelectList: [
          {
            value: '0',
            label: '签约未打款'
          }, {
            value: '1',
            label: '签约已打款'
          }, {
            value: '2',
            label: '解除合作'
          }
        ],
        franchiseesListPage: 1,
        franchiseesListSize: 10,
        franchiseesListTotal: 0,
        franchiseesListSizes: [10, 20, 50, 100],
        operatorFranchiseeDialogTitle: '新增加盟商',
        changeFranchiseesBalanceDialogTitle: '修改加盟商余额',
        changeFranchiseesBalanceDialogVisible: false,
        franchiseesListLoading: false,
        operatorFranchiseeDialogVisible: false,
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
        operatorFranchiseeFormRules: {
          name: [
            {required: true, message: '请输入加盟商名称', trigger: 'blur'}
          ],
          mobile: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请输入加盟商联系方式"));
                } else if (!/^1[3456789][0-9]{9}$/.test(value)) {
                  callback(new Error("加盟商联系方式格式错误"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          status: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请选择加盟商状态"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          level: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请选择加盟商等级"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          payPeriod: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请输入结算周期"));
                } else if (parseInt(value) <= 0) {
                  callback(new Error("结算周期必须大于0"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          join: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请选择加盟时间"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          end: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请选择加盟到期时间"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ]
        },

        /* 加盟商等级 */
        franchiseesLevelForm: {
          id: '',
          levelName: '',
          profit: '',
          franchiseFees: ''
        },
        franchiseesLevelSearchForm: {
          levelName: '',
        },
        franchiseesLevelList: [],
        franchiseesLevelPage: 1,
        franchiseesLevelSize: 10,
        franchiseesLevelTotal: 0,
        franchiseesLevelSizes: [10, 20, 50, 100],
        franchiseesLevelDialogTitle: '新增加盟商等级',
        franchiseesListLevelLoading: false,
        franchiseesLevelDialogVisible: false,
        franchiseesLevelFormRules: {
          levelName: [
            {required: true, message: '请输入加盟商等级名称', trigger: 'blur'}
          ],
          franchiseFees: [
            {
              validator: (rule, value, callback) => {
                if (value == undefined || value == '') {
                  callback(new Error("请输入加盟费"));
                } else if (parseInt(value) <= 0) {
                  callback(new Error("加盟费必须大于0"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          profit: [
            {
              validator: (rule, value, callback) => {
                if (value == undefined || value == '') {
                  callback(new Error("请输入加盟商分利"));
                } else if (parseInt(value) > 100 || parseInt(value) <= 0) {
                  callback(new Error("加盟商分利必须介于0之100的正整数"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ]
        },

        /* 公共 */
        activeName: 'franchiseesList',
      }
    },
    methods: {
      /* 加盟商管理 */
      searchFranchiseesInfo() {
        let data = {
          'name': this.franchiseesSearch.name,
          'level': this.franchiseesSearch.level,
          'beginDate': dealDateTime(this.franchiseesSearch.dateTime[0]),
          'endDate': dealDateTime(this.franchiseesSearch.dateTime[1]),
          'status': this.franchiseesSearch.status
        };
        this.franchiseesListLoading = true;
        getFranchiseesList(data, this.franchiseesListPage, this.franchiseesListSize).then(response => {
          this.franchiseesListLoading = false;
          if (response.code === 0) {
            this.franchiseesList = response.response;
            this.franchiseesListTotal = response.total;
          } else {
            this.$notify.info({
              title: '-_-||',
              message: '出现故障了。。。',
              duration: 3000
            });
          }
        })
      },
      saveFranchiseesInfo() {
        this.$refs['operatorFranchiseeForm'].validate((valid) => {
          if (valid) {
            if (this.operatorFranchiseeForm.join.getTime() < this.operatorFranchiseeForm.end.getTime()) {
              let type = 'success';
              console.log(this.operatorFranchiseeForm)
              saveFranchisees(this.operatorFranchiseeForm).then(response => {
                if (response.code !== 0) {
                  type = 'error'
                }
                this.$message({
                  message: response.desc,
                  type: type,
                  duration: 3000
                });
                if (type !== 'error') {
                  this.operatorFranchiseeDialogVisible = false;
                  this.searchFranchiseesInfo();
                }
              });
            } else {
              this.$message({
                message: "加盟时间必须小于加盟结束时间",
                type: 'error',
                duration: 3000
              });
            }
          }
        });
      },
      editFranchiseesInfo(row) {
        this.operatorFranchiseeDialogVisible = true;
        this.operatorFranchiseeDialogTitle = "修改加盟商信息";
        this.writeData(row);
        getFranchiseesAdminId(row.id).then(response => {
          if (response.code === 0) {
            this.operatorFranchiseeForm.userIds = response.response.userIds;
            this.users = response.response.allUnSelectUser;
          }
        });
      },
      showChangeFranchiseeBalanceChange(row) {
        this.changeFranchiseesBalanceDialogVisible = true;
        this.franchiseesBalance.franchiseeId = row.id;
        this.franchiseesBalance.oldBalance = row.balance;

      },
      saveFranchiseesBalanceChange() {
        if (this.franchiseesBalance.changeMoney === '' || this.franchiseesBalance.changeMoney === undefined || this.franchiseesBalance.changeMoney === null) {
          this.$message.error('请输入转账金额');
        } else {
          if (isNaN(this.franchiseesBalance.changeMoney)) {
            this.$message.error('转账金额应为数字');
          } else {
            this.franchiseesBalance.oldBalance = (parseFloat(this.franchiseesBalance.oldBalance) <= 0) ? 0 : this.franchiseesBalance.oldBalance;
            if (parseFloat(this.franchiseesBalance.oldBalance) < parseFloat(this.franchiseesBalance.changeMoney)) {
              this.$confirm('转账金额大于加盟商账户余额,是否仍要保存?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.transferAccounts();
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作'
                });
              });
            } else {
              this.transferAccounts();
            }
          }
        }
      },
      handleSuccess(response, file, fileList) {
        if (response.code === 0) {
          this.$message.success('上传成功');
          this.changeFranchiseesBalanceDialogVisible = false;
          this.searchFranchiseesInfo();
        } else {
          this.$message.error(response.desc);
        }
      },
      transferAccounts() {
        //修改转账金额
        this.franchiseesBalance.id = this.franchiseesBalance.franchiseeId;
        let _this = this;
        fetchChangeBalance(this.franchiseesBalance).then(response => {
          if (response.code === 0) {
            if (_this.$refs.uploadImg.uploadFiles.length > 0) {
              _this.uploadImgData.franchiseeId = _this.franchiseesBalance.franchiseeId;
              _this.uploadImgData.id = response.response;
              _this.$refs.uploadImg.submit();
            } else {
              _this.$message.success('修改成功');
              _this.changeFranchiseesBalanceDialogVisible = false;
              _this.searchFranchiseesInfo();
            }
          }
        })
      },
      handleCurrentChange(val) {
        this.franchiseesListPage = val;
        this.search();
      },
      handleSizeChange(val) {
        this.franchiseesListSize = val;
        this.search();
      },
      getUsers() {
        getFranchiseesAdmin().then(response => {
          if (response.code === 0) {
            this.users = response.response;
          }
        })
      },
      getFranchiseesLevelSelect() {
        getFranchiseesSelect().then(response => {
          if (response.code === 0) {
            this.franchiseesLevelSelectList = response.response;
          }
        });
      },
      getFranchiseeRoleLevel() {
        fetchFranchiseeRoleLevel().then(response => {
          if (response.code === 0) {
            if (response.response === 1) {
              this.couldAdd = true;
            } else {
              this.couldAdd = false;
            }
          }
        })
      },
      //格式化时间
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 2)
        } else {
          return cellValue;
        }
      },
      filterStatus(value, row) {
        return row.status === value;
      },
      getLeadingOfficialSelectList() {
        getLeadingOfficial().then(response => {
          if (response.code === 0) {
            this.leadingOfficialSelectList = response.response;
          }
        })
      },
      writeData(row) {
        this.operatorFranchiseeForm.name = row.name;
        this.operatorFranchiseeForm.payPeriod = row.payPeriod;
        this.operatorFranchiseeForm.id = row.id;
        if (row.foregift) {
          this.operatorFranchiseeForm.foregift = row.foregift;
        }
        this.operatorFranchiseeForm.mobile = row.mobile;
        this.operatorFranchiseeForm.join = new Date();
        this.operatorFranchiseeForm.join.setFullYear(row.joinDate.split(' ')[0].split("-")[0], (row.joinDate.split(' ')[0].split("-")[1] - 1), row.joinDate.split(' ')[0].split("-")[2]);
        this.operatorFranchiseeForm.join.setHours(row.joinDate.split(' ')[1].split(":")[0], row.joinDate.split(' ')[1].split(":")[1], row.joinDate.split(' ')[1].split(":")[2]);
        this.operatorFranchiseeForm.end = new Date();
        this.operatorFranchiseeForm.leadingOfficial = row.leadingOfficial;
        this.operatorFranchiseeForm.end.setFullYear(row.endDate.split(' ')[0].split("-")[0], (row.endDate.split(' ')[0].split("-")[1] - 1), row.endDate.split(' ')[0].split("-")[2]);
        this.operatorFranchiseeForm.end.setHours(row.endDate.split(' ')[1].split(":")[0], row.endDate.split(' ')[1].split(":")[1], row.endDate.split(' ')[1].split(":")[2]);
        this.operatorFranchiseeForm.level = row.levelId;
        switch (row.status) {
          case '签约未打款':
            this.operatorFranchiseeForm.status = '0';
            break;
          case '签约已打款':
            this.operatorFranchiseeForm.status = '1';
            break;
          default:
            this.operatorFranchiseeForm.status = '2';
            break;
        }
      },

      /* 加盟商等级 */
      deleteLevel(row) {
        deleteFranchiseeLevel(row.id).then(response => {
          let type = 'error';
          if (response.code === 0) {
            type = 'success';
            this.searchLevel();
          }
          this.$message({
            message: response.desc,
            type: type,
            duration: 3000
          });
        });
      },
      editLevel(row) {
        this.franchiseesLevelForm.franchiseFees = row.franchiseFees;
        this.franchiseesLevelForm.profit = row.profit;
        this.franchiseesLevelForm.levelName = row.levelName;
        this.franchiseesLevelForm.id = row.id;
        this.franchiseesLevelDialogVisible = true;
      },
      searchLevel() {
        this.franchiseesListLevelLoading = true;
        getLevelList(this.franchiseesLevelSearchForm, this.franchiseesLevelPage, this.franchiseesLevelSize).then(response => {
          this.franchiseesListLevelLoading = false;
          if (response.code === 0) {
            this.franchiseesLevelList = response.response;
            this.franchiseesLevelTotal = response.total
          } else {
            this.$message({
              message: response.desc,
              type: 'error',
              duration: 3000
            });
          }
        });
        let _this = this;
        let close = setTimeout(function () {
          if (_this.franchiseesListLevelLoading === true) {
            _this.franchiseesListLevelLoading = false;
            _this.$notify.info({
              title: '-_-||',
              message: '查询失败',
              duration: 3000
            });
          }
        }, 180000);
      },
      saveFranchiseesLevel() {
        this.$refs['franchiseesLevelForm'].validate((valid) => {
          if (valid) {
            let type = 'error';
            saveFranchiseesLevel(this.franchiseesLevelForm).then(response => {
              if (response.code === 0) {
                type = 'success';
                this.searchLevel();
                this.franchiseesLevelDialogVisible = false;
              }
              this.$message({
                message: response.desc,
                type: type,
                duration: 3000
              });
            });
          }
        })
      },
      handleFranchiseesLevelSizeChange(val) {
        this.franchiseesLevelSize = val;
        this.searchLevel();
      },
      handleFranchiseesLevelCurrentChange(val) {
        this.franchiseesLevelPage = val;
        this.searchLevel();
      },

      /* 公用 */
      formatterPayPeriod(row, column, cellValue) {
        if (cellValue) {
          return 'T + ' + cellValue;
        }
      },
      formatterProfit(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '%';
        }
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元';
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    watch: {
      operatorFranchiseeDialogVisible: {
        handler: function (curVal, oldVal) {
          this.getFranchiseesLevelSelect();
          this.getLeadingOfficialSelectList();
          if (curVal === true) {
            if (this.operatorFranchiseeDialogTitle === "新增加盟商") {
              this.getUsers();
            }
          } else {
            this.$refs['operatorFranchiseeForm'].resetFields();
            this.operatorFranchiseeForm.join = '';
            this.operatorFranchiseeForm.end = '';
            this.operatorFranchiseeForm.name = '';
            this.operatorFranchiseeForm.payPeriod = '';
            this.operatorFranchiseeForm.id = '';
            this.operatorFranchiseeForm.userIds = [];
            this.operatorFranchiseeForm.level = '';
            this.operatorFranchiseeForm.mobile = '';
            this.operatorFranchiseeForm.status = '';
            this.operatorFranchiseeForm.foregift = '';
            this.operatorFranchiseeForm.leadingOfficial = '';
            this.operatorFranchiseeDialogTitle = "新增加盟商";
            this.users = [];
          }
        },
        deep: true
      },
      activeName: {
        handler: function(curVal, oldVal) {
          if (curVal === 'franchiseesLevel') {
            this.searchLevel();
          }
        },
        deep: true
      },
      franchiseesLevelDialogVisible: {
        handler: function(curVal, oldVal) {
          if (curVal === false) {
            this.$refs['franchiseesLevelForm'].resetFields();
            this.franchiseesLevelForm.id = '';
            this.franchiseesLevelForm.levelName = '';
            this.franchiseesLevelForm.profit = '';
            this.franchiseesLevelForm.franchiseFees = '';
          }
        },
        deep: true
      },
      changeFranchiseesBalanceDialogVisible: {
        handler: function (curVal, oldVal) {
          if (curVal === false) {
            if (this.$refs.uploadImg) {
              // this.$refs.uploadImg.uploadFiles = []
              this.$refs.uploadImg.clearFiles();
            }
            this.franchiseesBalance.changeMoney = '';
            this.franchiseesBalance.oldBalance = 0;
            this.franchiseesBalance.franchiseeId = ''
          }
        },
        deep: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-transfer-panel__body {
    height: 250px;
  }

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
