<template>
  <el-form label-position="left" inline label-width="100px" class="branch-table-expand">
    <el-form-item label="公司名称">
      <span>{{ branch.companyName }}</span>
    </el-form-item>
    <el-form-item label="人数">
      <span>{{ branch.peopleNumber }}</span>
    </el-form-item>
    <el-form-item label="年龄层">
      <span>{{ branch.ageGroup}}</span>
    </el-form-item>
    <el-form-item label="男女比例">
      <span>{{ branch.ratio }}</span>
    </el-form-item>
    <el-form-item label="上班时间">
      <span>{{ branch.workBeginTime }}</span>
    </el-form-item>
    <el-form-item label="下班时间">
      <span>{{ branch.workEndTime }}</span>
    </el-form-item>
    <el-form-item label="晚上是否加班">
      <span>{{ branch.nightWork }}</span>
    </el-form-item>
    <el-form-item label="周末是否加班">
      <span>{{ branch.weekendWork }}</span>
    </el-form-item>
    <el-form-item label="公司地址">
      <span>{{ branch.companyAddress }}</span>
    </el-form-item>
    <el-form-item label="楼宇名称">
      <span>{{ branch.buildingName }}</span>
    </el-form-item>
    <el-form-item label="设备台数">
      <span>{{ branch.machineNumber }}</span>
    </el-form-item>
    <el-form-item label="设备型号">
      <span>{{ branch.machineType }}</span>
    </el-form-item>
    <el-form-item label="设备放置点">
      <span>{{ branch.machinePosition }}</span>
    </el-form-item>
    <el-form-item label="联系人">
      <span>{{ branch.linkman }}</span>
    </el-form-item>
    <el-form-item label="手机号码">
      <span>{{ branch.mobile }}</span>
    </el-form-item>
    <el-form-item label="隶属区域">
      <span>{{ branch.area }}</span>
    </el-form-item>
    <el-form-item label="备注">
      <span>{{ branch.note }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      branch: {
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
.branch-table-expand {
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
