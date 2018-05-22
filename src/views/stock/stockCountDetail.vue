<template>
  <el-form label-position="left" inline label-width="100px" class="stockCount-table-expand">
    <el-input id="machineId" type="hidden" >{{ stockCount.machineId}}</el-input>
    <el-form-item label="设备ID">
      <span>{{ stockCount.machineId }}</span>
    </el-form-item>
    <el-form-item label="设备名称">
      <span>{{ stockCount.machineName }}</span>
    </el-form-item>
    <el-form-item label="大区">
      <span>{{ stockCount.companyName }}</span>
    </el-form-item>
    <el-form-item label="设备商品亏损总数">
      <span>{{ stockCount.lossNumber }}</span>
    </el-form-item>
    <el-form-item label="设备商品亏损进价总额">
      <span>{{ stockCount.lossPurchaseAmount }}</span>
    </el-form-item>
    <el-form-item label="设备商品亏损售价总额">
      <span>{{ stockCount.lossSaleAmount }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      stockCount: {
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
.stockCount-table-expand {
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
