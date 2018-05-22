<template>
  <div style="margin: 0% 2%;">
    <el-tabs v-model="activeName">
      <el-tab-pane name="templateList">
        <span slot="label"><i class="el-icon-document"></i> 模版列表</span>
        <el-row :gutter="20">
          <el-form :inline="true" :model="templateSearch" class="demo-form-inline">
            <el-col :span="5">
            <el-form-item label="模版名称">
              <el-input v-model="templateSearch.templateName" placeholder="模版名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item>
              <el-button type="primary" icon="search" @click="search">查询</el-button>
              <el-button icon="plus" @click="addTemplate">新增</el-button>
            </el-form-item>
            </el-col>
          </el-form>
        </el-row>
          <el-table
           v-loading="templateListLoading"
           :data="templates"
           stripe
           border
           style="width: 100%;">
           <!-- <el-table-column prop="id" label="模版ID" ></el-table-column> -->
           <el-table-column prop="templateName" label="模版名称"  align="center"></el-table-column>
           <el-table-column prop="companyName" label="所属机构"  align="center"></el-table-column>
           <el-table-column prop="createdDate" label="创建日期"  align="center"></el-table-column>
           <el-table-column label="操作" width="300px" align="center" >
             <template slot-scope="scope">
               <el-button
                 size="small"
                 @click="templateEdit(scope.$index, scope.row)">编辑</el-button>
               <el-button
                 size="small"
                 type="danger"
                 @click="templateDelete(scope.$index, scope.row)">删除</el-button>
               <el-button
                 size="small"
                 type="info"
                 @click="toTemplateProduct(scope.$index, scope.row)">模板包含商品</el-button>
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
            <div style="height:200px;">
              <el-form :model="template" label-position="left" ref="template" class="product-form"
              :rules="templateFormRules" v-loading="formLoading" label-width="100px" style="margin: 0 3%">
                <el-form-item label="模版ID" v-show="false" prop="id">
                  <el-input v-model="template.id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="模版名称" prop="templateName">
                  <el-input v-model="template.templateName" placeholder="模版名称"></el-input>
                </el-form-item>
                <el-form-item label="大区" prop="companyId">
                  <el-select v-model="template.companyId" filterable clearable placeholder="选择大区">
                    <el-option v-for="office in offices" :key="office.id" :label="office.name" :value="parseInt(office.id)"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="save" :loading="saveLoading">确定</el-button>
              <el-button @click="dialogShow = false">取消</el-button>
            </div>
          </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="templateProduct" @tab-click="clickTemplateProduct">
        <span slot="label"><i class="el-icon-date"></i> 模板包含商品</span>
        <el-card class="box-card" style="margin-top:10px">
          <div slot="header" class="clearfix" style="height: 18px;">
            <span style="line-height: 18px;">模板包含商品</span>
            <el-button type="info" size="small" @click="getProducts">添加</el-button>
            <el-button type="info" size="small" @click="offProduct">移除</el-button>
          </div>
          <el-input v-model="templateProductCardSelect" placeholder="输入商品名称筛选"
                    style="margin-bottom:10px;width:15%" v-on:change="templateProductCardSelectChange"></el-input>
          <el-table
           v-loading="templateProductsLoading"
           @selection-change="handleTemplateProductSelectionChange"
           :data="templateProductsResult"
           stripe
           border
           height="600"
           style="width: 100%;">
           <el-table-column type="selection" prop="templateId" width="55"></el-table-column>
           <el-table-column prop="productId" label="商品ID"  align="center"></el-table-column>
           <el-table-column prop="productName" label="商品名称"  align="center"></el-table-column>
            <el-table-column prop="tasteName" label="商品口味"  align="center"></el-table-column>
           <!--<el-table-column prop="salePrice" label="商品售价"  align="center"></el-table-column>-->
           <el-table-column prop="purchasePrice" label="商品进价" align="center"></el-table-column>
            <el-table-column prop="salePrice" label="商品售价"  align="center">
             <!-- <template slot-scope="scope">
                <el-input style="width: 100px;" type="number" pattern="[0-9]*"
                          v-model.number="scope.row.newSalePrice" v-show="scope.row.salePriceEdit"></el-input>
                <span v-show="!scope.row.salePriceEdit">{{ scope.row.salePrice }}</span>
                <el-button v-show='!scope.row.salePriceEdit' type="text" @click='editSalePrice(scope.row)' size="mini">修改</el-button>
                <el-button v-show='scope.row.salePriceEdit' type="text" @click='saveSalePrice(scope.row)' size="mini">提交</el-button>
              </template>-->
            </el-table-column>
           <el-table-column prop="number" label="数量"  align="center">
             <template slot-scope="scope">
               <el-input style="width: 100px;" type="number" pattern="[0-9]*"
                         v-model.number="scope.row.newNumber" v-show="scope.row.edit" ></el-input>
               <span v-show="!scope.row.edit">{{ scope.row.number }}</span>
               <el-button v-show='!scope.row.edit' type="text" @click='editNumber(scope.row)' size="mini">修改</el-button>
               <el-button v-show='scope.row.edit' type="text" @click='saveNumber(scope.row)' size="mini">提交</el-button>
             </template>
           </el-table-column>
         </el-table>
          <p class="block" style="float:right">
            <el-pagination
              layout="total"
              :total="templateProductsTotal">
            </el-pagination>
          </p>
        </el-card>
        <el-dialog title="商品列表" :visible.sync="productDialogShow">
          <div style="height:450px;">
            <el-input v-model="productDialogSelect" placeholder="输入商品名称筛选"
                      style="margin-bottom:10px;width:33.3%" v-on:change="productDialogSelectChange"></el-input>
            <el-table
            v-loading="productDialogLoading"
             @selection-change="handleProductsSelectionChange"
             :data="productsResult"
             stripe
             border
             height="420"
             style="width: 100%;">
             <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="productId" label="商品ID"  align="center"></el-table-column>
              <el-table-column prop="productName" label="商品名称" align="center" ></el-table-column>
              <el-table-column prop="tasteName" label="商品口味" align="center" ></el-table-column>
              <el-table-column prop="salePrice" label="商品售价" align="center" ></el-table-column>
              <el-table-column prop="purchasePrice" label="商品进价" align="center" ></el-table-column>
           </el-table>
          </div>
          <p class="block" style="float:left">
            <el-pagination
              layout="total"
              :total="productTotal">
            </el-pagination>
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addProduct" :loading="saveLoading">确定</el-button>
            <el-button @click="productDialogShow = false">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchTemplateList,fetchTemplateSave,fetchgetTemplate,fetchTemplateDelete,fetchTemplateProduct,updateNumber,updateSalePrice,offProduct,addProduct } from 'api/template';
  import { fetchOfficeTree } from 'api/office';
  import { fetchProductList } from 'api/template'
  import detail from './detail'
  import { getToken } from 'utils/auth';

  export default {
    created() {
      this.search()
      this.getOffice()
    },
    components: {
      detail
    },
    data() {
      return {
        activeName:'templateList',

        templateSearch: {
          templateName: ''
        },
        offices: [],

        templates: [],
        showImgUrl: '',
        templateListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        uploadDialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        templateProductsLoading: false,
        filterText: '',
        template: {
          id: '',
          templateName: '',
          companyId: '',
          companyName: '',
          createdDate: ''
        },
        templateFormRules: {
          templateName: [
            { required: true, message: '请输入模版名称', trigger: 'blur' }
          ],
          companyId: [
            { type: 'number', required: true, message: '请选择大区', trigger: 'change' }
          ]
        },

        templateProduct: {

        },
        templateProducts: [],
        templateProductsResult: [],
        templateProductCardSelect: '',
        templateProductsTotal: 0,
        productDialogSelect: '',
        productsResult: [],
        productTotal: 0,
        templateProductsSelection: [],
        productsSelection: [],
        products: [],
        productDialogShow: false,
        productDialogLoading: false
      }
    },
    methods: {
      getOffice() {
        fetchOfficeTree().then(response =>{
          this.offices = response.response[0].children
        })
      },
      search() {
        this.templateListLoading = true
        fetchTemplateList(this.templateSearch, this.page, this.size).then(response =>{
          this.templateListLoading = false
          this.templates = response.response
          this.total = response.total
        })
      },
      templateEdit(index, row) {
        this.dialogTitle = '修改模板信息'
        this.dialogShow = true
        this.formLoading = true
        fetchgetTemplate(row.id).then(response =>{
          this.formLoading = false
          this.template = response.response
        })
      },
      templateDelete(index, row) {
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.templateListLoading = true
          fetchTemplateDelete(row.id).then(response =>{
            this.search()
            this.$message.success('删除成功')
          })
        })

      },
      addTemplate() {
        this.template.companyId = ''
        this.dialogTitle = '新增模版'
        this.dialogShow = true
        this.resetForm()
      },
      save() {
        this.$refs['template'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            if (this.template.companyId) {
              this.template.companyName = this.offices.find((item) => {
                 return parseInt(item.id) === this.template.companyId
              }).name
            }
            fetchTemplateSave(this.template).then(response =>{
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
      editNumber(templateProduct) {
        templateProduct.edit = true
        templateProduct.newNumber = templateProduct.number
      },
      saveNumber(templateProduct) {
        if(templateProduct.newNumber < 0 ){
          this.$message({
            message: '请规范输入数量',
            type: 'error',
            duration: 2000
          });
          return
        }
        updateNumber({'templateId':templateProduct.templateId,'number':templateProduct.newNumber,'productId':templateProduct.productId,'tasteId':templateProduct.tasteId}).then(response => {
          if (response.code === 0) {
            templateProduct.number = templateProduct.newNumber
            templateProduct.edit = false
            this.open('修改数量成功');
          }
        })
      },
      editSalePrice(templateProduct) {
        templateProduct.salePriceEdit = true
        templateProduct.newSalePrice = templateProduct.salePrice
      },
      saveSalePrice(templateProduct) {
        if(templateProduct.newSalePrice < 0 ){
          this.$message({
            message: '请规范输入商品售价',
            type: 'error',
            duration: 2000
          });
          return
        }
        updateSalePrice({'id':templateProduct.templateId,'salePrice':templateProduct.newSalePrice,'productId':templateProduct.productId}).then(response => {
          if (response.code === 0) {
            templateProduct.salePrice = templateProduct.newSalePrice
            templateProduct.salePriceEdit = false
            this.open('已将此商品售价个性化');
          }
        })
      },
      templateProductCardSelectChange(){
        this.templateProductsResult = [];
        this.templateProducts.forEach(item => {
          if (!this.templateProductCardSelect) {
            this.templateProductsResult.push(item)
          } else {
            if (item.productName.indexOf(this.templateProductCardSelect) !== -1) {
              this.templateProductsResult.push(item)
            }
          }
        })
        this.templateProductsTotal = this.templateProductsResult.length
      },
      productDialogSelectChange() {
        console.log("#################" + this.productDialogSelect)
        this.productsResult = [];
        this.products.forEach(item => {
          if (!this.productDialogSelect) {
            this.productsResult.push(item)
          } else {
            if (item.productName.indexOf(this.productDialogSelect) !== -1) {
              this.productsResult.push(item)
            }
          }
        })
        this.productTotal = this.productsResult.length
      },
      resetForm() {
        if (this.$refs['template']) {
          this.$refs['template'].resetFields();
        }
        this.saveLoading = false
      },
      handleSizeChange(val) {
        this.size = val
        this.search()
      },
      handleCurrentChange(val) {
        this.page = val
        this.search()
      },
      clickTemplateProduct() {
        console.log(!templateProduct.id);
        if (!templateProduct.id){
          activeName = 'templateList'
          this.$notify({
            title: '警告',
            message: '请选择模版后再查看模版包含商品信息',
            type: 'warning'
          });
        }
      },
      toTemplateProduct(index, row) {
        this.activeName = 'templateProduct'
        this.templateProduct = row
        this.getTemplateProducts()
      },
      getTemplateProducts() {
        this.templateProductCardSelect = ''
        this.templateProductsLoading = true
        fetchTemplateProduct(this.templateProduct.id).then(response => {
          this.templateProductsLoading = false
          this.templateProducts = response.response
          this.templateProductsResult = response.response
          this.templateProductsTotal = this.templateProductsResult.length
        })
      },
      handleTemplateProductSelectionChange(val) {
        this.templateProductsSelection = val
      },
      handleProductsSelectionChange(val) {
        this.productsSelection = val
      },
      offProduct() {
        let templateProducts = []
        this.templateProductsSelection.forEach(item => {
          let templateProduct = new Object()
          templateProduct.productId = item.productId
          templateProduct.tasteId = item.tasteId
          templateProduct.templateId = this.templateProduct.id
          templateProducts.push(templateProduct)
        })
        if (templateProducts.length > 0) {
          offProduct(templateProducts).then(response =>{
            this.$message.success('移除成功')
            this.templateProductsSelection = []
            this.getTemplateProducts()
          })
        } else {
          this.$message.error('请至少选择一条后再进行移除操作')
        }
      },
      addProduct() {
        let products = []
        this.productsSelection.forEach(item => {
          let product = new Object()
          product.productId = item.productId
          product.tasteId = item.tasteId
          product.putawayNumber = item.putawayNumber
          product.templateId = this.templateProduct.id
          products.push(product)
        })
        if (products.length > 0) {
          this.saveLoading = true
          addProduct(products).then(response =>{
            this.saveLoading = false
            this.$message.success('添加成功')
            this.productDialogShow = false
            this.productsSelection = []
            this.getTemplateProducts()
          })
        } else {
          this.$message.error('请至少选择一条后再进行添加操作')
        }
      },
      getProducts() {
        this.productDialogSelect = ''
        this.productDialogShow = true
        this.productDialogLoading = true
        /*fetchProductList({'td':this.templateProduct.id}, 1, 10000).then(response =>{
          this.productDialogLoading = false
          this.products = response.response
          this.productsResult = response.response
          this.productTotal = this.productsResult.length
        })*/
        fetchProductList(this.templateProduct.id, this.templateProduct.companyId).then(response =>{
          this.productDialogLoading = false
          this.products = response.response
          this.productsResult = response.response
          this.productTotal = this.productsResult.length
        })
      },
      open(theMessage) {
        this.$message({
          message: theMessage,
          duration: 2000,
          type: 'success'
        });
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
