<template>
  <div style="margin: 1% 2%">
    <el-tabs v-model="activeName"
             @tab-click="changeTab">

      <el-tab-pane name="showHalfPrice">
        <span slot="label"><i class="el-icon-document"></i> 活动列表</span>

        <!--查询半价活动条件表单-->
        <el-form :model="halfPriceSearchForm" ref="halfPriceSearchForm" class="demo-form-inline" label-position="left"
                 label-width="75px">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="机构" prop="parentIdList" label-width="13%">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="halfPriceSearchForm.parentIdList"
                  :props="officeProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构"
                  style="width: 100%"></el-cascader>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="活动状态" prop="halfPriceOver">
                <el-select v-model="halfPriceSearchForm.halfPriceOver" clearable placeholder="请选择状态">
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
                    v-model="halfPriceSearchForm.dateTime"
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
              <el-form-item label="活动名称 " prop="saleName">
                <el-input type="text" v-model="halfPriceSearchForm.saleName"
                          placeholder="请输入活动名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6" :push="1">
              <el-button type="primary" icon="el-icon-search" round @click="search">查询</el-button>
              <el-button icon="el-icon-delete" round @click="resetForm('halfPriceSearchForm')" style="margin-left: 20px">
                重置
              </el-button>
            </el-col>
          </el-row>
        </el-form>

        <!--结果表格-->
        <el-tooltip class="item" effect="light" content="双击显示详情" placement="top-end">
          <el-table
            v-loading.body="halfPriceSearchListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="halfPriceSearchList"
            stripe
            border
            highlight-current-row
            ref="halfPriceSearchList"
            style="width: 100%;"
            @row-dblclick="showHalfPriceDetail">
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
            <el-table-column prop="halfPriceOver" label="活动状态" align="center">
              <template slot-scope="scope" align="center">
                <el-switch
                  v-model="scope.row.halfPriceOver"
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
                  @click="showHalfPriceDetail(editScope.row)">修改
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

      <el-tab-pane name="createHalfPrice">
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
            <el-col :span="10" class="discount-tree" v-show="halfPriceRangeVisible">
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
            <el-col :span="12" class="halfPrice-tree" v-show="halfPriceProductVisible">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">商品</h3>
                </div>
                <el-table
                  v-loading.body="halfPriceCreateListLoading"
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
            <el-col :span="12" class="halfPrice-tree" v-show="halfPriceInfoVisible">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">其他条件</h3>
                </div>
                <el-form :model="halfPriceForm" label-position="left" ref="halfPriceForm"
                         label-width="60px"
                         :rules="halfPriceFormRules">
                  <el-form-item label="活动名" prop="halfPriceName" style="margin-top: 20px;margin-left: 5%">
                    <el-input v-model="halfPriceForm.halfPriceName" style="width: 90%" placeholder="请输入半价活动名"></el-input>
                  </el-form-item>
                  <el-form-item label="半价数" prop="count" style="margin-top: 20px;margin-left: 5%">
                    <el-input type="number" pattern="[0-9]*"
                              placeholder="请输入第几个半价，如第二个半价填写2"
                              v-model.number="halfPriceForm.count"
                              style="width: 90%"></el-input>
                  </el-form-item>
                  <el-form-item label=" 时 间 " prop="dateTime" style="margin-top: 20px;margin-left: 5%">
                    <div class="block">
                      <el-date-picker
                        v-model="halfPriceForm.dateTime"
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
                    <el-button icon="el-icon-delete" round @click="resetForm('halfPriceForm')">重置</el-button>
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
    createdHalfPrice,
    fetchMachineTree,
    getDetail,
    getHalfPriceList,
    updateHalfPriceStatus,
    updateHalfPrice
  } from '../../api/halfPrice';
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
        halfPriceSearchForm: {
          parentIdList: [],
          dateTime: '',
          beginDate: '',
          endDate: '',
          saleName: '',
          halfPriceOver: '',
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
        halfPriceSearchList: [],
        halfPriceDetailData: [],
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
        halfPriceRangeVisible: true,
        halfPriceProductVisible: false,
        halfPriceInfoVisible: false,
        halfPriceSearchListLoading: false,
        halfPriceCreateListLoading: false,

        // 生成活动
        filterText: '',
        activeName: 'showHalfPrice',
        machines: [],
        treeProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        halfPriceForm: {
          halfPriceName: '',
          dateTime: '',
          beginDate: '',
          endDate: '',
          count: ''
        },
        halfPriceFormRules: {
          halfPriceName: [
            {
              validator: (rule, value, callback) => {
                if (value == '') {
                  callback(new Error('请输入半价活动名'));
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
          count: [
            {
              validator: (rule, value, callback) => {
                if (value == undefined || value == '') {
                  callback(new Error('请输入第几个半价'));
                } else if(parseInt(value) <= 0) {
                  callback(new Error('个数应为大于0的正整数'))
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
          this.halfPriceSearchForm.companyId = value[0]
        } else {
          this.halfPriceSearchForm.companyId = ''
        }
        if (value[1]) {
          this.halfPriceSearchForm.regionId = value[1]
        } else {
          this.halfPriceSearchForm.regionId = ''
        }
        if (value[2]) {
          this.halfPriceSearchForm.officeId = value[2]
        } else {
          this.halfPriceSearchForm.officeId = ''
        }
      },
      // 初始化机构
      fetchOfficeCascader() {
        fetchOfficeTree().then(response => {
          this.offices = response.response[0].children;
        });
      },
      search() {
        this.halfPriceSearchListLoading = true;
        getHalfPriceList(this.halfPriceSearchForm, this.page, this.size).then(response => {
          this.halfPriceSearchListLoading = false;
          this.halfPriceSearchList = response.response;
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
            if (this.halfPriceDetailData.machineList) {
              this.$refs.machines.setCheckedKeys(this.halfPriceDetailData.machineList);
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
        if (tab.name === 'createHalfPrice') {
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
        this.$refs.halfPriceForm.resetFields();
        this.products = [];
        this.selectProduct = selectProducts;
        this.machines = [];
        this.halfPriceDetailData = [];
        this.halfPriceInfoVisible = false;
        this.halfPriceProductVisible = false;
        this.halfPriceRangeVisible = true;
        this.step = 1;
        this.halfPriceForm.halfPriceName = '';
        this.halfPriceForm.count = '';
        this.halfPriceForm.dateTime = '';
        this.halfPriceForm.beginDate = '';
        this.halfPriceForm.endDate = '';
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
        if (data.count != this.halfPriceDetailData.count) {
          checkResult = true;
        } else {
          data.count = null;
        }
        if (data.saleName != this.halfPriceDetailData.saleName) {
          checkResult = true;
        } else {
          data.saleName = null;
        }
        data.halfPriceOver = null;
        if (data.beginDate != this.halfPriceDetailData.beginDate) {
          checkResult = true;
        } else {
          data.beginDate = null;
        }
        if (data.endDate != this.halfPriceDetailData.endDate) {
          checkResult = true;
        } else {
          data.endDate = null;
        }
        if (this.checkList(data.machineList, this.halfPriceDetailData.machineList)) {
          checkResult = true;
        } else {
          data.machineList = null;
          data.companyId = this.halfPriceDetailData.companyId;
        }
        if (this.checkList(data.productList, this.halfPriceDetailData.productList)) {
          checkResult = true
        } else {
          data.productList = null;
        }
        if (checkResult) {
          data.id = this.halfPriceDetailData.id;
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
        let productList = [];
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
        this.halfPriceForm.beginDate = dealDateTime(this.halfPriceForm.dateTime[0]);
        this.halfPriceForm.endDate = dealDateTime(this.halfPriceForm.dateTime[1]);
        const data = {
          saleName: this.halfPriceForm.halfPriceName,
          count: this.halfPriceForm.count,
          beginDate: this.halfPriceForm.beginDate,
          endDate: this.halfPriceForm.endDate,
          halfPriceOver: 1,
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
        this.$refs.halfPriceForm.validate(valid => {
          if (valid) {
            const data = this.dealData();
            if (this.type === 'create') {
              if (data !== null) {
                createdHalfPrice(data).then(response => {
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
                updateHalfPrice(data).then(response => {
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
        updateHalfPriceStatus(val.halfPriceOver, val.id).then(response => {
          if (response == undefined || response.code !== 0) {
            // 回退
            if (val.halfPriceOver == 0) {
              val.halfPriceOver = 1;
            } else {
              val.halfPriceOver = 0;
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
      getHalfPriceDetail(halfPriceId) {
        getDetail(halfPriceId).then(response => {
          this.halfPriceDetailData = response.response;
        })
      },
      writeFormData() {
        this.halfPriceForm.halfPriceName = this.halfPriceDetailData.saleName;
        this.halfPriceForm.oldHalfPriceName = this.halfPriceDetailData.saleName;
        this.halfPriceForm.oldCount = this.halfPriceDetailData.count;
        this.halfPriceForm.count = this.halfPriceDetailData.count;
        let beginDate = new Date();
        if (this.halfPriceDetailData.beginDate) {
          beginDate = new Date(this.halfPriceDetailData.beginDate);
        }
        let endDate = new Date();
        if (this.halfPriceDetailData.endDate) {
          endDate = new Date(this.halfPriceDetailData.endDate);
        }
        this.halfPriceForm.dateTime = [
          beginDate, endDate
        ];
        this.halfPriceForm.oldDateTime = [
          beginDate, endDate
        ];
      },
      showHalfPriceDetail(row, event) {
        if (row.disable !== true) {
          this.clear([], []);
          this.getHalfPriceDetail(row.id);
          this.activeName = 'createHalfPrice';
          this.type = 'edit';
          this.getMachineTree();
        }
      },
      getProductsByMachineList(machineList) {
        this.halfPriceCreateListLoading = true;
        getProductsByMachineList(machineList).then(response => {
          this.products = response.response;
          const _this = this;
          this.$nextTick(() => {
            _this.halfPriceCreateListLoading = false;
            if (_this.type !== 'create') {
              for (let i = 0; i < _this.products.length; i++) {
                for (let j = 0; j < _this.halfPriceDetailData.productList.length; j++) {
                  if (_this.products[i].id === _this.halfPriceDetailData.productList[j]) {
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
              this.halfPriceRangeVisible = false;
              this.halfPriceProductVisible = true;
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
              this.halfPriceProductVisible = false;
              this.halfPriceInfoVisible = true;
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
            this.halfPriceRangeVisible = true;
            this.halfPriceProductVisible = false;
            if (this.step-- < 1) {
              this.step = 1;
            }
            break;
          case 2:
            this.halfPriceProductVisible = true;
            this.halfPriceInfoVisible = false;
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
  .halfPrice-tree, .discount-form {
    transition: .2s;
    .filter-tree {
      margin-top: 20px;
    }
  }
</style>
