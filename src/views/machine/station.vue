<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="站点信息" name="stationInfo">
        <el-row :gutter="20">
          <el-form :inline="true" :model="stationSearch" class="demo-form-inline">
            <el-col :span="5">
            <el-form-item label="站点名称">
              <el-input v-model="stationSearch.stationName" placeholder="站点名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item>
              <el-button type="primary" icon="search" @click="getStationList">查询</el-button>
              <el-button icon="plus" @click="addStation">新增</el-button>
            </el-form-item>
            </el-col>
          </el-form>
        </el-row>

        <el-table
            ref="multipleTable"
            v-loading="stationListLoading"
            :data="stationList"
            border
            stripe
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="ID"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="stationName"
              label="站点名称"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="qrcodeUrl" label="二维码" align="center">
              <template slot-scope="scope">
                <el-popover
                  ref="qrcodeUrlImg"
                  placement="right"
                  trigger="hover">
                  <img :src="scope.row.qrcodeUrl" style="width:120px;height:120px;"/>
                </el-popover>
                <el-button v-popover:qrcodeUrlImg type="text" v-if="scope.row.qrcodeUrl">查看</el-button>
                <a :href="scope.row.qrcodeUrl" :download="scope.row.stationName"><font color="#4db3ff">下载</font></a>
              </template>
            </el-table-column>
            <el-table-column
              prop="qrcode"
              label="站点地址"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="stationEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="stationDelete(scope.$index, scope.row)">删除
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
              :total="stationTotal">
            </el-pagination>
          </p>
          <el-dialog :title="dialogTitle" :visible.sync="dialogShow" :close="resetForm">
            <div style="align-content:center">
              <el-form :model="station" label-position="left" ref="stationForm" :rules="stationFormRules"
                       v-loading="formLoading"
                       label-width="100px"
                       style="margin: 0 3%">

                <el-form-item label="站点名称" prop="stationName">
                  <el-input style="width: 360px;" v-model="station.stationName" placeholder="站点名称"></el-input>
                </el-form-item>
                <el-form-item label="大区" prop="companyId">
                  <el-select v-model="station.companyId" filterable clearable placeholder="选择大区">
                    <el-option v-for="office in offices" :key="office.id" :label="office.name"
                               :value="parseInt(office.id)"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveStation" :loading="saveLoading">确定</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>
          </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="站点人员信息" name="stationManInfo">
        <el-row :gutter="20">
          <el-form :inline="true" :model="stationManSearch" ref="stationManSearch" class="demo-form-inline">
            <el-col :span="5">
            <el-form-item label="站点名称" prop="stationName">
              <el-input v-model="stationManSearch.stationName" placeholder="站点名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="stationManSearch.name" placeholder="姓名"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="stationManSearch.mobile" placeholder="请输入手机号码"
                        :maxlength="11"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item>
              <el-button type="primary" icon="search" @click="getStationManList">查询</el-button>
              <el-button type="primary" @click="resetSearchForm" icon="delete">重置</el-button>
            </el-form-item>
            </el-col>
          </el-form>
        </el-row>
          <el-table
            ref="multipleTable"
            v-loading="stationManListLoading"
            :data="stationManList"
            border
            stripe
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号码"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱地址"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="stationName"
              label="所属站点"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <p class="block" style="float:right">
            <el-pagination
              @size-change="handleeSizeChange"
              @current-change="handleeCurrentChange"
              :current-page="spage"
              :page-sizes="ssizes"
              :page-size="ssize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchStationList, fetchDeleteStation, fetchSaveStation, fetchUpdateStation } from 'api/station';
  import { fetchOfficeTree } from 'api/office';
  import { fetchStationManList } from 'api/stationManInfo';

  export default {
    created() {
      this.getStationList()
      this.getOffice()
      this.getStationManList()
    },
    data() {
      return {
        activeName: 'stationInfo',
        stationSearch: {
          stationName: ''
        },
        offices: [],
        stationFormRules: {
          stationName: [
            { required: true, message: '请输入站点名称', trigger: 'change' }
          ],
          companyId: [
            { type: 'number', required: true, message: '请选择大区', trigger: 'change' }
          ]
        },
        stationList: [],
        stationListLoading: false,
        page: 1,
        spage: 1,
        ssize: 10,
        size: 10,
        total: 0,
        stationTotal: 0,
        sizes: [10, 20, 50, 100],
        ssizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        filterText: '',
        menus: [],
        station: {
          id: '',
          stationName: '',
          companyId: '',
          companyName: ''
        },

        stationManSearch: {
          stationName: '',
          mobile: '',
          name: ''
        },
        stationManList: [],
        stationManListLoading: false,
      }
    },
    methods: {
      getOffice() {
        fetchOfficeTree().then(response => {
          this.offices = response.response[0].children
        })
      },
      getStationList() {
        this.stationListLoading = true
        fetchStationList(this.stationSearch, this.page, this.size).then(response => {
          this.stationListLoading = false
          this.stationList = response.response
          this.stationTotal = response.total
        })
      },
      stationEdit(index, row) {
        this.dialogTitle = '编辑'
        this.dialogShow = true
        this.formLoading = true
        fetchUpdateStation(row.id).then(response => {
          this.formLoading = false
          this.station = response.response
        })
      },
      stationDelete(index, row) {
        this.$confirm('此操作将永久删除该站点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.stationListLoading = true
          fetchDeleteStation(row.id).then(response => {
            this.getStationList()
            this.$message.success('删除成功')
          })
        })
      },
      addStation() {
        this.station.id = ''
        this.station.companyId = ''
        this.station.companyName = ''
        this.station.stationName = ''
        this.dialogTitle = '新增'
        this.dialogShow = true
        this.resetForm()
      },
      saveStation() {
        this.$refs['stationForm'].validate((valid) => {
          if (valid) {
            console.log("#################################")
            this.saveLoading = true
            if (this.station.companyId) {
              this.station.companyName = this.offices.find((item) => {
                return parseInt(item.id) === this.station.companyId
              }).name
            }
            fetchSaveStation(this.station).then(response => {
              this.getStationList()
              this.saveLoading = false
              this.$message.success('保存成功')
              this.dialogShow = false
            })
          } else {
            return false
          }
        })
      },
      resetForm() {
        if (this.$refs['stationForm']) {
          this.$refs['stationForm'].resetFields();
        }
      },
      cancel() {
        this.resetForm()
        this.dialogShow = false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleSizeChange(val) {
        this.size = val
        this.getStationList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getStationList()
      },

      getStationManList() {
        if (this.checkMobile()) {
          return;
        }
        this.stationManListLoading = true
        fetchStationManList(this.stationManSearch, this.spage, this.ssize).then(response => {
          this.stationManListLoading = false
          this.stationManList = response.response
          this.total = response.total
        })
      },
      handleeSizeChange(val) {
        this.ssize = val
        this.getStationManList()
      },
      handleeCurrentChange(val) {
        this.spage = val
        this.getStationManList()
      },
      //重置搜索框
      resetSearchForm() {
        this.$refs['stationManSearch'].resetFields();
      },
      //去除输入的非数字
      checkMobile() {
        if (this.stationManSearch.mobile !== "") {
          this.stationManSearch.mobile = (this.stationManSearch.mobile).replace(/[^0-9]/ig, "");
          if (this.stationManSearch.mobile === "") {
            this.open();
            return true;
          }
        }
      },
      open() {
        this.$message({
          message: '手机号码输入框中请输入数字',
          type: 'warning'
        });
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
