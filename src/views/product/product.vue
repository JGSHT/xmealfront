<template>
  <div>
    <div>
      <el-form :model="product" label-position="left" ref="product" class="product-form"
               :rules="productFormRules" label-width="110px" style="margin: 0 3%">
        <el-form-item label="商品ID" v-show="false" prop="id">
          <el-input v-model="product.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="product.productName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品展示类别" prop="categoryId">
          <el-select v-model="product.categoryId" filterable clearable placeholder="选择展示类别" style="width:100%">
            <el-option v-for="category in categorys" :key="category.id" :label="category.categoryName"
                       :value="parseInt(category.id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" prop="goodsCategoryList">
          <el-cascader
            :disabled="goodsCategoryDisbled"
            :options="goodsCategories"
            v-model="product.goodsCategoryIdList"
            :props="cascaderProps"
            clearable
            @change="handleCategoryChange"
            placeholder="选择商品所属分类"
            style="width:100%">
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品标签" prop="labelIdSelected">
          <el-select v-model="product.labelIdSelected" multiple placeholder="选择标签"
                     style="width:100%">
            <el-option v-for="brandLabel in brandLabels" :key="brandLabel.id" :label="brandLabel.labelName"
                       :value="parseInt(brandLabel.id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品口味">
          <el-row :gutter=10 v-for="(item,index) in product.productTastes" style="margin: 5px;" >
            <el-col :span=4><el-input v-model="item.tasteName" placeholder="口味名称"></el-input></el-col>
            <el-col :span=4><el-input v-model="item.weight" placeholder="重量(默认单位：克)"></el-input></el-col>
            <el-col :span=8><el-input v-model="item.barCode" placeholder="条形码"></el-input></el-col>
            <el-col :span=4>
              <img v-if="item.imageUrl" :src="item.imageUrl" style="width:60px;height:60px;"/>
            </el-col>
            <el-col :span=4>
              <el-upload
                :action="uploadImgUrl"
                :headers="uploadImgHeaders"
                :show-file-list=false
                :on-success="uploadTaste"
                multiple>
                <el-button size="mini" type="primary"
                           @click="setItem(index)">点击上传</el-button>
              </el-upload>
            </el-col>
            <el-col v-show="!item.tasteId && index > 0" :span=2 >
              <el-button @click="deleteTaste(item)" size="mini" type="danger">删除</el-button>
            </el-col>
          </el-row>
          <el-button @click="addTaste">增加</el-button>
        </el-form-item>
        <el-form-item label="销售类型" prop="saleType" label-width="100px">
          <el-select v-model="product.saleType" filterable clearable placeholder="销售类型" style="width:100%">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="parseInt(item.value)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="product.spec" placeholder="规格"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="product.unit" placeholder="单位"></el-input>
        </el-form-item>
        <el-form-item label="保质期" prop="shelfLife">
          <el-input v-model="product.shelfLife" placeholder="保质期"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input type="textarea" v-model="product.description" placeholder="商品描述"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="product.note" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍图" prop="note">
          <el-upload
            :action="uploadImgUrl"
            :headers="uploadImgHeaders"
            list-type="picture-card"
            :file-list="product.image"
            :on-remove="handleImgRemove"
            :on-success="handleImgSuccess" >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog> -->
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save" :loading="saveLoading">确定</el-button>
    </div>
  </div>
</template>

<script>
  import {
    fetchProductSave,
    fetchProductNode
  } from 'api/product';
  import detail from './detail'
  import {getToken} from 'utils/auth';
  import {fetchCategoryList} from 'api/category';
  import {fetchBrandLabelList} from 'api/brandLabel'
  import {fetchGoodsCategory} from 'utils/goodsCategory';
  import {fetchGoodsCategoryTree} from 'api/goodsCategory'

  export default {
    created() {
      this.getCategory()
      this.getBrandLabel()
      this.getGoodsCategoryTree()
    },
    components: {
      detail
    },
    props: {
      product: {
        type: Object
      },
      activeName: {
        type: String,
        default: 'orderList'
      }
    },
    data() {
      return {
        uploadImgUrl: process.env.BASE_API + '/api/private/product/taste/image',
        uploadImgHeaders: {
          'X-AUTH-TOKEN': getToken()
        },
        nowItem: 0,
        goodsCategories: [],
        goodsCategoryDisbled: false,
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        categorys: [],
        brandLabels: [],
        saveLoading: false,
        options1: [{
          value: 1,
          label: '自助机销售'
        }, {
          value: 2,
          label: '商城销售'
        }, {
          value: 3,
          label: '全部'
        }],
        productFormRules: {
          productName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          categoryId: [
            {type: 'number', required: true, message: '请选择商品品类', trigger: 'change'}
          ],
          labelIds: [
            {type: 'Array', required: true, message: '请选择商品标签', trigger: 'change'}
          ],
          shelfLife: [
            {required: true, message: '请输入商品保质期', trigger: 'blur'}
          ],
        },
        inputVisible: false,
        productTaste: ''
      }
    },
    methods: {
      /*移除商品口味*/
      deleteTaste(tag) {
        this.product.productTastes.splice(this.product.productTastes.indexOf(tag), 1);
      },
      addTaste() {
        let taste = {
          tasteId: '',
          weight: '',
          barCode: '',
          imageUrl: ''
        }
        this.product.productTastes.push(taste)
      },
      setItem(index) {
        this.nowItem = index
      },
      uploadTaste(response, file, fileList) {
        this.product.productTastes[this.nowItem].imageUrl = response.response
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
      getCategory() {
        fetchCategoryList({}, 1, 100000).then(response => {
          this.categorys = response.response
        })
      },
      getBrandLabel() {
        fetchBrandLabelList({}, 1, 100000).then(response => {
          this.brandLabels = response.response
        })
      },
      save() {
        this.$refs['product'].validate(valid => {
          if (valid) {
            if (this.product.productTastes.length === 0) {
              this.$message.warning('商品至少新增一种口味!');
              return
            }
            if (this.product.categoryId) {
              this.product.categoryName = this.categorys.find((item) => {
                return item.id === this.product.categoryId
              }).categoryName
            }
            if (this.product.labelIdSelected.length > 0) {
              this.product.labelIds = this.product.labelIdSelected.join(',')
            } else {
              this.product.labelName = ''
              this.product.labelIds = ''
            }
            fetchProductSave(this.product).then(response => {
              if (response.code === 0) {
                this.saveLoading = false
                this.$message.success('保存成功')
                this.$emit('childMethod')
              } else {
                this.saveLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      uploadImg(productId) {
        this.uploadImgData.id = productId
        this.uploadDialogShow = true
        if (this.$refs.uploadImg) {
          this.$refs.uploadImg.clearFiles()
        }
      },
      handleImgRemove(file, fileList) {
        if (file.response) {
          this.product.imageList.splice(this.product.imageList.indexOf(file.response.response), 1)
        } else {
          this.product.imageList.splice(this.product.imageList.indexOf(file.url), 1)
        }
      },
      handleImgSuccess(response, file, fileList) {
        if (response.code === 0) {
          this.product.imageList.push(response.response)
          file.url = response.response
        }
      },
      open(theMessage) {
        this.$message({
          message: theMessage,
          duration: 2000,
          type: 'success'
        });
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
      }
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
