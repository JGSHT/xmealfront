<template>
  <el-form label-position="left" inline label-width="100px" class="machine-table-expand">
    <el-input id="machineId" type="hidden" >{{ machine.id}}</el-input>
    <el-form-item label="设备ID">
      <span>{{ machine.id }}</span>
    </el-form-item>
    <el-form-item label="设备名称">
      <span>{{ machine.machineName }}</span>
    </el-form-item>
    <el-form-item label="所在地">
      <span>{{ machine.preAddress }}</span>
    </el-form-item>
    <el-form-item label="大区">
      <span>{{ machine.companyName }}</span>
    </el-form-item>
    <el-form-item label="中心">
      <span>{{ machine.regionName }}</span>
    </el-form-item>
    <el-form-item label="片区">
      <span>{{ machine.officeName }}</span>
    </el-form-item>
    <el-form-item label="地址">
      <span>{{ machine.address }}</span>
    </el-form-item>
    <el-form-item label="安装时间">
      <span>{{ machine.installDate }}</span>
    </el-form-item>
    <el-form-item label="加盟商">
      <span>{{ machine.name }}</span>
    </el-form-item>
    <el-form-item label="站点">
      <span>{{ machine.stationName }}</span>
    </el-form-item>
    <el-form-item label="设备类型">
      <span>{{ machine.dtName }}</span>
    </el-form-item>
    <el-form-item label="商城地址">
      <span>{{ machine.qrcode }}</span>
    </el-form-item>
    <el-form-item label="撤点原因">
      <span>{{ machine.revocation }}</span>
    </el-form-item>
    <el-form-item label="网点名称">
      <span>{{ machine.branchName }}</span>
    </el-form-item>
    <el-form-item label="人数">
      <span>{{ machine.peopleNumber }}</span>
    </el-form-item>
    <el-form-item label="年龄层">
      <span>{{ machine.ageGroup}}</span>
    </el-form-item>
    <el-form-item label="男女比例">
      <span>{{ machine.ratio }}</span>
    </el-form-item>
    <el-form-item label="上班时间">
      <span>{{ machine.workBeginTime }}</span>
    </el-form-item>
    <el-form-item label="下班时间">
      <span>{{ machine.workEndTime }}</span>
    </el-form-item>
    <el-form-item label="晚上是否加班">
      <span>{{ machine.nightWork }}</span>
    </el-form-item>
    <el-form-item label="周末是否加班">
      <span>{{ machine.weekendWork }}</span>
    </el-form-item>
    <el-form-item label="公司地址">
      <span>{{ machine.companyAddress }}</span>
    </el-form-item>
    <el-form-item label="楼宇名称">
      <span>{{ machine.buildingName }}</span>
    </el-form-item>
    <el-form-item label="设备台数">
      <span>{{ machine.machineNumber }}</span>
    </el-form-item>
    <el-form-item label="设备型号">
      <span>{{ machine.machineType }}</span>
    </el-form-item>
    <el-form-item label="设备放置点">
      <span>{{ machine.machinePosition }}</span>
    </el-form-item>
    <el-form-item label="联系人">
      <span>{{ machine.linkman }}</span>
    </el-form-item>
    <el-form-item label="手机号码">
      <span>{{ machine.mobile }}</span>
    </el-form-item>
    <el-form-item label="隶属区域">
      <span>{{ machine.area }}</span>
    </el-form-item>
    <el-form-item label="备注">
      <span>{{ machine.note }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      machine: {
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
.machine-table-expand {
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
