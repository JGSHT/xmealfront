<template>
  <div style="margin: 1% 2%;">
    <el-form :inline="true" :model="roleSearch" class="demo-form-inline">
      <el-form-item label="角色名称">
        <el-input v-model="roleSearch.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="机构">
        <el-select v-model="roleSearch.officeId" filterable clearable placeholder="选择机构">
          <el-option v-for="office in offices" :key="office.id" :label="office.name"
                     :value="parseInt(office.id)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" v-if="getMenuBtn('admin:role:find')" round @click="search">查询</el-button>
        <el-button icon="el-icon-plus" round v-if="getMenuBtn('admin:role:add')" @click="addRole">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="roleListLoading"
      :data="roles"
      stripe
      border
      style="width: 100%;">
      <el-table-column prop="id" label="角色ID" align="center"></el-table-column>
      <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="enName" label="英文名称" align="center"></el-table-column>
      <el-table-column prop="officeName" label="机构" align="center"></el-table-column>
      <el-table-column prop="status" label="角色状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '1' ? 'primary' : ''"
            close-transition>{{scope.row.status === '1' ? '可用' : '禁用'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template  slot-scope="scope">
          <el-button
            size="small"
            icon="el-icon-edit"
            v-if="getMenuBtn('admin:role:edit')"
            @click="roleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            :disabled="scope.row.name === '加盟商' || scope.row.enName === 'franchisee' || scope.row.remarks === '加盟商' ||
                       scope.row.name === '招商部总监' || scope.row.enName === 'CBO' || scope.row.remarks === '招商部总监' ||
                       scope.row.name === '招商部经理' || scope.row.enName === 'CMM' || scope.row.remarks === '招商部经理' ||
                       scope.row.name === '财务主管' || scope.row.enName === 'Treasurer' || scope.row.remarks === '财务主管'"
            v-if="getMenuBtn('admin:role:delete')"
            @click="roleDelete(scope.$index, scope.row)">删除
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
      <div style="overflow:scroll;height:450px;">
        <el-form :model="role" label-position="left" ref="role" :rules="roleFormRules" v-loading="formLoading"
                 label-width="100px"
                 style="margin: 0 3%">
          <el-form-item label="角色ID" v-show="false" prop="id">
            <el-input v-model="role.id" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="role.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="enName">
            <el-input v-model="role.enName" placeholder="英文名称"></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="officeId">
            <el-select v-model="role.officeId" placeholder="选择机构" style="width:100%">
              <el-option v-for="office in offices" :key="office.id" :label="office.name"
                         :value="parseInt(office.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="功能菜单" prop="menuIds">
            <el-tree class="filter-tree" style="margin-top: 10px;"
                     v-loading="treeLoading"
                     :data="menus"
                     :props="treeProps"
                     :default-expanded-keys="['1']"
                     ref="menus"
                     node-key="id"
                     show-checkbox>
            </el-tree>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="role.remarks" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" round :loading="saveLoading">确定</el-button>
        <el-button @click="dialogShow = false" round>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchOfficeTree} from 'api/office';
  import {fetchMenuTree} from 'api/menu';
  import {fetchRoleList, fetchRoleDelete, fetchRoleSave, fetchRoleNode} from 'api/role';
  import {isHasPermission} from "../../utils/btnPermission";


  export default {
    created() {
      this.getOffices()
      this.getMenuBtn()
      this.getMenuTree()
      this.search()
    },
    data() {
      return {
        roleSearch: {
          name: '',
          officeId: '',
        },
        offices: [],

        roles: [],
        roleListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        filterText: '',
        menus: [],
        role: {
          id: '',
          name: '',
          enName: '',
          officeId: '',
          menuIds: [],
          remarks: ''
        },
        treeProps: {
          children: 'children',
          label: 'name',
        },
        roleFormRules: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          // officeId: [
          //   { type: 'number', required: true, message: '请选择所属机构', trigger: 'change' }
          // ]
        },
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
      getMenuBtn(menuBtn){
        return isHasPermission(menuBtn);
      },
      search() {
        this.roleListLoading = true
        fetchRoleList(this.roleSearch, this.page, this.size).then(response => {
          this.roleListLoading = false
          this.roles = response.response
          this.total = response.total
        })
      },
      roleEdit(index, row) {
        this.dialogShow = true
        this.formLoading = true
        fetchRoleNode(row.id).then(response => {
          this.formLoading = false
          this.role = response.response
          //console.log(this.role.menuIds)
          this.$refs.menus.setCheckedKeys(this.role.menuIds);
        })
      },
      roleDelete(index, row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.roleListLoading = true
          fetchRoleDelete(row.id).then(response => {
            this.search()
            this.$message.success('删除成功')
          })
        })

      },
      addRole() {
        this.dialogShow = true
        this.resetForm()
      },
      save() {
        this.$refs['role'].validate((valid) => {
          this.role.menuIds = this.$refs.menus.getCheckedKeys()
          //console.log(this.role.menuIds);
          if (valid) {
            this.saveLoading = true
            fetchRoleSave(this.role).then(response => {
              this.search()
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
        if (this.$refs['role']) {
          this.$refs['role'].resetFields();
        }
        if (this.$refs.menus) {
          this.$refs.menus.setCheckedKeys([])
        }
        this.saveLoading = false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getMenuTree() {
        this.treeLoading = true
        fetchMenuTree().then(response => {
          if (response.response) {
            this.treeLoading = false
            this.menus = response.response;
          }
        })
      },
      handleSizeChange(val) {
        this.size = val
        this.search()
      },
      handleCurrentChange(val) {
        this.page = val
        this.search()
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
