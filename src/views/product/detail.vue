<template>
  <el-form label-position="left" inline label-width="100px" class="product-table-expand">
    <el-form-item label="商品ID">
      <span>{{ product.id }}</span>
    </el-form-item>
    <el-form-item label="商品名称">
      <span>{{ product.productName }}</span>
    </el-form-item>
    <el-form-item label="商品分类">
      <span>{{ product.goodsCategorys }}</span>
    </el-form-item>
    <el-form-item label="商品展示类别">
      <span>{{ product.categoryName }}</span>
    </el-form-item>
    <el-form-item label="单位">
      <span>{{ product.spec }}</span>
    </el-form-item>
    <el-form-item label="规格">
      <span>{{ product.unit }}</span>
    </el-form-item>
    <el-form-item label="保质期">
      <span>{{ product.shelfLife }}</span>
    </el-form-item>
    <el-form-item label="商品标签">
      <span>{{ product.labelName }}</span>
    </el-form-item>
    <el-form-item label="商品描述">
      <span>{{ product.description }}</span>
    </el-form-item>
    <el-form-item label="商品口味">
      <span>{{ product.productTastesStr }}</span>
    </el-form-item>
    <el-form-item label="商品备注">
      <span>{{ product.note }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      product: {
        type: Object
      }
    },
    created() {

    },
    data() {
      return {

      }
    },
    methods: {
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
</style>
