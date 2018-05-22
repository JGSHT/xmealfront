<template>
  <div style="margin: 0% 2%;">
    <el-tabs v-model="activeName">
      <el-tab-pane name="productList">
        <span slot="label"><i class="el-icon-document"></i>区域商品列表</span>
          <el-form :inline="true" :model="productSearch" class="demo-form-inline">
            <el-row :gutter="20">
            <el-col :span="5">
            <el-form-item label="大区">
              <el-select v-model="productSearch.companyId" filterable clearable placeholder="选择大区">
                <el-option v-for="office in offices" :key="office.id" :label="office.name" :value="parseInt(office.id)"></el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="商品名称" prop="productName">
                <el-input v-model="productSearch.productName" placeholder="商品名称"></el-input>
              </el-form-item>
            </el-col>
          <el-col :span="5">
            <el-form-item label="商品条形码" prop="barCode">
              <el-input v-model="productSearch.barCode" placeholder="商品条形码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="商品展示类别" prop="categoryId">
              <el-select v-model="productSearch.categoryId" filterable clearable placeholder="商品展示类别">
                <el-option v-for="category in categorys" :key="category.id" :label="category.categoryName"
                           :value="parseInt(category.id)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" icon="search" @click="search">查询</el-button>
              <el-button icon="plus" @click="dialogShow2 = true">添加</el-button>
              <el-button @click="getRecordProductExcel" style="margin-right: 0" :loading="exportLoading">导出</el-button>
              <el-button icon="plus" @click="offAreaProduct">移除</el-button>
              <!--<el-button @click="getRecordProductExcel" style="margin-right: 0" :loading="exportLoading">导出</el-button>-->
            </el-form-item>
          </el-col>
        </el-row>
          </el-form>
        <el-table
          v-loading="productListLoading"
          :data="products"
          @selection-change="handleProductsSelecChange"
          border
          stripe
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <detail :product="props.row"></detail>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="salePrice" label="售价" align="center"></el-table-column>
          <el-table-column prop="purchasePrice" label="进价" align="center"></el-table-column>
          <el-table-column prop="saleType" label="销售类型" align="center" :formatter="formatterSaleType"></el-table-column>
          <el-table-column prop="imageUrl" label="商品图片" align="center">
            <template slot-scope="scope">
              <el-popover
                ref="productImg"
                placement="right"
                trigger="hover">
                <img :src="scope.row.imageUrl" style="width:120px;height:120px;"/>
              </el-popover>
              <el-button v-popover:productImg type="text" v-if="scope.row.imageUrl">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center"></el-table-column>
          <el-table-column prop="productTastesStr" label="口味" align="center"></el-table-column>
          <el-table-column prop="companyName" label="所属区域" align="center"></el-table-column>
          <el-table-column prop="smartSwitch" label="智能补货" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.smartSwitch"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=1
                :inactive-value=2
                active-text="开"
                inactive-text="关"
                @change="switchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <!--<el-table-column prop="isShow" label="是否生效" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isShow"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=2
                :inactive-value=1
                active-text="开"
                inactive-text="关"
                @change="isShowChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="productEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="info"
                @click="toProductDetail(scope.$index, scope.row)">更多商品信息
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
        <a id="getExcel" style="display: none"></a>
        <el-dialog :title="dialogTitle" :visible.sync="dialogShow" v-on:close="resetForm">
          <div style="overflow:scroll;height:450px;">
            <el-form :model="product" label-position="left" ref="product" class="product-form"
                     :rules="productFormRules" v-loading="formLoading" label-width="110px" style="margin: 0 3%">
              <el-form-item label="售价" prop="salePrice">
                <el-input type="number" v-model="product.salePrice" placeholder="默认上架价格"></el-input>
              </el-form-item>
              <el-form-item label="进价" prop="purchasePrice">
                <el-input type="number" v-model="product.purchasePrice" placeholder="进价"></el-input>
              </el-form-item>
              <el-form-item label="默认上架数" prop="putawayNumber">
                <el-input type="number" pattern="[0-9]*"
                          v-model.number="product.putawayNumber" placeholder="商品默认上架数"></el-input>
              </el-form-item>
              <el-form-item label="商品状态" prop="productStatus" label-width="100px">
                <el-select v-model="product.productStatus" filterable clearable placeholder="商品状态" style="width:100%">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="parseInt(item.value)">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品来源" prop="productSource">
                <el-input v-model="product.productSource" placeholder="商品来源"></el-input>
              </el-form-item>
              <el-form-item label="限购" prop="timeIntervalNumber">
                <el-input placeholder="请输入限购时间间隔" v-model="product.timeIntervalNumber" :disabled="!(product.timeIntervalType)" :maxlength="3" class="input-with-select">
                  <el-select v-model="product.timeIntervalType"
                             slot="prepend"
                             placeholder="限购时间单位"
                             @change="selectChange"
                             style="width: 130px;">
                    <el-option label="不限购" :value="0"></el-option>
                    <el-option label="日" :value="1"></el-option>
                    <el-option label="周" :value="2"></el-option>
                    <el-option label="月" :value="3"></el-option>
                    <el-option label="年" :value="4"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="限购数" prop="timeIntervalCount">
                <el-input type="number" pattern="[0-9]*"
                          :disabled="!(product.timeIntervalType)"
                          v-model.number="product.timeIntervalCount" placeholder="商品每人限购数"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save" :loading="saveLoading2">确定</el-button>
            <el-button @click="resetForm">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="商品放置区域" :visible.sync="dialogShow2" v-on:close="resetForm2">
          <div style="height:150px;">
            <el-form :model="product" label-position="left" ref="company" class="product-form"
                     :rules="companyFormRules" v-loading="formLoading" label-width="100px" style="margin: 0 3%">
              <el-form-item label="大区" prop="companyId">
                <el-select v-model="product.companyId" filterable clearable placeholder="选择大区" style="width: 480px">
                  <el-option v-for="office in offices" :key="office.id" :label="office.name" :value="parseInt(office.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="getProducts" :loading="saveLoading">确定</el-button>
            <el-button @click="resetForm2">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="商品列表" :visible.sync="productDialogShow">
          <el-input v-model="productDialogSelect" placeholder="输入商品名称筛选"
                    style="margin-bottom:10px;width:33.3%" v-on:change="productDialogSelectChange"></el-input>
          <el-table
            v-loading="productDialogLoading"
            @selection-change="handleProductsSelectionChange"
            :data="productsResult"
            stripe
            border
            height='450'
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="productId" label="商品ID"></el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column prop="tasteName" label="口味"></el-table-column>
          </el-table>
          <p class="block" style="float:left">
            <el-pagination
              layout="total"
              :total="productTotal">
            </el-pagination>
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addAreaProduct" :loading="saveLoading2">确定</el-button>
            <el-button @click="productDialogShow = false">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="补货方式" :visible.sync="dialogShow3" v-on:close="closeDialogShow3">
          <div style="margin: 15px 0;">
            <span style="float:center; margin-left: 20px;;line-height: 50px;font-size: 17px">
            <b>关闭期间总销售数量:</b>
            {{productCount}}
          </span>
            <br/>
            <el-radio-group v-model="radio2">
              <el-radio :label="1">期间数量加入对应网点商品的建议与确认补货中</el-radio>
              <br/>
              <el-radio :label="2">按照<el-input v-model.trim="smartProductCount.proportion" placeholder="输入补货比例" style="width: 130px"></el-input>
                %的数量加入对应网点商品的建议与确认补货中</el-radio>
            </el-radio-group>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateMachineProduct" :loading="ProductCountSaveLoading">确定</el-button>
            <el-button @click="closeDialogShow3">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="productDetail">
        <span slot="label"><i class="el-icon-date"></i> 商品信息</span>
        <el-card class="box-card">
          <detail :product="productDetail"></detail>
        </el-card>
        <el-card class="box-card" style="margin-top:10px">
          <div slot="header" class="clearfix" style="height: 18px;">
            <span style="line-height: 18px;">商品在售设备</span>
              <!--<el-popover ref="popover5" placement="top" width="160" v-model="visible2">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedTaste" @change="handleCheckedTasteChange">
                  <el-checkbox v-for="taste in productTastes" :label="taste.tasteId" :key="taste.tasteId">{{taste.tasteName}}</el-checkbox>
                </el-checkbox-group>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="getMachines">确定</el-button>
                </div>
              </el-popover>-->
              <el-button type="info" size="small" @click="getMachines">上架</el-button>
            <el-button type="info" size="small" @click="offProduct">下架</el-button>
            <el-input id="newFloor" style="width: 100px;" type="number" pattern="[0-9]*" :min="1" :max="10"
                      v-model="this.newFloor"   v-show="editFloors"></el-input>
            <el-button v-show="!editFloors" type="info" @click='editMoveMachineProductOnFloor' size="mini">批量修改层数</el-button>
            <el-button v-show="editFloors" type="info" @click='saveMoveMachineProductOnFloor' size="mini">提交</el-button>
          </div>
          <!--<el-input v-model="productMachineCardSelect" placeholder="输入设备名称筛选"
                    style="margin-bottom:10px;width:15%" v-on:change="productMachineCardSelectChange"></el-input>-->
          <el-row  :gutter="20">
          <el-form :inline="true" :model="productMachineSearch" class="demo-form-inline">
            <el-col :span="5">
            <el-form-item label="机构">
              <el-cascader
                :options="offices2"
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
            <el-table-column prop="onFloor" label="商品所在层数">
              <template slot-scope="scope">
                <el-input style="width: 100px;" type="number" pattern="[0-9]*" :min="1" :max="10"
                          v-model.number="scope.row.newFloor"  v-show="scope.row.edit"></el-input>
                <span v-show="!scope.row.edit">{{ scope.row.onFloor }}</span>
                <el-button v-show="!scope.row.edit" type="text" @click='editFloor(scope.row)' size="mini">修改</el-button>
                <el-button v-show="scope.row.edit" type="text" @click='saveFloor(scope.row)' size="mini">提交</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="salePrice" label="商品售价"></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价"></el-table-column>
            <el-table-column prop="tasteName" label="商品口味"></el-table-column>
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
              <!-- layout="total"
               :total="productMachinesTotal">-->
            </el-pagination>
          </p>
        </el-card>
        <el-dialog title="设备列表" :visible.sync="machineDialogShow" v-on:close="resetForm3">
          <!--<el-input v-model="machineDialogSelect" placeholder="输入设备名称筛选"
                    style="margin-bottom:10px;width:33.3%" v-on:change="machineDialogSelectChange"></el-input>-->
          <el-form :inline="true" :model="machineSearch" class="demo-form-inline" ref="machines">
            <el-form-item label="机构">
              <el-cascader
                :options="offices2"
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
              <el-table-column prop="floors" label="商品所在层">
                <template slot-scope="scope">
                  <el-input-number id="ff" v-model="num" controls-position="right" @change="allFloor" :min="1" :max="10"></el-input-number>
                </template>
              </el-table-column>
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
              <!--layout="total"
              :total="machineTotal">-->
            </el-pagination>
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addMachine" :loading="saveLoading">确定</el-button>
            <el-button @click="resetForm3">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    fetchProductList,
    fetchAddAreaProduct,
    fetchAreaProductList,
    fetchDeleteAreaProduct,
    fetchUpdateProduct,
    fetchProductMachines,
    fetchMachineList,
    fetchAddMachine,
    fetchOffProduct,
    fetchProductDetail,
    fetchGetProductTaste,
    fetchGetTotalProductCount,
    fetchUpdateMachineProduct,
    fetchUpdateFloor,
    fetchUpdateMoveFloor,
    fetchRecordProduct
  } from 'api/areaProduct';
  import detail from './areaProductDetail';
  import { fetchCategoryList } from 'api/category';
  import { fetchOfficeTree } from 'api/office';
  import { fetchGoodsCategory } from '../../utils/goodsCategory';
  import ElInput from "element-ui/packages/input/src/input";

  export default {
    created() {
      this.search()
      this.getOffices()
      this.getCategory()
    },
    components: {
      ElInput,
      detail
    },
    data() {
      return {
        num: 2,
        radio2: 1,
        ProductCountSaveLoading: false,
        productCount: '',
        editFloors:false,
        newFloor:1,
        dialogShow3: false,
        smartProductCount: {
          tasteId: '',
          productId: '',
          companyId: '',
          proportion: '',
          smartSwitch: ''
        },
        saveLoading2: false,
        checkAll: false,
        checkedTaste: [],
        isIndeterminate: false,
        visible2: false,
        offices2: [],
        productDialogLoading: false,
        dialogShow2: false,
        categorys: [],
        goodsCategories: [],
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
          barCode: '',
          companyId: ''
        },
        brandLabels: [],
        products: [],
        showImgUrl: '',
        productListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        productMachinesLoading: false,
        product: {
          id: '',
          productName: '',
          categoryId: '',
          categoryName: '',
          salePrice: '',
          purchasePrice: '',
          spec: '',
          unit: '',
          shelfLife: '',
          productSource: '',
          description: '',
          putawayNumber: '',
          note: '',
          barCode: '',
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
          productTastes: [],
          productTastesStr: '',
          goodsCategorys: '',
          companyId: '',
          productStatus: '',
          timeIntervalType: '',
          timeIntervalNumber: '',
          timeIntervalCount: '',
          timeIntervalNumberDisabled: true
        },
        options1: [{
          value: 1,
          label: '新品'
        }, {
          value: 2,
          label: '正常'
        }, {
          value: 3,
          label: '热卖'
        }],
        companyFormRules: {
          companyId: [
            { type: 'number', required: true, message: '请选择大区', trigger: 'change' }
          ]
        },
        productFormRules: {
          salePrice: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if ((/(^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$)/.test(value) == false) && (/(^[1-9]\d*$)/.test(value) == false)) {
                  callback(new Error('请规范输入商品售价'));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
            /* ,{ type: 'number', required: true, message: '请输入商品售价', trigger: 'change' } */
          ],
          purchasePrice: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if ((/(^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$)/.test(value) == false) && (/(^[1-9]\d*$)/.test(value) == false)) {
                  callback(new Error('请规范输入商品进价'));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }

            /* { type: 'number', required: true, message: '请输入商品进价', trigger: 'change' } */
          ],
          productStatus: [
            { required: true, type: 'number', message: '请选择商品状态', trigger: 'blur' }
          ],
          productSource: [{ required: true, message: '请输入商品来源', trigger: 'blur' }],
          timeIntervalNumber: [
            {
              validator: (rule, value, callback) => {
                if (this.product.timeIntervalType && this.product.timeIntervalType !== '0') {
                  if (/(^[1-9]\d*$)/.test(value) === false) {
                    callback(new Error('请规范输入限购日期'));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }, trigger: 'change, blur'
            }
          ],
          timeIntervalCount: [
            {
              validator: (rule, value, callback) => {
                if (this.product.timeIntervalType && this.product.timeIntervalType !== '0') {
                  if (/(^[1-9]\d*$)/.test(value) === false) {
                    callback(new Error('请规范输入限购数量'));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }, trigger: 'change, blur'
            }
          ]
        },
        productDetail: {},
        /* productMachineCardSelect: '',
        productMachinesResult: [], */
        pmpage: 1,
        pmsize: 10,
        productMachinesTotal: 0,
        pmsizes: [10, 20, 50, 100, 300, 500],
        productMachines: [],
        productMachinesSelection: [],
        machinesSelection: [],
        machineDialogSelect: '',
        machines: [],
        /* machinesResult: [], */
        mpage: 1,
        msize: 10,
        machineTotal: 0,
        msizes: [10, 20, 50, 100],
        machineDialogShow: false,
        machineDialogLoading: false,
        productMachineSearch: {
          productId: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: [],
          machineName: '',
          tasteId: ''
        },
        machineSearch: {
          productId: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: [],
          machineName: '',
          productTasteIds: [],
          tasteId: ''
        },
        exportLoading: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        productTastes: [],
        inputVisible: false,
        productTaste: '',
        productDialogShow: false,
        productDialogSelect: '',
        productsResult: [],
        productTotal: '',
        products2: [],
        productsSelection: [],
        productIds: []
      }
    },
    methods: {
      closeDialogShow3() {
        this.smartProductCount.proportion = ''
        this.radio2 = 1
        this.dialogShow3 = false
        this.search()
      },
      handleCheckAllChange(val) {
        if (val) {
          this.checkedTaste = []
          this.productTastes.forEach(item => {
            this.checkedTaste.push(item.tasteId)
          })
          console.log(JSON.stringify(this.checkedTaste))
        } else {
          this.checkedTaste = []
        }
        this.isIndeterminate = false;
      },
      handleCheckedTasteChange(value) {
        const checkedCount = value.length;
        this.checkAll = checkedCount === this.productTastes.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.productTastes.length;
        console.log(JSON.stringify(this.checkedTaste))
      },
      updateFloor(value){
        console.log(value)

      },
      editFloor(areaProduct) {
        areaProduct.edit = true;
        areaProduct.newFloor = areaProduct.onFloor
      },
      saveFloor(areaProduct) {
        if(areaProduct.newFloor < 1 || areaProduct.newFloor > 10){
          this.$message({
            message: '输入的层数不在正确范围内！！！',
            type: 'error',
            duration: 2000
          });
          return
        }
        fetchUpdateFloor({'machineId':areaProduct.machineId,'productId':areaProduct.productId,'tasteId':areaProduct.tasteId,'onFloor':areaProduct.newFloor}).then(response => {
          if (response.code === 0) {
            areaProduct.onFloor = areaProduct.newFloor
            areaProduct.edit=false
          }
        })
      },
      getCategory() {
        fetchCategoryList({}, 1, 100000).then(response => {
          this.categorys = response.response
        })
      },
      getProducts() {
        this.$refs['company'].validate(valid => {
          if (valid) {
            this.productDialogSelect = ''
            this.productDialogShow = true
            this.productDialogLoading = true
            fetchProductList({ companyId: this.product.companyId }).then(response => {
              this.productDialogLoading = false
              this.products2 = response.response
              this.productsResult = response.response
              this.productTotal = this.productsResult.length
            })
          }
        })
      },
      productDialogSelectChange() {
        this.productsResult = [];
        this.products2.forEach(item => {
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
      handleProductsSelectionChange(val) {
        this.productsSelection = val
      },
      addAreaProduct() {
        let products = []
        this.productsSelection.forEach(item => {
          let product = new Object()
          product.productId = item.productId
          product.tasteId = item.tasteId
          products.push(product)
        })
        if (products.length > 0) {
          this.saveLoading2 = true
          fetchAddAreaProduct(this.product.companyId, products).then(response => {
            this.resetForm2()
            this.saveLoading2 = false
            this.productDialogShow = false
            this.$message.success('添加成功')
            this.search()
          })
        } else {
          this.$message.error('请至少选择一条后再进行添加操作')
        }
      },


      allFloor(value){
        //console.log(value);
        this.num = value;
      },


      handleProductsSelecChange(val) {
        this.productIds = val
      },
      offAreaProduct() {
        let products = []
        console.log(JSON.stringify(this.productIds))
        this.productIds.forEach(item => {
          let areaProduct = {};
          areaProduct.companyId = item.companyId
          areaProduct.productId = item.productId
          areaProduct.tasteId = item.tasteId
          products.push(areaProduct)
        })
        if (products.length > 0) {
          fetchDeleteAreaProduct(products).then(response => {
            if (response.code === 0){
              this.saveLoading = false
              this.productDialogShow = false
              this.$message.success('移除成功')
              this.search()
            }
          })
        } else {
          this.$message.error('请至少选择一条后再进行移除操作')
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
      filterOffices(companyId) {
        this.offices2 = []
        this.offices.forEach(item => {
          if (item.id == companyId.toString()) {
            this.offices2.push(item)
            return
          }
        })
      },
      getGoodsCategoryTree() {
        fetchGoodsCategoryTree().then(response => {
          if (response.response) {
            this.goodsCategories = response.response[0].children
          }
        })
      },
      handleChange(value) {
        if (value[0]) {
          this.productMachineSearch.companyId = value[0]
        } else {
          this.productMachineSearch.companyId = this.productDetail.companyId
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
          this.machineSearch.companyId = this.productDetail.companyId
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
        fetchAreaProductList(this.productSearch, this.page, this.size).then(response => {
          this.productListLoading = false
          this.products = response.response
          this.total = response.total
        })
      },
      productEdit(index, row) {
        this.dialogTitle = '修改商品信息'
        this.dialogShow = true
        this.formLoading = true
        fetchProductDetail(row.productId, row.companyId, row.tasteId).then(response => {
          this.formLoading = false
          this.product = response.response;
          // console.log(JSON.stringify(response.response))
        })
      },
      save() {
        this.$refs.product.validate(valid => {
          if (valid) {
            this.saveLoading2 = true
            /* if (this.product.labelId) {
               this.product.labelName = this.brandLabels.find((item) => {
                 return item.id === this.product.labelId
               }).labelName
             }*/
            let areaProductInfo = {}
            areaProductInfo = this.product
            areaProductInfo.smartSwitch = ''
            fetchUpdateProduct(areaProductInfo).then(response => {
              if (response.code === 0) {
                this.saveLoading2 = false
                this.search()
                this.$message.success('保存成功')
                this.dialogShow = false
              } else {
                this.saveLoading2 = false
              }
            })
          } else {
            return false
          }
        })
      },
      getRecordProductExcel() {
        if (this.products === []) {
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
              productExcel.setAttribute('href', response.response[0]);
              productExcel.setAttribute('download', response.response[1]);
              productExcel.click();
            }
          })
        }
      },
      /* productMachineCardSelectChange() {
         this.productMachinesResult = [];
         this.productMachines.forEach(item => {
           if (!this.productMachineCardSelect) {
             this.productMachinesResult.push(item)
           } else {
             if (item.machineName.indexOf(this.productMachineCardSelect) !== -1) {
               this.productMachinesResult.push(item)
             }
           }
         })
         this.productMachinesTotal = this.productMachinesResult.length
       },*/
      resetForm() {
        if (this.$refs['product']) {
          this.$refs['product'].resetFields();
        }
        this.product.putawayNumber = ''
        this.product.labelIds = ''
        this.product.labelIdSelected = []
        this.product.labelName = ''
        this.saveLoading = false
        this.dialogShow = false
        this.productTastes = []
      },
      resetForm2() {
        if (this.$refs['company']) {
          this.$refs['company'].resetFields();
        }
        this.dialogShow2 = false
      },
      resetForm3() {
        this.machineSearch.officeId = ''
        this.machineSearch.regionId = ''
        this.machineSearch.companyId = ''
        this.machineSearch.officeIdList = []
        this.machineSearch.machineName = ''
        this.machineDialogShow = false
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
        if (row.salePrice) {
          if (row.saleType === 2) {
            this.$message.warning('该商品销售类型为商城销售，不能进行上架操作！')
            return
          }
          this.filterOffices(row.companyId)
          this.activeName = 'productDetail'
          this.productDetail = row
          this.getProductMachines()
        } else {
          this.$message.warning('请先补全该商品信息！')
        }
      },
      getProductMachines() {
        this.productMachinesLoading = true
        this.productMachineSearch.productId = this.productDetail.productId
        this.productMachineSearch.companyId = this.productDetail.companyId
        this.productMachineSearch.tasteId = this.productDetail.tasteId
        fetchProductMachines(this.productMachineSearch, this.pmpage, this.pmsize).then(response => {
          this.productMachinesLoading = false
          this.productMachines = response.response
          /* this.productMachinesResult = response.response */
          this.productMachinesTotal = response.total
        })
      },
      handleProductMachinesSelectionChange(val) {
        this.productMachinesSelection = val
      },
      handleMachinesSelectionChange(val) {
        this.machinesSelection = val
      },
      offProduct() {
        const machineProducts = []
        this.productMachinesSelection.forEach(item => {
          const areaProduct = new Object();
          areaProduct.machineId = item.machineId
          areaProduct.productId = this.productDetail.productId
          areaProduct.tasteId = item.tasteId
          machineProducts.push(areaProduct)
        })
        if (machineProducts.length > 0) {
          fetchOffProduct(machineProducts).then(response => {
            this.$message.success('下架成功')
            this.productMachinesSelection = []
            this.getProductMachines()
          })
        } else {
          this.$message.error('请至少选择一条记录后再进行下架操作')
        }
      },
      editMoveMachineProductOnFloor() {
        const machineProducts = []
        this.productMachinesSelection.forEach(item => {
          const areaProduct = new Object();
          areaProduct.machineId = item.machineId
          areaProduct.productId = this.productDetail.productId
          areaProduct.onFloor = item.onFloor
          machineProducts.push(areaProduct)
        })
        if (machineProducts.length > 0) {
            this.editFloors = true

        } else {
          this.$message.error('请至少选择一条记录后再进行批量修改操作')
        }
      },
      saveMoveMachineProductOnFloor(){
        var floorText = document.getElementById("newFloor").value;
        if(floorText < 1 || floorText > 10){
          this.$message({
            message: '输入的层数不在正确范围内！！！',
            type: 'error',
            duration: 2000
          });
          return
        }
        const machineProducts = []
        this.productMachinesSelection.forEach(item => {
            const areaProduct = new Object();
            areaProduct.machineId = item.machineId
            areaProduct.productId = this.productDetail.productId
            areaProduct.tasteId = item.tasteId
            //console.log(document.getElementById("newFloor").value)
          console.log(this.newFloor)
            areaProduct.onFloor = floorText
            machineProducts.push(areaProduct)
        })
        fetchUpdateMoveFloor(machineProducts).then(response => {
            console.log(machineProducts)
            this.$message.success('修改成功！！')
            this.productMachinesSelection = []
            this.getProductMachines()
        })
        this.editFloors = false
      },
      addMachine() {
        let machineIds = []
        this.machinesSelection.forEach(item => {
          machineIds.push(item.id)
          //console.log(this.num)
        })
        if (machineIds.length > 0) {
          this.saveLoading = true
          fetchAddMachine(this.productDetail.productId, this.productDetail.salePrice, this.productDetail.companyId, machineIds.join(','),this.num, this.productDetail.tasteId).then(response => {
            this.saveLoading = false
            this.$message.success('上架成功')
            this.resetForm3()
            this.machinesSelection = []
            this.getProductMachines()
          })
        } else {
          this.$message.error('请至少选择一台设备后再进行上架操作')
        }
      },
      getProductTastes() {
        this.checkedTaste = []
        fetchGetProductTaste(this.productDetail.productId).then(response => {
          if (response.response.length > 0) {
            this.productTastes = response.response
            this.visible2 = true
          } else {
            this.getMachines()
          }
        })
      },
      getMachines() {
        /* if (this.checkedTaste.length > 0) {
          this.machineSearch.productTasteIds = this.checkedTaste
        } else {
          this.$message.warning('请先勾选商品口味！')
          return
        } */
        this.machineDialogSelect = ''
        this.machineDialogShow = true
        this.machineDialogLoading = true
        this.machineSearch.productId = this.productDetail.productId
        this.machineSearch.tasteId = this.productDetail.tasteId
        if (this.machineSearch.companyId === '') {
          this.machineSearch.companyId = this.productDetail.companyId
        }
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
              productExcel.setAttribute('href', response.response[0]);
              productExcel.setAttribute('download', response.response[1]);
              productExcel.click();
            }
          })
        }
      },
      switchChange(data) {
        const params = {
          request: {
            companyId: data.companyId,
            productId: data.productId,
            tasteId: data.tasteId,
            smartSwitch: data.smartSwitch
          }
        }
        if (data.smartSwitch === 1) {
          fetchGetTotalProductCount(params.request).then(response => {
            if (response.code === 0) {
              this.productCount = response.response
              this.smartProductCount.tasteId = data.tasteId
              this.smartProductCount.companyId = data.companyId
              this.smartProductCount.productId = data.productId
              this.smartProductCount.smartSwitch = data.smartSwitch
              this.dialogShow3 = true
            }
          })
        } else {
          if (data.smartSwitch === 2) {
            fetchUpdateProduct(params.request).then(response => {
              if (response.code === 0) {
                this.$message.success('智能补货已关闭')
              } else {
                if (data.smartSwitch === 2) {
                  data.smartSwitch = 1
                }
                this.$message.success('操作失败')
              }
            })
          }
        }
      },
      updateMachineProduct() {
        let patrn = /^\d+(\.\d+)?$/
        if (this.radio2 === 2 && !patrn.test(this.smartProductCount.proportion)){
          this.$message.warning('请规范输入补货比例！')
          return
        }
        let pc = new Object()
        pc.companyId = this.smartProductCount.companyId
        pc.tasteId = this.smartProductCount.tasteId
        pc.productId = this.smartProductCount.productId
        pc.smartSwitch = this.smartProductCount.smartSwitch
        pc.proportion = this.smartProductCount.proportion
        pc.radioSelect = this.radio2
        this.ProductCountSaveLoading = true
        fetchUpdateMachineProduct(pc).then(response => {
          if (response.code === 0) {
            this.ProductCountSaveLoading = false
            this.dialogShow3 = false
            this.$message.success('智能补货已开启!')
            this.smartProductCount.proportion = ''
          } else {
            this.ProductCountSaveLoading = false
            this.dialogShow3 = false
            this.smartProductCount.proportion = ''
            this.search()
            this.$message.success('操作失败')
          }
        })
      },
     /* isShowChange(data) {
        const params = {
          request: {
            companyId: data.companyId,
            productId: data.productId,
            isShow: data.isShow
          }
        }
        console.log('params.companyId=' + params.request.companyId)
        console.log('params.productId=' + params.request.productId)
        console.log('params.isShow=' + params.request.isShow)
        fetchUpdateProduct(params.request).then(response => {
          if (response.code === 0) {
            if (params.request.isShow === 1) {
              this.$message.success('商品已失效')
            } else {
              this.$message.success('商品已生效')
            }
          } else {
            if (data.isShow === 1) {
              data.isShow = 2
            } else {
              data.isShow = 1
            }
            this.$message.success('操作失败')
          }
        })
      },*/
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
      selectChange(v) {
        if (v === 0) {
          this.product.timeIntervalNumber = '';
          this.product.timeIntervalCount = '';
        }
      }
    },
    watch: {
      /* 'product.timeIntervalType': function(v, ov) {}
      ,machineDialogSelect: {
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
      }, */
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
