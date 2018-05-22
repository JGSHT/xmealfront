<template>
  <div style="margin: 1% 2%;">
    <el-row :gutter="20">
      <el-col :span="10" class="office-tree">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height:24px">
             <h3 style="line-height: 24px;display:inline;">商品分类信息</h3>
             <p style="float: right;margin:0px;">
               <el-button type="primary" size="small" round icon="el-icon-plus" @click="addGoodsCategory">新增</el-button>
               <el-button type="primary" size="small" round icon="el-icon-delete" @click="deleteGoodsCategory">删除</el-button>
             </p>
           </div>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree class="filter-tree"
            :data="goodsCategories"
            :props="treeProps"
            show-checkbox
            node-key="id"
            :default-expanded-keys="['1']"
            v-loading="treeLoading"
            ref="goodsCategories"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14" class="office-form">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height:24px">
             <h3 style="line-height: 24px;display:inline;">分类详情</h3>
           </div>
          <el-form :model="goodsCategoryForm" label-position="left" :rules="goodsCategoryFormRules" ref="goodsCategoryForm" v-loading="formLoading"  label-width="100px">
            <el-form-item label="分类ID" prop="id" v-show="false">
              <el-input v-model="goodsCategoryForm.id"></el-input>
            </el-form-item>
            <el-form-item label="上级分类" prop="parentIdList">
              <el-cascader
                :disabled="disbled"
                :options="goodsCategoryOptions"
                v-model="goodsCategoryForm.parentIdList"
                :props="cascaderProps"
                change-on-select
                @change="handleChange"
                style="width:100%">
              </el-cascader>
            </el-form-item>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="goodsCategoryForm.name" placeholder="输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="分类类型" prop="type" v-show="false">
              <el-input v-model="goodsCategoryForm.type" placeholder="输入分类类型"></el-input>
            </el-form-item>

            <el-form-item>
             <el-button type="primary" round @click="onSubmit" :loading="saveLoading">保存</el-button>
             <el-button @click="resetForm" round icon="el-icon-delete">重置</el-button>
           </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchGoodsCategoryTree,fetchGoodsCategoryNode,fetchGoodsCategorySave,fetchGoodsCategoryDelete } from 'api/goodsCategory';

  export default {
    computed: {

    },
    created() {
      this.getGoodsCategoryTree()
    },
    data() {
      return {
        filterText: '',
        goodsCategories: [],
        goodsCategoryOptions: [],
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
        goodsCategoryForm: {
          id: '',
          name: '',
          parentIdList: [],
          parentId: '',
          parentIds: '',
          type: ''
        },
        goodsCategoryFormRules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
          parentIdList: [
            { type: 'array', required: true, message: '请选择父级分类', trigger: 'blur' }
          ]
        },

        treeLoading: false,
        saveLoading: false,
        formLoading: false,
        disbled: false
      }
    },
    methods: {
      getGoodsCategoryTree() {
        this.treeLoading = true
        fetchGoodsCategoryTree().then(response => {
          this.goodsCategories = response.response
          console.log(JSON.stringify(this.goodsCategories))
          this.goodsCategories[0].disabled = true
          console.log('==================' + JSON.stringify(this.goodsCategories))
          this.treeLoading = false
        })
        fetchGoodsCategoryTree().then(response => {
          this.goodsCategoryOptions = response.response
          if (this.goodsCategoryOptions) {
            this.goodsCategoryOptions.forEach( goodsCategory => {
              if (goodsCategory.children) {
                goodsCategory.children.forEach( children1 => {
                  if (children1.children) {
                    children1.children.forEach( children2 => {
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
          fetchGoodsCategoryNode(data.id).then(response => {
            this.formLoading = false
            this.goodsCategoryForm = response.response
            this.goodsCategoryForm.parentIdList = this.goodsCategoryForm.parentIds.split(',')
            this.disbled = true
          })
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      onSubmit() {
        this.$refs['goodsCategoryForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            fetchGoodsCategorySave(this.goodsCategoryForm).then(response => {
              this.getGoodsCategoryTree()
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
        this.goodsCategoryForm.parentId = value[(value.length - 1)]
        this.goodsCategoryForm.parentIds = value.join(',')
        fetchGoodsCategoryNode(this.goodsCategoryForm.parentId).then(response => {
          this.goodsCategoryForm.type = parseInt(response.response.type) + 1
        })
      },
      resetForm() {
        this.$refs['goodsCategoryForm'].resetFields();
        this.disbled = false
      },
      addGoodsCategory() {
        this.$confirm('新增操作将清空右边表格中已填数据, 是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.resetForm()
        })
      },
      deleteGoodsCategory() {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.treeLoading = true
          fetchGoodsCategoryDelete(this.$refs.goodsCategories.getCheckedKeys()).then(response =>{
            if (response.code === 1){
              this.treeLoading = false
              return false
            }
            this.getGoodsCategoryTree()
            this.$message.success('删除成功')
          })
        })
      }
    },
    watch: {
      filterText(val) {
        this.$refs.goodsCategories.filter(val);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.office-tree,.office-form{
  transition: .2s;
  .filter-tree{
    margin-top: 20px;
  }
}
</style>
