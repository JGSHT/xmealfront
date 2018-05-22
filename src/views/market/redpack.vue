<template>
  <div style="margin: 0% 2%;">
    <el-tabs v-model="activeName"  @tab-click="tabClick" >
      <el-tab-pane name="redpack">
        <span slot="label"> 红包概率配置</span>
        <el-row :gutter="20">
          <el-form :inline="true" :model="redpackSearch" class="demo-form-inline">
            <el-col :span="5">
            <el-form-item label="红包名称">
              <el-input v-model="redpackSearch.brokerageName" placeholder="红包名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item>
              <el-button type="primary" icon="search" @click="searchRedpack">查询</el-button>
              <el-button icon="plus" @click="addRedpack">新增</el-button>
            </el-form-item>
            </el-col>
          </el-form>
        </el-row>
          <el-table
           v-loading="redpackLoading"
           :data="redpacks"
           border
           stripe
           style="width: 100%;">
           <!-- <el-table-column prop="id" label="商品ID" ></el-table-column> -->
           <el-table-column prop="brokerageName" label="红包名称" align="center"></el-table-column>
           <el-table-column prop="money" label="红包金额" align="center"></el-table-column>
           <el-table-column prop="probability" label="中奖概率" width="300px" align="center">
             <template slot-scope="scope">
               <el-input style="width: 100px;" type="number" pattern="[0-9]*"
                         v-model.number="scope.row.newProbability" v-show="scope.row.edit"></el-input>
               <span v-show="!scope.row.edit">{{ scope.row.probability }}</span>
               <el-button v-show='!scope.row.edit' type="text" @click='editProbability(scope.row)' size="mini">修改</el-button>
               <el-button v-show='scope.row.edit' type="text" @click='saveProbability(scope.row)' size="mini">提交</el-button>
             </template>
           </el-table-column>
           <el-table-column label="操作" width="300px" align="center">
             <template slot-scope="scope">
               <el-button
                 size="small"
                 @click="redpackEdit(scope.$index, scope.row)">编辑</el-button>
               <el-button
                 size="small"
                 type="danger"
                 @click="redpackDelete(scope.$index, scope.row)">删除</el-button>
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
          <el-dialog :title="dialogTitle" :visible.sync="dialogShow">
            <el-form :model="redpack" label-position="left" ref="redpack" class="redpack-form"
            :rules="redpackFormRules" v-loading="formLoading" label-width="100px" style="margin: 0 3%">
              <el-form-item label="红包ID" v-show="false" prop="id">
                <el-input v-model="redpack.id" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="红包名称" prop="brokerageName">
                <el-input v-model="redpack.brokerageName" placeholder="红包名称"></el-input>
              </el-form-item>
              <el-form-item label="红包金额" prop="money">
                <el-input type="number" v-model="redpack.money" placeholder="红包金额"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="save" :loading="saveLoading">确定</el-button>
              <el-button @click="dialogShow = false">取消</el-button>
            </div>
          </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="redpackDetails">
        <span slot="label">红包发放明细</span>
        <el-row :gutter="20">
        <el-form :inline="true" :model="redpackDetaiSearch" class="demo-form-inline">
          <el-col :span="5">
          <el-form-item label="微信昵称">
            <el-input v-model="redpackDetaiSearch.userName" placeholder="微信昵称"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item label="手机号码" prop="mobile">
            <el-input type="text" v-model="redpackDetaiSearch.userMobile" placeholder="请输入手机号码"
                      pattern="^[0-9]*[1-9][0-9]*$"
                      :maxlength="mobileLength" v-on:blur="checkMobile" style=";width: 132%"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="抽奖时间" prop="dateTime">
            <el-date-picker
              v-model="redpackDetaiSearch.dateTime"
              type="datetimerange"
              :picker-options="pickerOptions2"
              placeholder="选择时间范围"
              align="right">
            </el-date-picker>
          </el-form-item>
          </el-col>
          <el-col :span="5">
          <el-form-item>
            <el-button type="primary" icon="search" @click="searchRedpackDetail">查询</el-button>
          </el-form-item>
          </el-col>
        </el-form>
        </el-row>
        <el-table
          v-loading="redpackDetailLoading"
          :data="redpackDetails"
          border
          stripe
          style="width: 100%;">
          <el-table-column prop="userName" label="微信昵称" align="center"></el-table-column>
          <el-table-column prop="userMobile" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="money" label="红包金额" align="center"></el-table-column>
          <el-table-column prop="createdDate" label="抽奖日期" align="center"></el-table-column>
        </el-table>
        <p class="block" style="float:right">
          <el-pagination
            @size-change="redpackHandleSizeChange"
            @current-change="redpackHandleCurrentChange"
            :current-page="detailPage"
            :page-sizes="detailSizes"
            :page-size="detailSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailTotal">
          </el-pagination>
        </p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchRedpackList,fetchRedpackSave,fetchRedpackNode,fetchRedpackDelete,updateProbability,fetchRedpackDetailList } from 'api/redpack';

  export default {
    created() {
      this.searchRedpack()
    },
    data() {
      return {
        activeName:'redpack',

        redpackSearch: {
          brokerageName: '',
        },

        redpacks: [],
        redpackLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],


        redpackDetaiSearch: {
          userName: '',
          userMobile: '',
          dateTime: '',
        },
        redpackDetails: [],
        redpackDetailLoading: false,
        detailPage: 1,
        detailSize: 10,
        detailTotal: 0,
        detailSizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        saveLoading: false,
        productMachinesLoading: false,
        mobileLength: 11,
        redpack: {
          id: '',
          brokerageName: '',
          money: ''
        },
        redpackFormRules: {
          brokerageName: [
            {
              validator: (rule, value, callback) => {
                if (value == '' || value.replace(/(^\s*)|(\s*$)/g, '') === '') {
                  callback(new Error("请输入红包名称"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          money: [
            {
              validator: (rule, value, callback) => {
                if (value == '' || value <= 0) {
                  callback(new Error("请规范输入红包金额"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ]
        },
        pickerOptions2: {
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
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {
      searchRedpack() {
        this.redpackLoading = true
        fetchRedpackList(this.redpackSearch, this.page, this.size).then(response =>{
          this.redpackLoading = false
          this.redpacks = response.response
          this.total = response.total
        })
      },
      redpackEdit(index, row) {
        this.dialogTitle = '修改红包信息'
        this.dialogShow = true
        this.formLoading = true
        this.resetForm()
        fetchRedpackNode(row.id).then(response =>{
          this.formLoading = false
          this.redpack = response.response
        })
      },
      redpackDelete(index, row) {
        this.$confirm('此操作将永久删除该红包, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.redpackLoading = true
          fetchRedpackDelete(row.id).then(response =>{
            this.searchRedpack()
            this.$message.success('删除成功')
          })
        })

      },
      addRedpack() {
        this.dialogTitle = '新增红包'
        this.dialogShow = true
        this.resetForm()
      },
      save () {
        this.$refs['redpack'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            fetchRedpackSave(this.redpack).then(response =>{
              this.searchRedpack()
              this.saveLoading = false
              this.$message.success('保存成功')
              this.dialogShow = false
            })
          } else {
            return false
          }
        })
      },
      //去除输入的非数字
      checkMobile() {
        if(this.redpackDetaiSearch.userMobile !== "") {
          this.redpackDetaiSearch.userMobile = (this.redpackDetaiSearch.userMobile).replace(/[^0-9]/ig, "");
          if(this.redpackDetaiSearch.userMobile === "") {
            this.open();
          }
        }

      },
      open() {
        this.$message({
          message: '手机号码输入框中请输入数字',
          type: 'warning'
        });
      },
      resetForm() {
        if (this.$refs['redpack']) {
          this.$refs['redpack'].resetFields();
        }
        this.saveLoading = false
      },
      handleSizeChange(val) {
        this.size = val
        this.searchRedpack()
      },
      handleCurrentChange(val) {
        this.page = val
        this.searchRedpack()
      },
      editProbability(redpack) {
        redpack.edit = true
        redpack.newProbability = redpack.probability
      },
      saveProbability(redpack) {
        if(redpack.newProbability < 0 ){
         this.$message({
            message: '请规范输入中奖概率',
            type: 'error',
            duration: 2000
          });
         return
        }
        updateProbability({'id':redpack.id,'probability':redpack.newProbability}).then(response => {
          if (response.code === 0) {
            redpack.probability = redpack.newProbability
            redpack.edit=false
          }
        })
      },

      redpackHandleSizeChange(val) {
        this.detailSize = val
        this.searchRedpackDetail()
      },
      redpackHandleCurrentChange(val) {
        this.detailPage = val
        this.searchRedpackDetail()
      },
      searchRedpackDetail(tab, event) {
        this.redpackDetailLoading = true
        fetchRedpackDetailList(this.redpackDetaiSearch, this.detailPage, this.detailSize).then(response =>{
          this.redpackDetailLoading = false
          this.redpackDetails = response.response
          this.detailTotal = response.total
        })
      },
      tabClick(tab, event) {
        if (tab.name === 'redpack') {
          if (this.redpacks.length < 1) {
            this.searchRedpack()
          }
        }
        if (tab.name === 'redpackDetails') {
          if (this.redpackDetails.length < 1) {
            this.searchRedpackDetail()
          }
        }
      }
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.product-table-expand {
  font-size: 0;
  label{
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33.3%;
  }
}
.el-card__header {
    padding: 2px 20px!important;
    border-bottom: 1px solid #d1dbe5;
    box-sizing: border-box;
}
</style>
