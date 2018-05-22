<template>
  <div style="margin: 1% 2%;">
    <el-row :gutter="20">
      <el-col :span="10" class="office-tree">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height:24px">
            <h3 style="line-height: 24px;display:inline;">机构信息</h3>
            <p style="float: right;margin:0px;">
              <el-button type="primary" size="small" round icon="el-icon-plus" v-if="getMenuBtn('admin:office:add')" @click="addOffice">新增</el-button>
              <el-button type="primary" size="small" round icon="el-icon-delete" v-if="getMenuBtn('admin:office:delete')" @click="deleteOffice">删除</el-button>
            </p>
          </div>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree class="filter-tree"
                   :data="offices"
                   :props="treeProps"
                   show-checkbox
                   node-key="id"
                   :default-expanded-keys="['1']"
                   v-loading="treeLoading"
                   ref="offices"
                   :filter-node-method="filterNode"
                   @node-click="handleNodeClick">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14" class="office-form">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height:24px">
            <h3 style="line-height: 24px;display:inline;">机构详情</h3>
          </div>
          <el-form :model="officeForm" label-position="left" :rules="officeFormRules" ref="officeForm"
                   v-loading="formLoading" label-width="100px">
            <el-form-item label="机构ID" prop="id" v-show="false">
              <el-input v-model="officeForm.id"></el-input>
            </el-form-item>
            <el-form-item label="上级机构" prop="parentIdList">
              <el-cascader
                :disabled="disbled"
                :options="officeOptions"
                v-model="officeForm.parentIdList"
                :props="cascaderProps"
                change-on-select
                @change="handleChange"
                style="width:100%">
              </el-cascader>
            </el-form-item>
            <el-form-item label="机构名称" prop="name">
              <el-input v-model="officeForm.name" placeholder="输入机构名称"></el-input>
            </el-form-item>
            <el-form-item label="机构类型" prop="type" v-show="false">
              <el-input v-model="officeForm.type" placeholder="输入机构类型"></el-input>
            </el-form-item>
            <el-form-item label="省份" prop="provinceCode">
              <el-select
                v-model="officeForm.provinceCode"
                filterable
                clearable
                ref="province"
                placeholder="选择省份"
                @change="proviceChange"
                style="width:100%">
                <el-option v-for="provice in provinces" :key="provice.id" :label="provice.name"
                           :value="parseInt(provice.id)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="cityCode">
              <el-select
                v-model="officeForm.cityCode"
                filterable
                clearable
                ref="city"
                placeholder="选择城市"
                style="width:100%">
                <el-option v-for="city in citys" :key="city.id" :label="city.name"
                           :value="parseInt(city.id)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="officeForm.address" placeholder="输入地址"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="officeForm.remarks" placeholder="输入备注"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" v-if="getMenuBtn('admin:office:save')" round @click="onSubmit" :loading="saveLoading">保存</el-button>
              <el-button @click="resetForm" v-if="getMenuBtn('admin:office:clean')" round icon="el-icon-delete">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {fetchOfficeTree, fetchOfficeNode, fetchOfficeArae, fetchOfficeDelete} from 'api/office';
  import {fetchOfficeSave} from "../../api/office";
  import {isHasPermission} from "../../utils/btnPermission";

  export default {
    computed: {},
    created() {
      this.getOfficeTree()
      this.getMenuBtn()
      this.getProvince()
    },
    data() {
      return {
        filterText: '',
        offices: [],
        officeOptions: [],
        provinces: [],
        citys: [],
        treeProps: {
          children: 'children',
          label: 'name'
        },
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        officeForm: {
          id: '',
          name: '',
          parentIdList: [],
          parentId: '',
          parentIds: '',
          type: '',
          provinceCode: '',
          provinceName: '',
          cityCode: '',
          cityName: '',
          countryCode: '',
          countryName: '',
          address: '',
          remarks: ''
        },
        officeFormRules: {
          name: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'}
          ],
          parentIdList: [
            {type: 'array', required: true, message: '请选择父级机构', trigger: 'blur'}
          ]
        },

        treeLoading: false,
        saveLoading: false,
        formLoading: false,
        disbled: false
      }
    },
    methods: {
      getOfficeTree() {
        this.treeLoading = true
        fetchOfficeTree().then(response => {
          this.offices = response.response
          this.treeLoading = false
        })
        fetchOfficeTree().then(response => {
          this.officeOptions = response.response
          if (this.officeOptions) {
            this.officeOptions.forEach(office => {
              if (office.children) {
                office.children.forEach(children1 => {
                  if (children1.children) {
                    children1.children.forEach(children2 => {
                      if (children2.children) {
                        children2.children = null
                      }
                    })
                  }
                })
              }
            })
          }
          this.treeLoading = false
        })
      },
      handleNodeClick(data) {
        if (data.id != 1) {
          this.formLoading = true
          fetchOfficeNode(data.id).then(response => {
            this.formLoading = false
            this.officeForm = response.response
            this.officeForm.parentIdList = this.officeForm.parentIds.split(',')
            this.disbled = true;
          })
        }
      },
      getMenuBtn(menuBtn){
        return isHasPermission(menuBtn);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      onSubmit() {
        this.$refs['officeForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            if (this.officeForm.cityCode) {
              this.officeForm.cityName = this.citys.find((item) => {
                return item.id === this.officeForm.cityCode
              }).name
            }
            if (this.officeForm.provinceCode) {
              this.officeForm.provinceName = this.provinces.find((item) => {
                return item.id === this.officeForm.provinceCode
              }).name
            }
            fetchOfficeSave(this.officeForm).then(response => {
              this.getOfficeTree()
              this.saveLoading = false
              this.$message.success('保存成功')
              this.resetForm()
            })
          } else {
            return false
          }
        })

      },
      handleChange(value) {
        this.officeForm.parentId = value[(value.length - 1)]
        this.officeForm.parentIds = value.join(',')
        fetchOfficeNode(this.officeForm.parentId).then(response => {
          this.officeForm.type = parseInt(response.response.type) + 1,
            this.officeForm.countryCode = response.response.countryCode,
            this.officeForm.countryName = response.response.countryName,
            this.officeForm.cityCode = response.response.cityCode,
            this.officeForm.provinceCode = response.response.provinceCode
        })
      },
      getProvince() {
        fetchOfficeArae(100000).then(response => {
          this.provinces = response.response
        })
      },
      proviceChange(value) {
        this.officeForm.cityCode = ''
        if (value) {
          fetchOfficeArae(value).then(response => {
            this.citys = response.response
          })
        }
      },
      resetForm() {
        this.$refs['officeForm'].resetFields();
        this.disbled = false
      },
      addOffice() {
        this.$confirm('新增操作将清空右边表格中已填数据, 是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.resetForm()
        })
      },
      deleteOffice() {
        this.$confirm('此操作将永久删除该机构, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.treeLoading = true
          fetchOfficeDelete(this.$refs.offices.getCheckedKeys()).then(response => {
            this.getOfficeTree()
            this.$message.success('删除成功')
          })
        })
      }
    },
    watch: {
      filterText(val) {
        this.$refs.offices.filter(val);
      },
      'officeForm.provinceCode': function (v, ov) {
        if (v) {
          this.proviceChange(v);
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .office-tree, .office-form {
    transition: .2s;
    .filter-tree {
      margin-top: 20px;
    }
  }
</style>
