<template>
  <div style="margin: 1% 2%">
    <el-tabs v-model="activeName"
             @tab-click="changeTab">

      <el-tab-pane name="showPromotion">
        <span slot="label"><i class="el-icon-document"></i> 活动列表</span>

        <!--查询满减活动条件表单-->
        <el-form :model="promotionSearchForm" ref="promotionSearchForm" class="demo-form-inline" label-position="left"
                 label-width="75px">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="机构" prop="parentIdList" label-width="13%">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="promotionSearchForm.parentIdList"
                  :props="officeProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构"
                  style="width: 100%"></el-cascader>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="活动状态" prop="promotionOver">
                <el-select v-model="promotionSearchForm.promotionOver" clearable placeholder="请选择状态">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="时间" prop="dateTime" label-width="11%">
                <div class="block">
                  <el-date-picker
                    v-model="promotionSearchForm.dateTime"
                    type="datetimerange"
                    :picker-options="searchPickerOption"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    style="width: 108%">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">

            <el-col :span="6">
              <el-form-item label="活动名称 " prop="promotionName">
                <el-input type="text" v-model="promotionSearchForm.saleName"
                          placeholder="请输入活动名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6" :push="1">
              <el-button type="primary" icon="el-icon-search" round @click="search">查询</el-button>
              <el-button icon="el-icon-delete" round @click="resetForm('promotionSearchForm')" style="margin-left: 20px">
                重置
              </el-button>
            </el-col>
          </el-row>
        </el-form>

        <!--结果表格-->
        <el-tooltip class="item" effect="light" content="双击显示详情" placement="top-end">
          <el-table
            v-loading.body="promotionSearchListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="promotionSearchList"
            stripe
            border
            highlight-current-row
            ref="promotionSearchList"
            style="width: 100%;"
            @row-dblclick="showPromotionDetail">
            <el-table-column prop="id" label="活动编号" align="center"></el-table-column>
            <el-table-column prop="saleName" label="活动名称" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="companyName" label="所属大区" align="center"></el-table-column>
            <el-table-column prop="beginDate"
                             label="开始时间"
                             :show-overflow-tooltip="true"
                             align="center"
                             :formatter="formatterDateTime"></el-table-column>
            <el-table-column prop="endDate"
                             label="结束时间"
                             :show-overflow-tooltip="true"
                             align="center"
                             :formatter="formatterDateTime"></el-table-column>
            <el-table-column prop="promotionOver" label="活动状态" align="center">
              <template slot-scope="scope" align="center">
                <el-switch
                  v-model="scope.row.promotionOver"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  inactive-text="结束"
                  active-text="进行"
                  :active-value="1"
                  :inactive-value="0"
                  @change="switchChange(scope.row)"
                  :disabled="scope.row.disable">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="编辑" align="center">
              <template slot-scope="editScope" align="center">
                <el-button
                  type="text"
                  :disabled="editScope.row.disable"
                  @click="showPromotionDetail(editScope.row)">修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tooltip>

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

      </el-tab-pane>

      <el-tab-pane name="createPromotion">
        <span slot="label"><i class="el-icon-view"></i> 活动详情</span>
        <el-card class="box-card">
          <el-row>
            <!--步骤条-->
            <el-col :span="7">
              <el-steps :space="250" direction="vertical" :active="step">
                <el-step title="选择活动范围" icon="el-icon-info"></el-step>
                <el-step title="选择活动商品" icon="el-icon-circle-check"></el-step>
                <el-step title="填写活动信息" icon="el-icon-edit"></el-step>
              </el-steps>
            </el-col>
            <!--活动范围-->
            <el-col :span="10" class="discount-tree" v-show="promotionRangeVisible">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">活动范围</h3>
                </div>
                <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
                </el-input>
                <el-tree class="filter-tree"
                         :data="machines"
                         :props="treeProps"
                         show-checkbox
                         node-key="id"
                         :default-expanded-keys="['1']"
                         :default-checked-keys="defaultCheckedMachine"
                         :highlight-current="true"
                         v-loading="treeLoading"
                         element-loading-text="拼命加载中..."
                         ref="machines"
                         :filter-node-method="filterNode">
                </el-tree>
                <el-button style="margin-top: 10px; margin-left: 40%" round icon="el-icon-caret-bottom"
                           @click="next(1)">下一步
                </el-button>
              </el-card>
            </el-col>
            <!--活动商品-->
            <el-col :span="12" class="promotion-tree" v-show="promotionProductVisible">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">商品</h3>
                </div>
                <el-table
                  v-loading.body="promotionCreateListLoading"
                  element-loading-text="小喵使出了洪荒之力为您加载。。。"
                  ref="multipleTable"
                  :data="products"
                  border
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange">
                  <el-table-column type="selection" align="center"></el-table-column>
                  <el-table-column label="商品编号" prop="id" align="center"></el-table-column>
                  <el-table-column label="商品名称" prop="productName" align="center"></el-table-column>
                </el-table>
                <el-button style="margin-top: 10px; margin-left: 35%" round icon="el-icon-caret-top" @click="pre(1)">
                  上一步
                </el-button>
                <el-button style="margin-top: 10px; margin-left: 10%" round icon="el-icon-caret-bottom"
                           @click="next(2)">下一步
                </el-button>
              </el-card>
            </el-col>
            <!--活动信息-->
            <el-col :span="12" class="promotion-tree" v-show="promotionInfoVisible">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">其他条件</h3>
                </div>
                <el-form :model="promotionForm" label-position="left" ref="promotionForm"
                         label-width="60px"
                         :rules="promotionFormRules">
                  <el-form-item label="活动名" prop="promotionName" style="margin-top: 20px;margin-left: 5%">
                    <el-input v-model="promotionForm.promotionName" style="width: 90%" placeholder="请输入满减活动名"></el-input>
                  </el-form-item>
                  <el-form-item label="满金额" prop="minMoney" style="margin-top: 20px;margin-left: 5%">
                    <el-input type="number" pattern="[0-9]*"
                              placeholder="请输入满金额"
                              v-model.number="promotionForm.minMoney"
                              style="width: 90%"></el-input>
                  </el-form-item>
                  <el-form-item label="减金额" prop="freeMoney" style="margin-top: 20px;margin-left: 5%">
                    <el-input type="number" pattern="[0-9]*"
                              placeholder="请输入减金额"
                              v-model.number="promotionForm.freeMoney"
                              style="width: 90%"></el-input>
                  </el-form-item>
                  <el-form-item label=" 时 间 " prop="dateTime" style="margin-top: 20px;margin-left: 5%">
                    <div class="block">
                      <el-date-picker
                        v-model="promotionForm.dateTime"
                        type="datetimerange"
                        :picker-options="pickerOption"
                        placeholder="请选择时间范围"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        style="width: 90%;">
                      </el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item style="margin-top: 50px;">
                    <el-button style="margin-left: 30%" round icon="el-icon-caret-top" @click="pre(2)">上一步</el-button>
                    <el-button type="primary" round icon="el-icon-plus" @click="create">创建</el-button>
                    <el-button icon="el-icon-delete" round @click="resetForm('promotionForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
          <el-row justify="center" type="flex">

          </el-row>
        </el-card>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>

  import {
    createdPromotion,
    fetchMachineTree,
    getDetail,
    getPromotionList,
    updatePromotionStatus,
    updatePromotion
  } from '../../api/promotion';
  import { fetchOfficeTree } from '../../api/office';
  import { getProductsByMachineList, dealDateTime } from '../../api/discount';

  export default {
    created() {
      this.fetchOfficeCascader();
      this.search();
    },
    data() {
      return {
        // 查询活动
        promotionSearchForm: {
          parentIdList: [],
          dateTime: '',
          beginDate: '',
          endDate: '',
          saleName: '',
          promotionOver: '',
          companyId: '',
          regionId: '',
          officeId: ''
        },
        officeProps: {
          children: 'children',
          label: 'name',
          value: 'id',
          disabled: 'disabled'
        },
        offices: [],
        promotionSearchList: [],
        promotionDetailData: [],
        defaultCheckedMachine: ['-1'],
        options: [{
          value: '2',
          label: '全部'
        }, {
          value: '1',
          label: '进行中'
        }, {
          value: '0',
          label: '已结束'
        }],
        page: 1,
        size: 10,
        total: 0,
        selectList: [],
        sizes: [10, 20, 50, 100],
        officeOptions: [],
        dialogTitle: '',
        products: [],
        selectProduct: [],
        step: 1,
        type: 'create', // 定义当前处于何种情景 edit create
        officeDisabled: false,
        promotionRangeVisible: true,
        promotionProductVisible: false,
        promotionInfoVisible: false,
        promotionSearchListLoading: false,
        promotionCreateListLoading: false,

        // 生成活动
        filterText: '',
        activeName: 'showPromotion',
        machines: [],
        treeProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        promotionForm: {
          promotionName: '',
          dateTime: '',
          beginDate: '',
          endDate: '',
          freeMoney: '',
          minMoney: ''
        },
        promotionFormRules: {
          promotionName: [
            {
              validator: (rule, value, callback) => {
                if (value == '') {
                  callback(new Error('请输入满减活动名'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          dateTime: [
            {
              validator: (rule, value, callback) => {
                if (value == undefined || value == '') {
                  callback(new Error('请选择时间'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          minMoney: [
            {
              validator: (rule, value, callback) => {
                if (value == undefined || value == '') {
                  callback(new Error('请输入满金额'));
                } else if(parseFloat(value) <= 0) {
                  callback(new Error('金额应大于0'))
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          freeMoney: [
            {
              validator: (rule, value, callback) => {
                if (value == undefined || value == '') {
                  callback(new Error('请输入减金额'));
                } else if(parseFloat(value) <= 0) {
                  callback(new Error('金额应大于0'))
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ]
        },
        searchPickerOption: {
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '一个月',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '半年',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 182);
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit('pick', [start, end]);
            }
          }]
        },

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
        treeLoading: false
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /* 查询活动 */
      handleChange(value) {
        if (value[0]) {
          this.promotionSearchForm.companyId = value[0]
        } else {
          this.promotionSearchForm.companyId = ''
        }
        if (value[1]) {
          this.promotionSearchForm.regionId = value[1]
        } else {
          this.promotionSearchForm.regionId = ''
        }
        if (value[2]) {
          this.promotionSearchForm.officeId = value[2]
        } else {
          this.promotionSearchForm.officeId = ''
        }
      },
      // 初始化机构
      fetchOfficeCascader() {
        fetchOfficeTree().then(response => {
          this.offices = response.response[0].children;
        });
      },
      search() {
        this.promotionSearchListLoading = true;
        getPromotionList(this.promotionSearchForm, this.page, this.size).then(response => {
          this.promotionSearchListLoading = false;
          this.promotionSearchList = response.response;
          this.total = response.total;
        })
      },
      handleSizeChange(val) {
        this.size = val;
        this.search()
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      /* 生成活动 */
      getMachineTree() {
        this.treeLoading = true;
        fetchMachineTree().then(response => {
          this.machines = response.response;
          this.treeLoading = false;
          if (this.type !== 'create') {
            if (this.promotionDetailData.machineList) {
              this.$refs.machines.setCheckedKeys(this.promotionDetailData.machineList);
            }
            this.getProductsByMachineList(this.defaultCheckedMachine);
          }
        });
      },
      // 选中商品改变
      handleSelectionChange(val) {
        this.selectProduct = val;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 切换tab
      changeTab(tab) {
        if (tab.name === 'createPromotion') {
          this.getMachineTree();
        } else {
          this.search();
          if (this.type !== 'create') {
            this.clear([], []);
            this.type = 'create'
          }
        }
      },
      dealCheckNodeToMachineArray() {
        const checkNodes = this.$refs.machines.getCheckedNodes();
        const machineList = [];
        if (checkNodes.length === 0) {
          return null;
        } else {
          for (let i = 0; i < checkNodes.length; i++) {
            if (checkNodes[i].attributes.isMachine != undefined) {
              machineList.push(checkNodes[i].id);
            }
          }
          return machineList;
        }
      },
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 2)
        } else {
          return cellValue;
        }
      },
      clear(checkMachine, selectProducts) {
        this.getMachineTree();
        this.$refs.machines.setCheckedKeys(checkMachine);
        this.$refs.promotionForm.resetFields();
        this.products = [];
        this.selectProduct = selectProducts;
        this.machines = [];
        this.promotionDetailData = [];
        this.promotionInfoVisible = false;
        this.promotionProductVisible = false;
        this.promotionRangeVisible = true;
        this.step = 1;
        this.promotionForm.promotionName = '';
        this.promotionForm.minMoney = '';
        this.promotionForm.freeMoney = '';
        this.promotionForm.dateTime = '';
        this.promotionForm.beginDate = '';
        this.promotionForm.endDate = '';
      },
      checkList(list, oldList) {
        let hasChange = false;
        const old = oldList.join();
        if (list.length !== oldList.length) {
          hasChange = true;
        } else {
          for (let i = 0; i < list.length; i++) {
            if (old.indexOf(list[i]) === -1) {
              hasChange = true;
              break;
            }
          }
        }
        return hasChange;
      },
      // 验证数据
      check(data) {
        let checkResult = false;
        if (data.minMoney != this.promotionDetailData.minMoney) {
          checkResult = true;
        } else {
          data.minMoney = null;
        }
        if (data.freeMoney != this.promotionDetailData.freeMoney) {
          checkResult = true;
        } else {
          data.freeMoney = null;
        }
        if (data.saleName != this.promotionDetailData.saleName) {
          checkResult = true;
        } else {
          data.saleName = null;
        }
        data.promotionOver = null;
        if (data.beginDate != this.promotionDetailData.beginDate) {
          checkResult = true;
        } else {
          data.beginDate = null;
        }
        if (data.endDate != this.promotionDetailData.endDate) {
          checkResult = true;
        } else {
          data.endDate = null;
        }
        if (this.checkList(data.machineList, this.promotionDetailData.machineList)) {
          checkResult = true;
        } else {
          data.machineList = null;
          data.companyId = this.promotionDetailData.companyId;
        }
        if (this.checkList(data.productList, this.promotionDetailData.productList)) {
          checkResult = true
        } else {
          data.productList = null;
        }
        if (checkResult) {
          data.id = this.promotionDetailData.id;
        }
        return checkResult;
      },

      // 处理数据
      dealData() {
        const machineList = this.dealCheckNodeToMachineArray();
        if (machineList.length <= 0) {
          this.$message({
            message: '请选择活动范围',
            duration: 2000,
            type: 'error',
            showClose: true
          });
          this.pre(1);
          return null;
        }
        const productList = [];
        for (let i = 0; i < this.selectProduct.length; i++) {
          productList.push(this.selectProduct[i].id);
        }
        if (productList.length <= 0) {
          this.$message({
            message: '请选择活动商品',
            duration: 2000,
            type: 'error',
            showClose: true
          });
          this.pre(2);
          return null;
        }
        this.promotionForm.beginDate = dealDateTime(this.promotionForm.dateTime[0]);
        this.promotionForm.endDate = dealDateTime(this.promotionForm.dateTime[1]);
        const data = {
          saleName: this.promotionForm.promotionName,
          minMoney: this.promotionForm.minMoney,
          freeMoney: this.promotionForm.freeMoney,
          beginDate: this.promotionForm.beginDate,
          endDate: this.promotionForm.endDate,
          promotionOver: 1,
          machineList,
          productList
        };
        // 当前处于修改验证是否有有效修改
        if (this.type == 'edit') {
          if (this.check(data)) {
            return data;
          } else {
            return null;
          }
        }
        return data;
      },
      // 创建活动
      create() {
        this.$refs.promotionForm.validate(valid => {
          if (valid) {
            const data = this.dealData();
            if (this.type === 'create') {
              if (data !== null) {
                createdPromotion(data).then(response => {
                  let type;
                  if (response.code !== 0) {
                    type = 'error';
                  } else {
                    type = 'success';
                    this.clear([], []);
                  }
                  this.$message({
                    message: response.desc,
                    duration: 2000,
                    type,
                    showClose: true
                  });
                });
              }
            } else {
              if (data !== null) {
                updatePromotion(data).then(response => {
                  let type = 'error';
                  if (response.code === 0) {
                    type = 'success';
                    this.clear([], []);
                  }
                  this.$message({
                    message: response.desc,
                    duration: 2000,
                    type,
                    showClose: true
                  });
                });
              } else {
                this.$message({
                  message: '没有有效的修改无法提交',
                  duration: 2000,
                  type: 'error',
                  showClose: true
                });
              }
            }
          }
        });
      },
      // 修改状态
      switchChange(val, v) {
        updatePromotionStatus(val.promotionOver, val.id).then(response => {
          if (response == undefined || response.code !== 0) {
            // 回退
            if (val.promotionOver == 0) {
              val.promotionOver = 1;
            } else {
              val.promotionOver = 0;
            }
            this.$message({
              message: '修改' + val.saleName + '活动失败',
              duration: 2000,
              type: 'error',
              showClose: true
            });
          } else {
            // 成功
            this.$message({
              message: '修改' + val.saleName + '活动成功',
              duration: 1000,
              type: 'success',
              showClose: true
            });
            this.search();
          }
        })
      },
      getPromotionDetail(promotionId) {
        getDetail(promotionId).then(response => {
          this.promotionDetailData = response.response;
        })
      },
      writeFormData() {
        this.promotionForm.promotionName = this.promotionDetailData.saleName;
        this.promotionForm.oldPromotionName = this.promotionDetailData.saleName;
        this.promotionForm.oldMinMoney = this.promotionDetailData.minMoney;
        this.promotionForm.minMoney = this.promotionDetailData.minMoney;
        this.promotionForm.oldFreeMoney = this.promotionDetailData.freeMoney;
        this.promotionForm.freeMoney = this.promotionDetailData.freeMoney;
        let beginDate = new Date();
        if (this.promotionDetailData.beginDate) {
          beginDate = new Date(this.promotionDetailData.beginDate);
        }
        let endDate = new Date();
        if (this.promotionDetailData.endDate) {
          endDate = new Date(this.promotionDetailData.endDate);
        }
        this.promotionForm.dateTime = [
          beginDate, endDate
        ];
        this.promotionForm.oldDateTime = [
          beginDate, endDate
        ];
      },
      showPromotionDetail(row, event) {
        if (row.disable !== true) {
          this.clear([], []);
          this.getPromotionDetail(row.id);
          this.activeName = 'createPromotion';
          this.type = 'edit';
          this.getMachineTree();
        }
      },
      getProductsByMachineList(machineList) {
        this.promotionCreateListLoading = true;
        getProductsByMachineList(machineList).then(response => {
          this.products = response.response;
          const _this = this;
          this.$nextTick(() => {
            _this.promotionCreateListLoading = false;
            if (_this.type !== 'create') {
              for (let i = 0; i < _this.products.length; i++) {
                for (let j = 0; j < _this.promotionDetailData.productList.length; j++) {
                  if (_this.products[i].id === _this.promotionDetailData.productList[j]) {
                    _this.$refs.multipleTable.toggleRowSelection(_this.products[i]);
                  }
                }
              }
              _this.writeFormData();
            }
          })
        })
      },
      next(type) {
        switch (type) {
          case 1:
            const machineList = this.dealCheckNodeToMachineArray();
            if (machineList !== null) {
              this.promotionRangeVisible = false;
              this.promotionProductVisible = true;
              if (this.products.length === 0) {
                this.getProductsByMachineList(machineList);
              }
              if (this.step++ > 2) {
                this.step = 2;
              }
            } else {
              this.$message({
                message: '请先选择活动范围',
                duration: 2000,
                type: 'error',
                showClose: true
              });
            }
            break;
          case 2:
            if (this.selectProduct.length > 0) {
              this.promotionProductVisible = false;
              this.promotionInfoVisible = true;
              if (this.step++ > 2) {
                this.step = 2;
              }
            } else {
              this.$message({
                message: '请先选择活动商品',
                duration: 2000,
                type: 'error',
                showClose: true
              });
            }
            break;
          default:
            break;
        }
      },
      pre(type) {
        switch (type) {
          case 1:
            this.promotionRangeVisible = true;
            this.promotionProductVisible = false;
            if (this.step-- < 1) {
              this.step = 1;
            }
            break;
          case 2:
            this.promotionProductVisible = true;
            this.promotionInfoVisible = false;
            if (this.step-- < 1) {
              this.step = 1;
            }
            break;
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.machines.filter(val);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .promotion-tree, .discount-form {
    transition: .2s;
    .filter-tree {
      margin-top: 20px;
    }
  }
</style>
