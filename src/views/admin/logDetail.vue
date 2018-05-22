<template>
  <el-form label-position="left" inline label-width="100px" class="log-table-expand">
    <el-form-item label="日志类型">
        <span>{{log.type}}</span>
    </el-form-item>
    <el-form-item label="日志标题">
      <span>{{ log.title }}</span>
    </el-form-item>
    <el-form-item label="操作地址">
      <span>{{ log.remoteAddr}}</span>
    </el-form-item>
    <el-form-item label="硬件设备">
      <span>{{ log.userAgent }}</span>
    </el-form-item>
    <el-form-item label="请求路径">
      <span>{{ log.requestUri }}</span>
    </el-form-item>
    <el-form-item label="请求方式">
      <span>{{ log.method }}</span>
    </el-form-item>
    <el-form-item label="请求参数">
      <span>{{ log.params }}</span>
    </el-form-item>
    <el-form-item label="用户ID">
      <span>{{ log.createdBy }}</span>
    </el-form-item>
    <el-form-item label="创建时间">
      <span>{{ log.createdDate }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      log: {
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
.log-table-expand {
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
