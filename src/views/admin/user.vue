<template>
  <div style="margin: 1% 2%;">
    <el-form :inline="true" :model="userSearch" class="demo-form-inline">
      <el-form-item label="用户名称">
        <el-input v-model="userSearch.name" placeholder="用户名称"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userSearch.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="机构">
        <el-cascader
          :options="offices"
          v-model="userSearch.officeIdList"
          :props="cascaderProps"
          change-on-select
          clearable
          @change="handleChange"
          style="width:240px">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" v-if="getMenuBtn('admin:user:find')" round @click="search">查询</el-button>
        <el-button icon="el-icon-plus" v-if="getMenuBtn('admin:user:add')" round @click="addUser">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="userListLoading"
      :data="users"
      stripe
      border
      style="width: 100%;">
      <!-- <el-table-column prop="id" label="用户ID" ></el-table-column> -->
      <el-table-column prop="loginName" label="登录账号" width="200" align="center"></el-table-column>
      <el-table-column prop="name" label="用户名称" width="150" align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="150" align="center"></el-table-column>
      <el-table-column prop="companyName" label="大区" width="100" align="center"></el-table-column>
      <el-table-column prop="regionName" label="中心" width="100" align="center"></el-table-column>
      <el-table-column prop="officeName" label="片区" width="100" align="center"></el-table-column>
      <el-table-column prop="isAdmin" label="管理员" width="80" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '1' ? 'primary' : ''"
            close-transition>{{scope.row.status === '1' ? '是' : '否'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            v-if="getMenuBtn('admin:user:edit')"
            @click="userEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="small"
            type="text"
            v-if="getMenuBtn('admin:user:editPswd')"
            @click="changePW(scope.$index, scope.row)">修改密码
          </el-button>
          <el-button
            size="small"
            type="danger"
            v-if="getMenuBtn('admin:user:delete')"
            @click="userDelete(scope.$index, scope.row)">删除
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow">
      <div style="overflow-y: scroll;height:480px;">
        <el-form :model="user" label-position="left" ref="user" :rules="userFormRules" v-loading="formLoading"
                 label-width="120px"
                 style="margin: 0 3%">
          <el-form-item label="用户ID" v-show="false" prop="id">
            <el-input v-model="user.id" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="loginName">
            <el-input v-model="user.loginName" placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="user.name" placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="user.mobile" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="是否超级管理员" prop="isAdmin">
            <el-switch active-text="是" inactive-text="否" active-value="1" inactive-value="0" v-model="user.isAdmin"
                       @change="changeAdmin" :disabled="user.isFranchisee === '1'"></el-switch>
          </el-form-item>
          <el-form-item label="是否加盟商" prop="isFranchisee">
            <el-switch active-text="是" inactive-text="否" active-value="1" inactive-value="0" v-model="user.isFranchisee"
                       @change="changeFranchisee"></el-switch>
          </el-form-item>
          <el-form-item label="所属机构" prop="officeIdList">
            <el-cascader
              :disabled="officeDisbled"
              :options="offices"
              v-model="user.officeIdList"
              :props="cascaderProps"
              change-on-select
              clearable
              @change="handleUserChange"
              placeholder="选择机构"
              style="width:100%">
            </el-cascader>
          </el-form-item>
          <el-form-item label="角色" prop="roleIds">
            <el-transfer
              v-model="user.roleIds"
              :data="roles"
              :disabled="true"
              :props="{key: 'id',label: 'name'}"
              :titles="['可选角色', '已有角色']"
              filterable
              filter-placeholder="请输入角色名称">
            </el-transfer>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="user.remarks" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right: 5%">
        <el-button type="primary" @click="save" :loading="saveLoading" round>确定</el-button>
        <el-button @click="dialogShow = false" round>取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="changePWDialogVisible"
               :before-close="handleClose">
      <el-row style="margin-bottom: 20px">
        <label style="width: 40%;margin-left: 20%"> 新 密 码 </label><el-input
        placeholder="请输入新密码"
        :maxlength="16"
        :minlength="6"
        v-model="passWord"
        clearable
        style="width: 40%;margin-left: 10px">
      </el-input>
        <el-button
          round type="primary"
          style="margin-left: 20px"
          @click="saveNewPW"
          icon="el-icon-edit">
          修改
        </el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchOfficeTree} from 'api/office';
  import {fetchRoleList} from 'api/role';
  import {fetchUserList, fetchUserDelete, fetchUserSave, fetchUserNode} from 'api/user';
  import {fetchCode, fetchSaveNewPW} from "../../api/user";
  import ElButton from "element-ui/packages/button/src/button";
  import {isHasPermission} from "../../utils/btnPermission";


  export default {
    components: {ElButton},
    created() {
      this.getOffices();
      this.getRoles();
      this.search();
      this.getMenuBtn();
    },
    data() {
      return {
        userSearch: {
          name: '',
          mobile: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: []
        },
        offices: [],
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },

        users: [],
        userListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        officeDisbled: false,
        filterText: '',
        roles: [],
        user: {
          id: '',
          loginName: '',
          name: '',
          officeIdList: [],
          officeId: '',
          regionId: '',
          companyId: '',
          roleIds: [],
          isAdmin: '',
          remarks: '',
          isFranchisee: '',
        },
        userFormRules: {
          loginName: [
            {required: true, message: '请输入登录账号', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入用户名称', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          roleIds: [
            {type: 'array', required: true, message: '请选择用户角色', trigger: 'blur'}
          ]
        },
        roleDisabled: true,
        currentRow: {},
        changePWDialogVisible: false,
        passWord: ''
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
      getRoles() {
        fetchRoleList({'id': 1}, 1, 1000000).then(response => {
          this.roles = response.response;
        })
      },
      search() {
        this.userListLoading = true;
        fetchUserList(this.userSearch, this.page, this.size).then(response => {
          this.userListLoading = false;
          this.users = response.response;
          this.total = response.total;
        })
      },
      getMenuBtn(menuBtn){
        return isHasPermission(menuBtn);
      },
      userEdit(index, row) {
        this.dialogTitle = '修改用户';
        this.dialogShow = true;
        this.formLoading = true;
        fetchUserNode(row.id).then(response => {
          this.formLoading = false;
          this.user = response.response;
          this.user.officeIdList = [];
          this.user.officeIdList.push(response.response.companyId == null ? '' : response.response.companyId.toString());
          this.user.officeIdList.push(response.response.regionId == null ? '' : response.response.regionId.toString());
          this.user.officeIdList.push(response.response.officeId == null ? '' : response.response.officeId.toString().toString());
          if(response.response.isFranchisee === '1') {
            this.changeDataDisabledToFalse(1);
          } else {
            this.changeDataDisabledToFalse(2);
          }
        })
      },
      userDelete(index, row) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.userListLoading = true;
          fetchUserDelete(row.id).then(response => {
            this.search();
            this.$message.success('删除成功')
          })
        })

      },
      addUser() {
        this.dialogShow = true;
        this.resetForm();
      },
      save() {
        this.$refs['user'].validate((valid) => {
          if (valid) {
            this.saveLoading = true;
            fetchUserSave(this.user).then(response => {
              this.search();
              this.saveLoading = false;
              this.$message.success('保存成功');
              this.dialogShow = false;
            })
          } else {
            return false;
          }
        })
      },
      resetForm() {
        this.saveLoading = false
        this.officeDisbled = false
        if (this.$refs['user']) {
          this.$refs['user'].resetFields();
        }

      },
      handleSizeChange(val) {
        this.size = val
        this.search()
      },
      handleCurrentChange(val) {
        this.page = val
        this.search()
      },
      handleChange(value) {
        if (value[0]) {
          this.userSearch.companyId = value[0]
        } else {
          this.userSearch.companyId = ''
        }
        if (value[1]) {
          this.userSearch.regionId = value[1]
        } else {
          this.userSearch.regionId = ''
        }
        if (value[2]) {
          this.userSearch.officeId = value[2]
        } else {
          this.userSearch.officeId = ''
        }
      },
      handleUserChange(value) {
        if (value[0]) {
          this.user.companyId = value[0]
        } else {
          this.user.companyId = ''
        }
        if (value[1]) {
          this.user.regionId = value[1]
        } else {
          this.user.regionId = ''
        }
        if (value[2]) {
          this.user.officeId = value[2]
        } else {
          this.user.officeId = ''
        }
      },
      changeAdmin(val) {
        if (val === '1') {
          this.user.officeIdList = [];
          this.officeDisbled = true
        } else {
          this.officeDisbled = false
        }
      },
      changeFranchisee(val) {
        if (val === '1') {
          this.user.roleIds = [];
          this.changeDataDisabledToFalse(1);
        } else {
          this.changeDataDisabledToFalse(2);
        }
      },
      changeDataDisabledToFalse(type) {
          type = (type === 1);
          for(let i = 0; i < this.roles.length; i++) {
              this.roles[i].disabled = type;
              if(type === true && this.roles[i].name === '加盟商') {
                this.user.roleIds = [this.roles[i].id];
                this.user.officeIdList = [];
                this.user.companyId = '';
                this.user.companyName = '';
                this.user.regionId = '';
                this.user.regionName = '';
                this.user.officeId = '';
                this.user.officeName = '';
                this.user.isAdmin = '0';
              }
          }
      },
      changePW(index, row) {
        this.currentRow = row;
        this.changePWDialogVisible = true;
      },
      handleClose(done) {
        this.passWord = '';
        done();
      },
      saveNewPW() {
        if (!this.passWord || this.passWord.length < 6 || this.passWord.length > 16) {
          this.$message({
            showClose: true,
            message: '新密码位数最少为6位',
            duration: 3000,
            type: 'warning'
          });
          return;
        }
        fetchSaveNewPW(this.passWord, this.currentRow.id).then(response => {
          console.log(response)
          if (response.code === 0) {
            this.$message({
              showClose: true,
              message: '修改成功',
              duration: 3000,
              type: 'success'
            });
            this.changePWDialogVisible = false;
          } else {
            this.$message({
              showClose: true,
              message: '修改失败',
              duration: 3000,
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .el-transfer-panel__body {
    height: 250px;
  }
</style>
