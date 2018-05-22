<template>
  <div style="margin: 0% 2%;">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="productList">
        <span slot="label"><i class="el-icon-document"></i> 商品列表</span>
        <el-row :gutter="20">
          <el-form :inline="true" :model="productSearch" class="demo-form-inline">
            <el-col :span="5">
              <el-form-item label="商品名称">
                <el-input v-model="productSearch.productName" placeholder="商品名称"></el-input>
              </el-form-item>
            </el-col>
          <!--<el-col :span="5">
            <el-form-item label="商品条形码">
              <el-input v-model="productSearch.barCode" placeholder="商品条形码"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="7">
            <el-form-item label="商品展示类别">
              <el-select v-model="productSearch.categoryId" filterable clearable placeholder="商品展示类别">
                <el-option v-for="category in categorys" :key="category.id" :label="category.categoryName"
                           :value="parseInt(category.id)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button type="primary" icon="search" @click="search">查询</el-button>
              <el-button icon="plus" @click="addProduct">新增</el-button>
              <el-button @click="getRecordProductExcel" style="margin-right: 0" :loading="exportLoading">导出</el-button>
            </el-form-item>
          </el-col>
          </el-form>
        </el-row>
        <el-table
          v-loading="productListLoading"
          :data="products"
          border
          stripe
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <detail :product="props.row"></detail>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="saleType" label="销售类型" align="center" :formatter="formatterSaleType"></el-table-column>
          <el-table-column prop="images" label="商品主图" align="center">
            <template slot-scope="scope">
              <el-popover
                ref="productImg"
                placement="right"
                trigger="hover">
                <img :src="scope.row.images" style="width:120px;height:120px;"/>
              </el-popover>
              <el-button v-popover:productImg type="text" v-if="scope.row.images">查看</el-button>
              <el-button type="text" v-text="scope.row.images ? '修改':'上传'" @click="uploadImg(scope.row.id)"></el-button>
            </template>
          </el-table-column>
          <!--<el-table-column prop="status" label="智能补货" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=1
                :inactive-value=2
                active-text="开"
                inactive-text="关"
                @change="switchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" width="400px" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="productEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="productDelete(scope.$index, scope.row)">删除
              </el-button>
              <el-button
                size="small"
                type="success"
                @click="preCreateQrcod(scope.$index, scope.row)">创建二维码
              </el-button>
              <!--<el-button
                size="small"
                type="info"
                @click="toProductDetail(scope.$index, scope.row)">更多商品信息
              </el-button>-->
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
        <a id="getExcel" style="display: none"></a>
        <el-dialog :title="qrcodTitle" :visible.sync="qrcodDialogShow" size="tiny" v-on:close="qrcodClose">
          <el-form :model="qrcod" label-position="right" v-loading="qrcodFormLoading" ref="qrcodForm"
                   :rules="qrcodFormRules"
                   style="margin: 0 3%">
            <el-form-item prop="tasteIds" align="center">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="qrcod.tasteIds" @change="handleCheckedTasteChange">
                <el-checkbox v-for="taste in productTastes1" :label="taste.tasteId" :key="taste.tasteId">{{taste.tasteName}}</el-checkbox>
              </el-checkbox-group>
              <!--<div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="getMachines">确定</el-button>
              </div>-->
            </el-form-item>
            <el-form-item prop="expirationDate" align="center">
              <div class="block">
                <span class="demonstration">保质期</span>
                <el-date-picker
                  v-model="qrcod.expirationDate"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions0">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createQrcod" :loading="qrcodLoading">确定</el-button>
            <el-button @click="qrcodClose">取消</el-button>
          </div>
        </el-dialog>
        <a :download="qrcod.productName" id="qrcod" style="display: none"/>
        <el-dialog title="图片上传" :visible.sync="uploadDialogShow">
          <el-upload
            class="upload-img"
            ref="uploadImg"
            :action="uploadImgUrl"
            :headers="uploadImgHeaders"
            :data="uploadImgData"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <p>
            <el-button size="small" type="primary" @click="closeUploadDialog">确定</el-button>
          </p>
        </el-dialog>
      </el-tab-pane>
      <!--<el-tab-pane name="productDetail">
        <span slot="label"><i class="el-icon-date"></i> 商品信息</span>
        <el-card class="box-card">
          <detail :product="productDetail"></detail>
        </el-card>
        <el-card class="box-card" style="margin-top:10px">
          <div slot="header" class="clearfix" style="height: 18px;">
            <span style="line-height: 18px;">商品在售设备</span>
            <el-button type="info" size="small" @click="getMachines">上架</el-button>
            <el-button type="info" size="small" @click="offProduct">下架</el-button>
          </div>
          &lt;!&ndash;<el-input v-model="productMachineCardSelect" placeholder="输入设备名称筛选"
                    style="margin-bottom:10px;width:15%" v-on:change="productMachineCardSelectChange"></el-input>&ndash;&gt;
          <el-row  :gutter="20">
          <el-form :inline="true" :model="productMachineSearch" class="demo-form-inline">
            <el-col :span="5">
            <el-form-item label="机构">
              <el-cascader
                :options="offices"
                v-model="productMachineSearch.officeIdList"
                :props="cascaderProps"
                change-on-select
                clearable
                @change="handleChange"
                style="width:240px">
              </el-cascader>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item label="设备名称">
              <el-input v-model="productMachineSearch.machineName" placeholder="设备名称"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item>
              <el-button type="primary" icon="getProductMachineList" @click="getProductMachines">查询</el-button>
            </el-form-item>
            </el-col>
          </el-form>
          </el-row>
          <el-table
            v-loading="productMachinesLoading"
            @selection-change="handleProductMachinesSelectionChange"
            :data="productMachines"
            stripe
            border
            height="600"
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="machineId" label="设备ID"></el-table-column>
            <el-table-column prop="machineName" label="设备名称"></el-table-column>
            <el-table-column prop="salePrice" label="商品售价" aligin="center">
              <template slot-scope="scope">
                <el-input style="width: 100px;" type="number" pattern="[0-9]*"
                          v-model.number="scope.row.newSalePrice" v-show="scope.row.salePriceEdit"></el-input>
                <span v-show="!scope.row.salePriceEdit">{{ scope.row.salePrice }}</span>
                <el-button v-show='!scope.row.salePriceEdit' type="text" @click='editSalePrice(scope.row)' size="mini">
                  修改
                </el-button>
                <el-button v-show='scope.row.salePriceEdit' type="text" @click='saveSalePrice(scope.row)' size="mini">
                  提交
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价"></el-table-column>
            <el-table-column prop="stock" label="库存"></el-table-column>
          </el-table>
          <p class="block" style="float:right">
            <el-pagination
              @size-change="pmHandleSizeChange"
              @current-change="pmHandleCurrentChange"
              :current-page="pmpage"
              :page-sizes="pmsizes"
              :page-size="pmsize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="productMachinesTotal">
              &lt;!&ndash; layout="total"
               :total="productMachinesTotal">&ndash;&gt;
            </el-pagination>
          </p>
        </el-card>
        <el-dialog title="设备列表" :visible.sync="machineDialogShow">
          &lt;!&ndash;<el-input v-model="machineDialogSelect" placeholder="输入设备名称筛选"
                    style="margin-bottom:10px;width:33.3%" v-on:change="machineDialogSelectChange"></el-input>&ndash;&gt;
          <el-form :inline="true" :model="machineSearch" class="demo-form-inline">
            <el-form-item label="机构">
              <el-cascader
                :options="offices"
                v-model="machineSearch.officeIdList"
                :props="cascaderProps"
                change-on-select
                clearable
                @change="mHandleChange"
                style="width:240px">
              </el-cascader>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input v-model="machineSearch.machineName" placeholder="设备名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="getMachineList" @click="getMachines">查询</el-button>
            </el-form-item>
          </el-form>
          <div style="height:450px;">
            <el-table
              v-loading="machineDialogLoading"
              @selection-change="handleMachinesSelectionChange"
              :data="machines"
              stripe
              border
              height="450"
              style="width: 100%;">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="设备ID"></el-table-column>
              <el-table-column prop="machineName" label="设备名称"></el-table-column>
            </el-table>
          </div>
          <p class="block" style="float:left">
            <el-pagination
              @size-change="mHandleSizeChange"
              @current-change="mHandleCurrentChange"
              :current-page="mpage"
              :page-sizes="msizes"
              :page-size="msize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="machineTotal">
              &lt;!&ndash;layout="total"
              :total="machineTotal">&ndash;&gt;
            </el-pagination>
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addMachine" :loading="saveLoading">确定</el-button>
            <el-button @click="machineDialogShow = false">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>-->
      <el-tab-pane name="product">
        <span slot="label"><i class="el-icon-date"></i> 商品信息</span>
        <product :product=product :activeName=activeName v-on:childMethod="saveSuccess"></product>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    fetchProductList,
    fetchProductSave,
    fetchProductNode,
    fetchProductDelete,
    fetchProductMachines,
    offProduct,
    addMachine,
    fetchRecordProduct,
    fetchCreateQrcod,
    fetchUpdateStatus
  } from 'api/product';
  import {fetchCategoryList} from 'api/category';
  import {fetchMachineList, updateSalePrice} from 'api/machine'
  import detail from './detail'
  import product from './product'
  import {getToken} from 'utils/auth';
  import {fetchOfficeTree} from 'api/office';
  import {fetchBrandLabelList} from 'api/brandLabel'
  import {fetchGoodsCategory} from 'utils/goodsCategory';
  import {fetchGoodsCategoryTree} from 'api/goodsCategory'
  import {fetchGetProductTaste} from 'api/areaProduct'

  export default {
    created() {
      this.search()
      this.getOffices()
      this.getCategory()
    },
    components: {
      detail,
      product
    },
    data() {
      return {
        productTastes1: [],
        checkAll: false,
        isIndeterminate: false,
        goodsCategories: [],
        goodsCategoryDisbled: false,
        offices: [],
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        activeName: 'productList',

        productSearch: {
          productName: '',
          categoryId: '',
          barCode: ''
        },
        categorys: [],
        brandLabels: [],
        products: [],
        showImgUrl: '',
        productListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        product: {
          id: '',
          productName: '',
          categoryId: '',
          categoryName: '',
          spec: '',
          unit: '',
          shelfLife: '',
          productSource: '',
          description: '',
          note: '',
          barCode: '1111111111111',
          weight: '',
          labelIds: '',
          labelIdSelected: [],
          labelName: '',
          saleType: '',
          goodsCategoryIdList: [],
          bigCategoryId: '',
          bigCategoryName: '',
          middleCategoryId: '',
          middleCategoryName: '',
          littleCategoryId: '',
          littleCategoryName: '',
          productTastes: [{
            tasteId: '',
            weight: 0.0,
            barCode: '',
            imageUrl: ''
          }],
          productTastesStr: '',
          goodsCategorys: '',
          imageList: [],
          image: [],
        },

        dialogTitle: '新增',
        dialogShow: false,
        uploadDialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        productMachinesLoading: false,
        qrcodFormRules: {
          expirationDate: [
            {type: 'date', required: true, message: '请选择保质期', trigger: 'change'}
          ]
        },
        productDetail: {},
        qrcod: {
          productId: '',
          productName: '',
          expirationDate: '',
          tasteIds: []
        },
        qrcodUrl: [],
        qrcodDialogShow: false,
        qrcodLoading: false,
        qrcodFormLoading: false,
        qrcodTitle: '创建二维码',
        /*productMachineCardSelect: '',
        productMachinesResult: [],*/
        pmpage: 1,
        pmsize: 10,
        productMachinesTotal: 0,
        pmsizes: [10, 20, 50, 100, 300, 500],
        productMachines: [],
        productMachinesSelection: [],
        machinesSelection: [],
        machineDialogSelect: '',
        machines: [],
        /*machinesResult: [],*/
        mpage: 1,
        msize: 10,
        machineTotal: 0,
        msizes: [10, 20, 50, 100],
        machineDialogShow: false,
        machineDialogLoading: false,
        uploadImgUrl: process.env.BASE_API + '/api/private/product/image',
        uploadImgHeaders: {
          'X-AUTH-TOKEN': getToken()
        },
        uploadImgData: {
          id: ''
        },
        productMachineSearch: {
          id: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: [],
          machineName: ''
        },
        machineSearch: {
          id: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: [],
          machineName: ''
        },
        exportLoading: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        productTastes: [],
        inputVisible: false,
        productTaste: ''
      }
    },
    methods: {
      handleCheckAllChange(val) {
        if (val) {
          this.qrcod.tasteIds  = []
          this.productTastes1.forEach(item => {
            this.qrcod.tasteIds.push(item.tasteId)
          })
          console.log(JSON.stringify(this.qrcod.tasteIds))
        } else {
          this.qrcod.tasteIds = []
        }
        this.isIndeterminate = false;
      },
      handleCheckedTasteChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.productTastes1.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.productTastes1.length;
        console.log(JSON.stringify(this.qrcod.tasteIds))
      },
      tabClick(val) {
        if (val.name == 'product') {
          this.resetForm()
        }
        if (val.name == 'productList') {
          this.search()
        }
      },
      formatterSaleType(row, column, cellValue) {
        if (cellValue) {
          if (cellValue === 1) {
            return '自助机销售';
          } else if (cellValue === 2) {
            return '商城销售';
          } else if (cellValue === 3) {
            return '全部';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },
      getOffices() {
        fetchOfficeTree().then(response => {
          if (response.response) {
            this.offices = response.response[0].children
          }
        })
      },
      handleChange(value) {
        if (value[0]) {
          this.productMachineSearch.companyId = value[0]
        } else {
          this.productMachineSearch.companyId = ''
        }
        if (value[1]) {
          this.productMachineSearch.regionId = value[1]
        } else {
          this.productMachineSearch.regionId = ''
        }
        if (value[2]) {
          this.productMachineSearch.officeId = value[2]
        } else {
          this.productMachineSearch.officeId = ''
        }
      },
      mHandleChange(value) {
        if (value[0]) {
          this.machineSearch.companyId = value[0]
        } else {
          this.machineSearch.companyId = ''
        }
        if (value[1]) {
          this.machineSearch.regionId = value[1]
        } else {
          this.machineSearch.regionId = ''
        }
        if (value[2]) {
          this.machineSearch.officeId = value[2]
        } else {
          this.machineSearch.officeId = ''
        }
      },
      search() {
        this.productListLoading = true
        this.products = []
        fetchProductList(this.productSearch, this.page, this.size).then(response => {
          this.productListLoading = false
          this.products = response.response
          this.total = response.total
        })
      },
      productEdit(index, row) {
        fetchProductNode(row.id).then(response => {
          this.product = response.response;
          this.product.labelIdSelected = [];
          if (response.response.labelIds) {
            const data = response.response.labelIds.split(',');
            for (let i = 0; i < data.length; i++) {
              this.product.labelIdSelected.push(parseInt(data[i]))
            }
          }
          this.product.goodsCategoryIdList = []
          if (response.response.bigCategoryId) {
            this.product.goodsCategoryIdList.push(response.response.bigCategoryId.toString())
          }
          if (response.response.middleCategoryId) {
            this.product.goodsCategoryIdList.push(response.response.middleCategoryId.toString())
          }
          if (response.response.bigCategoryId) {
            this.product.goodsCategoryIdList.push(response.response.littleCategoryId.toString())
          }
          this.product.image = []
          this.product.imageList.forEach(item => {
            console.log(item)
            let image = {
              url : item.toString()
            }
            this.product.image.push(image)
          })
          this.activeName = 'product'
        })
      },
      productDelete(index, row) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.productListLoading = true
          fetchProductDelete(row.id).then(response => {
            if (response.code === 0) {
              this.search()
              this.$message.success('删除成功')
            } else {
              this.productListLoading = false
            }
          })
        })
      },
      addProduct() {
        this.resetForm()
        this.activeName = 'product'
      },
      preCreateQrcod(index, row) {
        this.qrcod.productId = row.id
        this.qrcod.productName = row.productName
        fetchGetProductTaste(row.id).then(response => {
          if (response.response.length > 0) {
            this.productTastes1 = response.response
            console.log(JSON.stringify(this.productTastes1))
          }
        })
        this.productTastes1 = []
        this.checkAll = false
        this.qrcodDialogShow = true
      },
      saveSuccess() {
        this.resetForm()
        this.search()
        this.activeName = 'productList'
      },
      resetForm() {
        this.product = {
          id: '',
          productName: '',
          categoryId: '',
          categoryName: '',
          spec: '',
          unit: '',
          shelfLife: '',
          productSource: '',
          description: '',
          note: '',
          barCode: '1111111111111',
          weight: '',
          labelIds: '',
          labelIdSelected: [],
          labelName: '',
          saleType: '',
          goodsCategoryIdList: [],
          bigCategoryId: '',
          bigCategoryName: '',
          middleCategoryId: '',
          middleCategoryName: '',
          littleCategoryId: '',
          littleCategoryName: '',
          productTastes: [{
            tasteId: '',
            weight: '',
            barCode: '',
            imageUrl: ''
          }],
          productTastesStr: '',
          goodsCategorys: '',
          imageList: [],
          image: []
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
      pmHandleSizeChange(val) {
        this.pmsize = val
        this.getProductMachines()
      },
      pmHandleCurrentChange(val) {
        this.pmpage = val
        this.getProductMachines()
      },
      mHandleSizeChange(val) {
        this.msize = val
        this.getMachines()
      },
      mHandleCurrentChange(val) {
        this.mpage = val
        this.getMachines()
      },
      toProductDetail(index, row) {
        this.activeName = 'productDetail'
        this.productDetail = row
        this.getProductMachines()
      },
      getProductMachines() {
        this.productMachinesLoading = true
        this.productMachineSearch.id = this.productDetail.id
        fetchProductMachines(this.productMachineSearch, this.pmpage, this.pmsize).then(response => {
          this.productMachinesLoading = false
          this.productMachines = response.response
          /*this.productMachinesResult = response.response*/
          this.productMachinesTotal = response.total
        })
      },
      handleProductMachinesSelectionChange(val) {
        this.productMachinesSelection = val
      },
      handleMachinesSelectionChange(val) {
        this.machinesSelection = val
      },
      getCategory() {
        fetchCategoryList({}, 1, 100000).then(response => {
          this.categorys = response.response
        })
      },
      offProduct() {
        let machineIds = []
        this.productMachinesSelection.forEach(item => {
          machineIds.push(item.machineId)
        })
        if (machineIds.length > 0) {
          offProduct(this.productDetail.id, machineIds.join(',')).then(response => {
            this.$message.success('下架成功')
            this.productMachinesSelection = []
            this.getProductMachines()
          })
        } else {
          this.$message.error('请至少选择一条后再进行下架操作')
        }
      },
      addMachine() {
        let machineIds = []
        this.machinesSelection.forEach(item => {
          machineIds.push(item.id)
        })
        if (machineIds.length > 0) {
          this.saveLoading = true
          addMachine(this.productDetail.id, machineIds.join(',')).then(response => {
            this.saveLoading = false
            this.$message.success('上架成功')
            this.machineDialogShow = false
            this.machinesSelection = []
            this.getProductMachines()
          })
        } else {
          this.$message.error('请至少选择一条后再进行下架操作')
        }
      },
      getMachines() {
        this.machineDialogSelect = ''
        this.machineDialogShow = true
        this.machineDialogLoading = true
        this.machineSearch.id = this.productDetail.id
        fetchMachineList(this.machineSearch, this.mpage, this.msize).then(response => {
          this.machineDialogLoading = false
          this.machines = response.response
          /*this.machinesResult = response.response*/
          this.machineTotal = response.total
        })
      },
      machineDialogSelectChange() {
        this.machinesResult = [];
        this.machines.forEach(item => {
          if (!this.machineDialogSelect) {
            this.machinesResult.push(item)
          } else {
            if (item.machineName.indexOf(this.machineDialogSelect) !== -1) {
              this.machinesResult.push(item)
            }
          }
        })
        this.machineTotal = this.machinesResult.length
      },
      uploadImg(productId) {
        this.uploadImgData.id = productId
        this.uploadDialogShow = true
        if (this.$refs.uploadImg) {
          this.$refs.uploadImg.clearFiles()
        }
      },
      handleSuccess(response, file, fileList) {
        if (response.code === 0) {
          this.$message.success('上传成功')
          if (fileList.length > 1) {
            fileList.shift()
          }
        } else {
          this.$refs.uploadImg.clearFiles()
          this.$message.error(response.desc)
        }
      },
      editSalePrice(machineProduct) {
        machineProduct.salePriceEdit = true
        machineProduct.newSalePrice = machineProduct.salePrice
      },
      saveSalePrice(machineProduct) {
        if (machineProduct.newSalePrice < 0) {
          this.$message({
            message: '请规范输入商品售价',
            type: 'error',
            duration: 2000
          });
          return
        }
        updateSalePrice({
          'id': machineProduct.machineId,
          'salePrice': machineProduct.newSalePrice,
          'productId': machineProduct.productId
        }).then(response => {
          if (response.code === 0) {
            machineProduct.salePrice = machineProduct.newSalePrice
            machineProduct.salePriceEdit = false
            this.open('已将此商品售价个性化');
          }
        })
      },
      open(theMessage) {
        this.$message({
          message: theMessage,
          duration: 2000,
          type: 'success'
        });
      },
      getRecordProductExcel() {
        if (this.products == '') {
          this.$message({
            showClose: true,
            message: '没有可导出的数据',
            duration: 3000,
            type: 'warning'
          });
        } else {
          this.exportLoading = true
          fetchRecordProduct(this.productSearch).then(response => {
            console.log(response.response)
            this.exportLoading = false
            if (response.response === '') {
              this.$message({
                showClose: true,
                message: '获取excel失败',
                duration: 3000,
                type: 'warning'
              });
            } else {
              var productExcel = document.getElementById('getExcel');
              console.log(response.response);
              productExcel.setAttribute("href", response.response[0]);
              productExcel.setAttribute("download", response.response[1]);
              productExcel.click();
            }
          })
        }
      },
      createQrcod() {
        console.log(this.qrcod.tasteIds.length)
        if (this.qrcod.tasteIds.length === 0 ) {
          this.$message.warning('请勾选口味')
          return
        }
        this.$refs['qrcodForm'].validate((valid) => {
          if (valid) {
            fetchCreateQrcod(this.qrcod).then(response => {
              if (response.code === 0) {
                this.qrcodUrl = response.response
                console.log(this.qrcodUrl)
                this.qrcod.expirationDate = ''
                const qrocdElement = document.getElementById('qrcod');
                this.qrcodUrl.forEach((item) => {
                  qrocdElement.setAttribute('href', item);
                  qrocdElement.click();
                  this.qrcodClose()
                })
                this.qrcod.tasteIds = []
              }
            })
          } else {
            return false
          }
        })
      },
      qrcodClose() {
        if (this.$refs['qrcodForm']) {
          this.$refs['qrcodForm'].resetFields();
        }
        this.qrcodDialogShow = false
        this.qrcod.expirationDate = ''
      },
      switchChange(data) {
        const params = {
          request: {
            id: data.id,
            status: data.status
          }
        }
        console.log('params.id=' + params.request.id)
        console.log('params.status=' + params.request.status)
        fetchUpdateStatus(params.request).then(response => {
          if (response.code === 0) {
            if (params.request.status === 1) {
              this.$message.success('智能补货已开启')

            } else {
              this.$message.success('智能补货已关闭')
            }
          } else {
            if (data.status === 1) {
              data.status = 2
            } else {
              data.status = 1
            }
            this.$message.success('操作失败')
          }
        })
      },
      handleCategoryChange(value) {
        if (value[0]) {
          this.product.bigCategoryId = value[0]
        } else {
          this.product.bigCategoryId = ''
        }
        if (value[1]) {
          this.product.middleCategoryId = value[1]
        } else {
          this.product.middleCategoryId = ''
        }
        if (value[2]) {
          this.product.littleCategoryId = value[2]
        } else {
          this.product.littleCategoryId = ''
        }
        fetchGoodsCategory(this.goodsCategories, this.product, value);
      },
      closeUploadDialog() {
        this.uploadDialogShow = false
        this.search()
      }
    },
    watch: {
      'product.salePrice': function (v, ov) {
        console.log(v + " === " + ov)
      },
      /*machineDialogSelect: {
        handler: function (val, oldVal) {
          this.machinesResult = [];
          this.machines.forEach(item => {
            if (!val) {
              this.machinesResult.push(item)
            } else {
              if (item.machineName.indexOf(val) !== -1) {
                this.machinesResult.push(item)
              }
            }
          })
        }
      },*/
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .product-table-expand {
    font-size: 0;
    label {
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 33.3%;
    }
  }

  .el-card__header {
    padding: 2px 20px !important;
    border-bottom: 1px solid #d1dbe5;
    box-sizing: border-box;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
