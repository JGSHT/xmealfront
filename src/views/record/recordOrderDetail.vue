<template>
  <el-form label-position="left" inline label-width="105px" class="recordOrderDetail-table-expand">
    <el-form-item label="设备ID">
      <span>{{ recordOrder.machineId }}</span>
    </el-form-item>
    <el-form-item label="设备名称">
      <span>{{ recordOrder.machineName }}</span>
    </el-form-item>
    <el-form-item label="大区">
      <span>{{ recordOrder.companyName }}</span>
    </el-form-item>
    <el-form-item label="中心">
      <span>{{ recordOrder.regionName }}</span>
    </el-form-item>
    <el-form-item label="片区">
      <span>{{ recordOrder.officeName }}</span>
    </el-form-item>
    <el-form-item label="地址">
      <span>{{ recordOrder.address }}</span>
    </el-form-item>
    <el-form-item label="销售日期">
      <span>{{ recordOrder.paidDate }}</span>
    </el-form-item>
    <el-form-item label="订单ID">
      <span>{{ recordOrder.orderInfoId }}</span>
    </el-form-item>
    <el-form-item label="订单状态">
      <span>{{ recordOrder.status }}</span>
    </el-form-item>
    <el-form-item label="顾客手机号">
      <span>{{ recordOrder.mobile }}</span>
    </el-form-item>
    <el-form-item label="商品编码">
      <span>{{ recordOrder.barCard }}</span>
    </el-form-item>
    <el-form-item label="商品ID">
      <span>{{ recordOrder.productId }}</span>
    </el-form-item>
    <el-form-item label="商品名称">
      <span>{{ recordOrder.productName }}</span>
    </el-form-item>
    <el-form-item label="商品保质期">
      <span>{{ recordOrder.shelfLife }}</span>
    </el-form-item>
    <el-form-item label="商品品类">
      <span>{{ recordOrder.categoryName }}</span>
    </el-form-item>
    <el-form-item label="购买数量">
      <span>{{ recordOrder.count }}</span>
    </el-form-item>
    <el-form-item label="商品售价">
      <span>{{ recordOrder.productSalePrice }}</span>
    </el-form-item>
    <el-form-item label="商品折后价">
      <span>{{ recordOrder.orderSalePrice }}</span>
    </el-form-item>
    <el-form-item label="支付金额">
      <span>{{ recordOrder.totalPrice }}</span>
    </el-form-item>
    <el-form-item label="支付类型">
      <span>{{ recordOrder.paidType }}</span>
    </el-form-item>
    <el-form-item label="商品进价">
      <span>{{ recordOrder.purchasePrice }}</span>
    </el-form-item>
    <el-form-item label="毛利润">
      <span>{{ recordOrder.grossProfit }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      recordOrder: {
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
.recordOrderDetail-table-expand {
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
