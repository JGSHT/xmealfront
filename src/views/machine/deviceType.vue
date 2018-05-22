<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName">
      <el-tab-pane name="deviceTypeList">
        <span slot="label"><i class="el-icon-document"></i> 设备类型列表</span>
        <el-row :gutter="20">
        <el-form :inline="true" :model="deviceTypeSearch" class="demo-form-inline">
          <el-col :span="5">
          <el-form-item label="设备类型名称">
            <el-input v-model="deviceTypeSearch.dtName" placeholder="设备类型名称"></el-input>
          </el-form-item>
          </el-col>

          <el-col :span="5">
          <el-form-item>
            <el-button type="primary" icon="getdeviceTypeList" @click="getdeviceTypeList">查询</el-button>
            <el-button icon="plus" @click="addDeviceType(1)">新增</el-button>
          </el-form-item>
          </el-col>
        </el-form>
        </el-row>

        <el-table
          ref="multipleTable"
          v-loading="deviceTypeListLoading"
          :data="deviceTypeList"
          stripe
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="设备类型ID"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="dtName"
            label="设备类型名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="totalTier"
            label="总层数"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" width="300px" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="deviceTypeEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deviceTypeDelete(scope.$index, scope.row)">删除
              </el-button>
              <el-button
                size="small"
                type="info"
                @click="editTierProduct(scope.$index, scope.row)">编辑各层商品
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogShow" v-on:close="resetForm">
          <div style="align-content:center">
            <el-form :inline="true" :model="deviceType" label-position="left" ref="deviceTypeForm"
                     :rules="deviceTypeFormRules"
                     v-loading="formLoading" label-width="200px"
                     style="margin: 0 3%">

              <el-form-item label="名称" prop="dtName" label-width="100px">
                <el-input style="width: 480px;" v-model.trim="deviceType.dtName" placeholder="设备类型名称"></el-input>
              </el-form-item>

              <el-form-item label="总层数" prop="totalTier" label-width="100px">
                <el-input style="width: 480px;" type="number" v-model="deviceType.totalTier"
                          placeholder="总层数"></el-input>
              </el-form-item>

              <el-form-item prop="id">
                <el-input :hidden="true" style="width: 50px;" v-model="deviceType.id"></el-input>
              </el-form-item>

            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveDeviceType" :loading="saveLoading">确定</el-button>
            <el-button @click="resetForm">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="deviceTypeDetail" @tab-click="clickDeviceTypeDetail">
        <span slot="label"><i class="el-icon-date"></i> 设备类型信息</span>
        <el-alert v-if="!deviceType.id" :closable="false"
                  title="请选择一种设备类型,才能查看更多信息！！！" type="warning">
        </el-alert>
        <el-card v-if="deviceType.id" class="box-card" style="margin-top:10px">
          <div slot="header" class="clearfix" style="height: 28px;">
            <span style="line-height: 18px;" v-if="deviceType.id">设备类型包含商品</span>
            <el-button v-if="deviceType.id" type="info" size="small" @click="getProducts">添加</el-button>
            <el-button v-if="deviceType.id" type="info" size="small" @click="offProduct">移除</el-button>
          </div>
          <el-input v-model="deviceTypeProductCardSelect" placeholder="输入商品名称筛选"
                    style="margin-bottom:10px;width:15%" v-on:change="deviceTypeProductCardSelectChange"></el-input>
          <el-table
            v-loading="deviceTypeProductsLoading"
            @selection-change="handleDeviceTypeProductSelectionChange"
            :data="deviceTypeProductsResult"
            height="600"
            border
            stripe
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="productId" label="商品ID"></el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价"></el-table-column>
            <el-table-column prop="salePrice" label="商品售价" aligin="center">
              <!--<template scope="scope">
                <el-input style="width: 100px;" type="number" pattern="[0-9]*"
                          v-model.number="scope.row.newSalePrice" v-show="scope.row.salePriceEdit"></el-input>
                <span v-show="!scope.row.salePriceEdit">{{ scope.row.salePrice }}</span>
                <el-button v-show='!scope.row.salePriceEdit' type="text" @click='editSalePrice(scope.row)' size="mini">修改</el-button>
                <el-button v-show='scope.row.salePriceEdit' type="text" @click='saveSalePrice(scope.row)' size="mini">提交</el-button>
              </template>-->
            </el-table-column>
            <el-table-column prop="tier" label="货架层"></el-table-column>
            <el-table-column prop="errorRange" label="误差范围（单位：克）"></el-table-column>
          </el-table>
          <p class="block" style="float:right">
            <el-pagination
              layout="total"
              :total="deviceTypeProductsTotal">
            </el-pagination>
          </p>
        </el-card>
        <el-dialog title="商品列表" :visible.sync="productDialogShow" v-on:close="productCancel">
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
            <el-table-column prop="id" label="商品ID"></el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column prop="salePrice" label="售价"></el-table-column>
            <el-table-column prop="purchasePrice" label="进价"></el-table-column>
          </el-table>
          <p class="block" style="float:left">
            <el-pagination
              layout="total"
              :total="productTotal">
            </el-pagination>
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="preAddProduct">确定</el-button>
            <el-button @click="productCancel">取消</el-button>
          </div>
        </el-dialog>

        <el-dialog title="放置层及误差" :visible.sync="lastDialogShow" v-on:close="lastResetForm">
          <div style="align-content:center">
            <el-form :inline="true" :model="deviceType" label-position="left" ref="lastForm" :rules="lastFormRules"
                     label-width="200px"
                     style="margin: 0 3%">

              <el-form-item label="放置层" prop="tier" label-width="100px">
                  <el-input style="width: 480px;" type="number" v-model="deviceType.tier"
                            :placeholder="this.content"></el-input>
              </el-form-item>

              <el-form-item label="误差值" prop="errorRange" label-width="100px">
                <el-input style="width: 480px;" type="number" v-model="deviceType.errorRange"
                          placeholder="误差值（单位：克）"></el-input>
              </el-form-item>

            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addProduct" :loading="lastSaveLoading">确定</el-button>
            <el-button @click="lastResetForm">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    fetchDeviceTypeList,
    fetchDeleteDeviceType,
    fetchSaveDeviceType,
    fetchUpdateDeviceType,
    fetchDeviceTypeProduct,
    offProduct,
    addProduct,
    fetchProductList,
    updateSalePrice
  } from 'api/deviceType';

  export default {
    created() {
      this.getdeviceTypeList()
    },
    data() {
      return {
        activeName: 'deviceTypeList',
        deviceTypeSearch: {
          dtName: ''
        },
        offices: [],
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        deviceTypeList: [],
        machineDetail: {},
        deviceTypeProductsSelection: [],
        deviceTypeListLoading: false,
        deviceTypeProductsLoading: false,
        deviceTypeProducts: [],
        deviceTypeProductCardSelect: '',
        deviceTypeProductsResult: [],
        deviceTypeProductsTotal: 0,
        productTotal: 0,
        productDialogShow: false,
        productDialogLoading: false,
        productDialogSelect: '',
        productsResult: [],
        products: [],
        productsSelection: [],
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        saveLoading: false,
        lastDialogShow: false,
        lastSaveLoading: false,
        content: '',
        deviceType: {
          id: '',
          dtName: '',
          totalTier: '',
          tier: '',
          errorRange: ''
        },
        deviceTypeFormRules: {
          dtName: [
            {required: true, message: '请输入设备类型名称', trigger: 'blur'}
          ],
          totalTier: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if ((/^[1-9]\d*$/.test(value) == false)) {
                  callback(new Error("请规范输入层数"));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ]
          /*,
          stationId: [
            {type: 'number', required: true, message: '请选择站点', trigger: 'blur'}
          ]*/
        },
        lastFormRules: {
          tier: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if ((/^[1-9]\d*$/.test(value) == false)) {
                  callback(new Error("请规范输入层数"));
                } else if (value > this.deviceType.totalTier) {
                  callback(new Error("已超出此设备类型最大层数"));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
          ],
          errorRange: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if ((/(^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$)/.test(value) == false) && (/(^[1-9]\d*$)/.test(value) == false)) {
                  callback(new Error("请规范输入误差值"));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
          ]
        }
      }
    },
    methods: {
      getdeviceTypeList() {
        this.deviceTypeListLoading = true
        fetchDeviceTypeList(this.deviceTypeSearch, this.page, this.size).then(response => {
          this.deviceTypeListLoading = false
          this.deviceTypeList = response.response
          this.total = response.total
        })
      },

      deviceTypeEdit(index, row) {
        this.dialogTitle = '编辑设备类型';
        this.dialogShow = true;
        this.formLoading = true;
        fetchUpdateDeviceType(row.id).then(response => {
          this.formLoading = false;
          this.deviceType = response.response;
        })
      },

      deviceTypeDelete(index, row) {
        this.$confirm('此操作将永久删除该设备类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deviceTypeListLoading = true
          fetchDeleteDeviceType(row.id).then(response => {
            this.getdeviceTypeList();
            this.$message.success('删除成功')
          })
        })
      },

      editTierProduct(index, row) {
        this.activeName = 'deviceTypeDetail'
        this.deviceType = row
        this.deviceType.tier = ''
        this.getDeviceTypeProduct()
      },

      getDeviceTypeProduct() {
        this.deviceTypeProductCardSelect = ''
        this.deviceTypeProductsLoading = true
        console.log('获取设备类型商品列表时id' + this.deviceType.id)
        fetchDeviceTypeProduct(this.deviceType).then(response => {
          this.deviceTypeProductsLoading = false
          this.deviceTypeProducts = response.response
          this.deviceTypeProductsResult = response.response
          this.deviceTypeProductsTotal = this.deviceTypeProductsResult.length
        })
      },

      addDeviceType(index) {
        this.dialogTitle = '新增设备类型'
        this.dialogShow = true
      },
      saveDeviceType() {
        this.$refs['deviceTypeForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            fetchSaveDeviceType(this.deviceType).then(response => {
              if (response.code === 0) {
                this.getdeviceTypeList()
                this.saveLoading = false
                this.$message.success('保存成功')
                this.resetForm()
              } else {
                this.saveLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      productDialogSelectChange() {
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
      deviceTypeProductCardSelectChange() {
        this.deviceTypeProductsResult = [];
        this.deviceTypeProducts.forEach(item => {
          if (!this.deviceTypeProductCardSelect) {
            this.deviceTypeProductsResult.push(item)
          } else {
            if (item.productName.indexOf(this.deviceTypeProductCardSelect) !== -1) {
              this.deviceTypeProductsResult.push(item)
            }
          }
        })
        this.deviceTypeProductsTotal = this.deviceTypeProductsResult.length
      },
      resetForm() {
        if (this.$refs['deviceTypeForm']) {
          this.$refs['deviceTypeForm'].resetFields();
        }
        this.dialogShow = false
      },
      handleSizeChange(val) {
        this.size = val
        this.getdeviceTypeList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getdeviceTypeList()
      },
      handleDeviceTypeProductSelectionChange(val) {
        this.deviceTypeProductsSelection = val
      },
      handleProductsSelectionChange(val) {
        this.productsSelection = val
      },
      clickDeviceTypeDetail() {
        if (!deviceType.id) {
          activeName = 'deviceTypeList'
          this.$notify({
            title: '警告',
            message: '请选择设备类型后再进行操作',
            type: 'warning'
          });
        }
      },
      getProducts() {
        this.productDialogSelect = ''
        this.productDialogShow = true
        this.productDialogLoading = true
        console.log('获取商品列表时id' + this.deviceType.id)
        fetchProductList({'id': this.deviceType.id}).then(response => {
          if (response.code === 0) {
            this.productDialogLoading = false
            this.products = response.response
            this.productsResult = response.response
            this.productTotal = this.productsResult.length
          }
        })
      },
      productCancel() {
        this.productDialogShow = false
        this.getDeviceTypeProduct()
      },
      addProduct() {
        this.$refs['lastForm'].validate((valid) => {
          if (valid) {
            let products = []
            this.productsSelection.forEach(item => {
              products.push(item.id)
            })
            if (products.length > 0) {
              this.lastSaveLoading = true
              addProduct(this.deviceType.id, products.join(','), this.deviceType.tier, this.deviceType.errorRange).then(response => {
                if (response.code === 0) {
                  this.lastSaveLoading = false
                  this.$message.success('添加成功')
                  console.log('最后一步保存时id' + this.deviceType.id)
                  this.lastResetForm()
                  console.log('清空输入框后id' + this.deviceType.id)
                  this.getProducts()
                }
              })
            } else {
              this.$message.error('请至少选择一条后再进行添加操作')
            }
          } else {
            return false
          }
        })
      },
      offProduct() {
        let deviceTypeProducts = []
        this.deviceTypeProductsSelection.forEach(item => {
          deviceTypeProducts.push(item.productId)
        })
        if (deviceTypeProducts.length > 0) {
          offProduct(this.deviceType.id, deviceTypeProducts.join(',')).then(response => {
            if (response.code === 0) {
              this.$message.success('下架成功')
              this.getDeviceTypeProduct()
            }
          })
        } else {
          this.$message.error('请至少选择一条后再进行下架操作')
        }
      },
      preAddProduct() {
        let products = []
        this.productsSelection.forEach(item => {
          products.push(item.id)
        })
        if (products.length <= 0) {
          this.$message.error('请选择要添加的商品')
        } else {
          this.content = '此设备类型共' + this.deviceType.totalTier + '层'
          this.lastDialogShow = true
        }
      },
      lastResetForm() {
        if (this.$refs['lastForm']) {
          this.$refs['lastForm'].resetFields();
        }
        this.lastDialogShow = false
      },
      /* editSalePrice(machineProduct) {
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
       },*/
      open(theMessage) {
        this.$message({
          message: theMessage,
          duration: 2000,
          type: 'success'
        });
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
