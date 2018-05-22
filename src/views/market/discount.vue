<template>
  <div style="margin: 1% 2%">
    <el-tabs v-model="activeName"
             @tab-click="changeTab">

      <el-tab-pane name="showDiscount">
        <span slot="label"><i class="el-icon-document"></i> 活动列表</span>

        <!--查询折扣活动条件表单-->
        <el-form :model="discountSearchForm" ref="discountSearchForm" class="demo-form-inline" label-position="left"
                 label-width="75px">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="机构" prop="parentIdList" label-width="15%">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="discountSearchForm.parentIdList"
                  :props="officeProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构"
                  style="width: 100%"></el-cascader>
              </el-form-item>
            </el-col>

            <el-col :span="6" :push="1">
              <el-form-item label="活动状态" prop="discountOver">
                <el-select v-model="discountSearchForm.discountOver" clearable placeholder="请选择状态">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8" :push="2">
              <el-form-item label="时间" prop="dateTime" label-width="11%">
                <div class="block">
                  <el-date-picker
                    v-model="discountSearchForm.dateTime"
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

            <el-col :span="7">
              <el-form-item label="活动名称 " prop="discountName">
                <el-input type="text" v-model="discountSearchForm.discountName"
                          placeholder="请输入活动名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5" :push="2">
              <el-button type="primary" icon="el-icon-search" round @click="search">查询</el-button>
              <el-button icon="el-icon-delete" round @click="resetForm('discountSearchForm')" style="margin-left: 20px">
                重置
              </el-button>
            </el-col>
          </el-row>
        </el-form>

        <!--结果表格-->
        <el-tooltip class="item" effect="light" content="双击显示详情" placement="top-end">
          <el-table
            v-loading.body="discountSearchListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="discountSearchList"
            stripe
            border
            highlight-current-row
            ref="discountSearchList"
            style="width: 100%;"
            @row-dblclick="showDiscountDetail">
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
            <el-table-column prop="discountOver" label="活动状态" align="center">
              <template slot-scope="scope" align="center">
                <el-switch
                  v-model="scope.row.discountOver"
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
                  @click="showDiscountDetail(editScope.row)">修改
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

      <el-tab-pane name="createDiscount">
        <span slot="label"><i class="el-icon-view"></i> 活动详情</span>
        <el-card class="box-card">
          <el-row>
            <!--步骤条-->
            <el-col :span="7">
              <el-steps :space="400" direction="vertical" :active="step">
                <el-step title="选择活动范围" icon="el-icon-info"></el-step>
                <el-step title="选择活动商品" icon="el-icon-circle-check"></el-step>
                <el-step title="填写活动信息" icon="el-icon-edit"></el-step>
              </el-steps>
            </el-col>
            <!--活动范围-->
            <el-col :span="10" class="discount-tree" v-show="discountRangeVisible">
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
            <el-col :span="12" class="discount-tree" v-show="discountProductVisible">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">商品</h3>
                </div>
                <el-table
                  v-loading.body="discountCreateListLoading"
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
            <el-col :span="12" class="discount-tree" v-show="discountInfoVisible">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">其他条件</h3>
                </div>
                <el-form :model="discountForm" label-position="left" ref="discountForm"
                         label-width="60px"
                         :rules="discountFormRules">
                  <el-form-item label="活动名" prop="discountName" style="margin-top: 20px;margin-left: 5%">
                    <el-input v-model="discountForm.discountName" style="width: 90%" placeholder="请输入折扣活动名"></el-input>
                  </el-form-item>
                  <el-form-item label=" 折  扣 " prop="sale" style="margin-top: 50px;margin-left: 5%">
                    <el-input v-model="discountForm.sale"
                              style="width: 90%"
                              placeholder="请输入折扣(如八折折请输入80，八二折输入82)"
                              v-on:blur="checkNum(discountForm.sale)"></el-input>
                  </el-form-item>
                  <el-form-item label=" 时 间 " prop="dateTime" style="margin-top: 50px;margin-left: 5%">
                    <div class="block">
                      <el-date-picker
                        v-model="discountForm.dateTime"
                        type="datetimerange"
                        :picker-options="pickerOption"
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
                    <el-button icon="el-icon-delete" round @click="resetForm('discountForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>

  import {
    createdDiscount, dealDateTime,
    fetchMachineTree,
    getDetail,
    getDiscountList, getProductsByMachineList,
    updateDiscountStatus, updateDiscount
  } from '../../api/discount';
  import { fetchOfficeTree } from '../../api/office';

  export default {
    created() {
      this.fetchOfficeCascader();
      this.search();
    },
    data() {
      return {
        // 查询活动
        discountSearchForm: {
          parentIdList: [],
          dateTime: '',
          beginDate: '',
          endDate: '',
          discountName: '',
          discountOver: '',
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
        discountSearchList: [],
        discountDetailData: {},
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
        discountRangeVisible: true,
        discountProductVisible: false,
        discountInfoVisible: false,
        discountSearchListLoading: false,
        discountCreateListLoading: false,

        // 生成活动
        filterText: '',
        activeName: 'showDiscount',
        machines: [],
        treeProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        discountForm: {
          discountName: '',
          sale: '',
          dateTime: '',
          beginDate: '',
          endDate: ''
        },
        discountFormRules: {
          discountName: [
            {
              validator: (rule, value, callback) => {
                if (value == '') {
                  callback(new Error('请输入折扣活动名'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          sale: [
            {
              validator: (rule, value, callback) => {
                if (value == undefined || value == '') {
                  callback(new Error('请输入折扣'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            },
            {
              validator: (rule, value, callback) => {
                if (value == undefined || /(^[1-9]\d*$)/.test(value) == false) {
                  callback(new Error('折扣必须为大于0小于100的正整数'));
                } else if (parseInt(value) > 100 || parseInt(value) <= 0) {
                  callback(new Error('折扣必须介于0之100的正整数'));
                } else {
                  callback();
                }
              }, trigger: 'change'
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
          this.discountSearchForm.companyId = value[0]
        } else {
          this.discountSearchForm.companyId = ''
        }
        if (value[1]) {
          this.discountSearchForm.regionId = value[1]
        } else {
          this.discountSearchForm.regionId = ''
        }
        if (value[2]) {
          this.discountSearchForm.officeId = value[2]
        } else {
          this.discountSearchForm.officeId = ''
        }
      },
      // 初始化机构
      fetchOfficeCascader() {
        fetchOfficeTree().then(response => {
          this.offices = response.response[0].children;
        });
      },
      search() {
        this.discountSearchListLoading = true;
        console.log(this.discountSearchForm)
        getDiscountList(this.discountSearchForm, this.page, this.size).then(response => {
          this.discountSearchListLoading = false;
          this.discountSearchList = response.response;
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
            if (this.discountDetailData.machineList) {
              this.$refs.machines.setCheckedKeys(this.discountDetailData.machineList);
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
        if (tab.name === 'createDiscount') {
          this.getMachineTree();
        } else {
          this.search();
          if (this.type !== 'create') {
            this.clear([], []);
            this.type = 'create'
          }
        }
      },
      // 处理输入非数字
      checkNum(val) {
        if (val != '') {
          val = parseInt(val.replace(/[^0-9]/ig, ''));
          if (isNaN(val)) {
            this.discountForm.sale = '';
          } else {
            this.discountForm.sale = val;
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
        this.$refs.discountForm.resetFields();
        this.products = [];
        this.selectProduct = selectProducts;
        this.machines = [];
        this.discountDetailData = {};
        this.discountInfoVisible = false;
        this.discountProductVisible = false;
        this.discountRangeVisible = true;
        this.step = 1;
        this.discountForm.discountName = '';
        this.discountForm.sale = '';
        this.discountForm.dateTime = '';
        this.discountForm.beginDate = '';
        this.discountForm.endDate = '';
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
        if (data.sale != this.discountDetailData.sale) {
          checkResult = true;
        } else {
          data.sale = null;
        }
        if (data.saleName != this.discountDetailData.saleName) {
          checkResult = true;
        } else {
          data.saleName = null;
        }
        data.discountOver = null;
        if (data.beginDate != this.discountDetailData.beginDate) {
          checkResult = true;
        } else {
          data.beginDate = null;
        }
        if (data.endDate != this.discountDetailData.endDate) {
          checkResult = true;
        } else {
          data.endDate = null;
        }
        if (this.checkList(data.machineList, this.discountDetailData.machineList)) {
          checkResult = true;
        } else {
          data.machineList = null;
          data.companyId = this.discountDetailData.companyId;
        }
        if (this.checkList(data.productList, this.discountDetailData.productList)) {
          checkResult = true
        } else {
          data.productList = null;
        }
        if (checkResult) {
          data.id = this.discountDetailData.id;
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
        this.discountForm.beginDate = dealDateTime(this.discountForm.dateTime[0]);
        this.discountForm.endDate = dealDateTime(this.discountForm.dateTime[1]);
        const data = {
          saleName: this.discountForm.discountName,
          sale: this.discountForm.sale,
          beginDate: this.discountForm.beginDate,
          endDate: this.discountForm.endDate,
          discountOver: 1,
          machineList,
          productList
        };
        // 当前处于修改验证是否有有效修改
        if (this.type === 'edit') {
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
        this.$refs.discountForm.validate(valid => {
          if (valid) {
            const data = this.dealData();
            if (this.type === 'create') {
              if (data !== null) {
                createdDiscount(data).then(response => {
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
                updateDiscount(data).then(response => {
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
        updateDiscountStatus(val.discountOver, val.id).then(response => {
          if (response == undefined || response.code !== 0) {
            // 回退
            if (val.discountOver == 0) {
              val.discountOver = 1;
            } else {
              val.discountOver = 0;
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
      getDiscountDetail(discountId) {
        getDetail(discountId).then(response => {
          this.discountDetailData = response.response;
        })
      },
      writeFormData() {
        this.discountForm.discountName = this.discountDetailData.saleName;
        this.discountForm.oldDiscountName = this.discountDetailData.saleName;
        this.discountForm.oldSale = this.discountDetailData.sale;
        this.discountForm.sale = this.discountDetailData.sale;
        let beginDate = new Date();
        if (this.discountDetailData.beginDate) {
          beginDate = new Date(this.discountDetailData.beginDate);
        }
        let endDate = new Date();
        if (this.discountDetailData.endDate) {
          endDate = new Date(this.discountDetailData.endDate);
        }
        this.discountForm.dateTime = [
          beginDate, endDate
        ];
        this.discountForm.oldDateTime = [
          beginDate, endDate
        ];
      },
      showDiscountDetail(row, event) {
        if (row.disable !== true) {
          this.clear([], []);
          this.getDiscountDetail(row.id);
          this.activeName = 'createDiscount';
          this.type = 'edit';
          this.getMachineTree();
        }
      },
      getProductsByMachineList(machineList) {
        this.discountCreateListLoading = true;
        getProductsByMachineList(machineList).then(response => {
          this.products = response.response;
          const _this = this;
          this.$nextTick(() => {
            _this.discountCreateListLoading = false;
            if (_this.type !== 'create') {
              for (let i = 0; i < _this.products.length; i++) {
                for (let j = 0; j < _this.discountDetailData.productList.length; j++) {
                  if (_this.products[i].id === _this.discountDetailData.productList[j]) {
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
              this.discountRangeVisible = false;
              this.discountProductVisible = true;
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
              this.discountProductVisible = false;
              this.discountInfoVisible = true;
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
            this.discountRangeVisible = true;
            this.discountProductVisible = false;
            if (this.step-- < 1) {
              this.step = 1;
            }
            break;
          case 2:
            this.discountProductVisible = true;
            this.discountInfoVisible = false;
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
  .discount-tree, .discount-form {
    transition: .2s;
    .filter-tree {
      margin-top: 20px;
    }
  }
</style>
