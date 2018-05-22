<template>
  <div style="margin: 1% 2%;">
    <el-row :gutter="20">
      <el-col :span="10" class="menu-tree">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height:24px">
             <h3 style="line-height: 24px;display:inline;">菜单信息</h3>
             <p style="float: right;margin:0px;">
               <el-button type="primary" size="small" round icon="el-icon-plus" v-if="getMenuBtn('admin:menu:add')" @click="addMenu">新增</el-button>
               <el-button type="primary" size="small" round icon="el-icon-delete" v-if="getMenuBtn('admin:menu:delete')" @click="deleteMenu">删除</el-button>
             </p>
           </div>
           <el-input
             placeholder="输入关键字进行过滤"
             v-model="filterText">
           </el-input>
           <el-tree class="filter-tree"
             v-loading="treeLoading"
             :data="menus"
             :props="treeProps"
                    :default-expanded-keys="['1']"
             ref="menus"
             node-key="id"
             :filter-node-method="filterNode"
             show-checkbox
             @node-click="handleNodeClick">
           </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14" class="menu-form">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height:24px">
             <h3 style="line-height: 24px;display:inline;">菜单详情</h3>
           </div>
           <el-form :model="menuForm" label-position="left" :rules="menuFormRules"
                    ref="menuForm" v-loading="formLoading" label-width="100px">
             <el-form-item label="菜单ID" prop="id" v-show="false">
               <el-input v-model="menuForm.id"></el-input>
             </el-form-item>
             <el-form-item label=" 父级菜单" prop="parentIdList">
               <el-cascader
                 :disabled="menuParentIdsDisbled"
                 :options="menuOptions"
                 v-model="menuForm.parentIdList"
                 :props="cascaderProps"
                 change-on-select
                 @change="handleChange"
                 style="width:100%">
               </el-cascader>
             </el-form-item>
             <!--<el-form-item label="父级菜单" prop="parentId">
               <el-select  v-model="menuForm.parentId" filterable clearable :disabled="disbled" placeholder="选择父级菜单(不选则为顶级菜单)" style="width:100%">
                 <el-option v-for="menu in menus" :key="menu.id" :label="menu.name" :value="parseInt(menu.id)"></el-option>
               </el-select>
             </el-form-item>-->
             <el-form-item label="菜单名称" prop="name">
               <el-input v-model="menuForm.name" placeholder="输入菜单名称"></el-input>
             </el-form-item>
             <el-form-item label="权限标志" prop="permission">
               <el-input v-model="menuForm.permission" placeholder="输入权限标志"></el-input>
             </el-form-item>
             <el-form-item label="拥有菜单角色" v-show="this.menuForm.showRole" prop="roleIds">
               <el-transfer
                 v-model="menuForm.roleIds"
                 :data="roles"
                 :disabled="true"
                 :props="{key: 'id',label: 'name'}"
                 :button-texts="['减少', '增加']"
                 :titles="['可选角色', '已有角色']"
                 filterable
                 filter-placeholder="请输入角色名称">
               </el-transfer>
             </el-form-item>
             <el-form-item>
               <el-button type="primary" v-if="getMenuBtn('admin:menu:save')" @click="onSubmit" :loading="saveLoading" round>保存</el-button>
               <el-button @click="resetForm" v-if="getMenuBtn('admin:menu:clean')" round icon="el-icon-delete">重置</el-button>
            </el-form-item>
           </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchMenuTree,fetchMenuSave,fetchMenuNode,fetchMenuDelete } from 'api/menu';
  import {fetchRoleListForTransfer} from "../../api/role";
  import {isHasPermission} from "../../utils/btnPermission";

  export default {
    created() {
      this.getMenuTree();
      this.getMenuBtn();
      this.getRoles();
    },
    data() {
      return {
        filterText: '',
        menus: [],
        menuOptions: [],
        treeProps: {
          children: 'children',
          label: 'name',
        },
        selectProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        menuForm: {
          id: '',
          name: '',
          parentIdList: [],
          permission: '',
          parentId: '',
          parentIds:'',
          roleIds: [],
          showRole: true
        },
        menuFormRules: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          parentIdList: [
            {type: 'array', required: true, message: '请选择父级机构', trigger: 'blur'}
          ],
          permission: [
            { required: true, message: '请输入权限标志', trigger: 'blur' }
          ]
        },
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        roles: [],
        saveLoading: false,
        treeLoading: false,
        addMenuBtnLoading: false,
        formLoading: false,
        disbled: false,
        menuParentIdsDisbled:false
      }
    },
    methods: {
      getMenuTree() {
        this.treeLoading = true
        fetchMenuTree().then(response => {
          if (response.response) {
            this.menus = response.response[0].children;
          }
          this.menuOptions = response.response;
          if (this.menuOptions) {
            this.menuOptions.forEach(menus => {
              if (menus.children) {
                menus.children.forEach(children1 => {
                  if (children1.children) {
                    children1.children.forEach(children2 => {
                      if (children2.children) {
                        children2.children.forEach(children3 => {
                          if (children3.children) {
                            children3.children = null
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
          this.treeLoading = false;
        })
      },
      getMenuBtn(menuBtn){
        return isHasPermission(menuBtn);
      },
      handleNodeClick(data) {
        this.formLoading = true;
        this.addMenuBtnLoading = true;
        this.menuParentIdsDisbled = false;
        fetchMenuNode(data.id).then(response =>{
          this.menuForm = response.response;
          this.menuForm.parentIdList = this.menuForm.parentIds.split(',');
          this.menuParentIdsDisbled = true;
          this.roles[0].disabled = true;
          if (this.menuForm.parentId === 1){
            this.menuForm.parentId = '';
            this.disbled = true;
            this.menuForm.showRole = false;
          } else {
            this.disbled = false;
            this.menuForm.showRole = true;
          }
          this.formLoading = false;
        })
      },
      handleChange(value) {
        this.menuForm.parentId = value[(value.length - 1)]
        this.menuForm.parentIds = value.join(',')
        fetchMenuNode(this.menuForm.parentId).then(response => {
          this.menuForm.type = parseInt(response.response.type) + 1

        })
      },
      getRoles() {
        fetchRoleListForTransfer().then(response => {
          if(response.code === 0) {
            this.roles = response.response;
          }
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      onSubmit() {
        this.$refs['menuForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            fetchMenuSave(this.menuForm).then(response =>{
              if (response.code === 0) {
                this.getMenuTree()
                this.saveLoading = false
                this.$message.success('保存成功')
                this.resetForm()
              } else {
                this.$message.error('保存失败');
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm() {
        this.$refs['menuForm'].resetFields();
        this.disbled = false;
        this.menuParentIdsDisbled = false;
        this.menuForm.showRole = true;
        this.roles[0].disabled = true;
        this.menuForm.roleIds = [1];
      },
      deleteMenu() {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.treeLoading = true
          fetchMenuDelete(this.$refs.menus.getCheckedKeys()).then(response =>{
            this.getMenuTree()
            this.$message.success('删除成功')
          })
        })
      },
      addMenu() {
        this.$confirm('新增操作将清空右边表格中已填数据, 是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.resetForm()
        })
      }
    },
    watch: {
      filterText(val) {
        this.$refs.menus.filter(val);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
.menu-tree,.menu-form{
  transition: .2s;
  .filter-tree{
    margin-top: 20px;
  }
}
.el-transfer-panel__body {
  height: 250px;
}
</style>
