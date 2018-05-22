<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName"
             @tab-click="selectTab">
      <el-tab-pane name="machineList">

        <span slot="label"><i class="el-icon-document"></i> 设备列表</span>
        <el-form :model="replenishmentSearchForm" ref="replenishmentSearchForm" class="demo-form-inline"
                 label-width="75px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="机构" prop="parentIdList" label-width="11%">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="replenishmentSearchForm.parentIdList"
                  :props="cascaderProps"
                  change-on-select
                  :clearable="true"
                  placeholder="请选择机构"
                  style="width:100%"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" placeholde="请选择状态" prop="replenishmentStatus" label-width="15%">
                <el-select v-model="replenishmentSearchForm.replenishmentStatus" clearable filterable
                           style="width: 98%">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="营业额" prop="minTurnover"
                            style="width: 40%;float: left" label-width="37%">
                <input v-model="replenishmentSearchForm.minTurnover"
                       placeholder="最小营业额"
                       class="el-input__inner"
                       onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')"
                       onafterpaste="this.value=this.value.replace(/[^\d\.]/g,'')"
                       v-on:blur="checkEffectiveness(0)"/>
              </el-form-item>
              <el-form-item prop="maxTurnover"
                            style="float: left;width: 40%;margin-left: 20px"
                            label="~"
                            label-width="30px">
                <input v-model="replenishmentSearchForm.maxTurnover"
                       placeholder="最大营业额"
                       class="el-input__inner"
                       onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')"
                       onafterpaste="this.value=this.value.replace(/[^\d\.]/g,'')"
                       v-on:blur="checkEffectiveness(0)"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="时间" prop="dateTime" label-width="11%">
                <el-date-picker
                  v-model="replenishmentSearchForm.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOption"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="replenishmentSearchForm.machineName"
                          placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备地址" prop="address">
                <el-input v-model="replenishmentSearchForm.address"
                          placeholder="请输入设备地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="站点" prop="station" label-width="20%">
                <el-select v-model="replenishmentSearchForm.station"
                           placeholder="请选择站点"
                           clearable>
                  <el-option
                    v-for="item in stationList"
                    :key="item.id"
                    :label="item.stationName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="19">
              <el-form-item>
                <el-button type="primary" round icon="el-icon-search" @click="search" style="margin-left: -40px">查询
                </el-button>
                <el-button @click="resetForm('replenishmentSearchForm')" round icon="el-icon-delete">重置
                </el-button>
                <el-button @click="replenishmentAndExport" :loading="replenishmentLoading" round icon="el-icon-plus">补货
                </el-button>
                <el-button @click="batchConfirm"
                           :loading="confirmLoading"
                           round
                           icon="el-icon-minus">批量确认收货
                </el-button>
                <el-button @click="exportMachinesReplenishmentTwice"
                           :loading="exportLoading"
                           round
                           icon="el-icon-share">导出未确认收货配货单
                </el-button>
                <el-popover
                  ref="popover5"
                  placement="bottom"
                  width="320px"
                  trigger="click"
                  v-model="popoverVisible">
                  <p style="font-weight: bolder;">设置补货单保留项</p>
                  <div style="margin-left: 0; width: 300px">
                    <el-checkbox-group v-model="checkedSet" @change="changeSelect">
                      <el-checkbox v-for="set in sets" :label="set" :key="set">{{set}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-popover>
                <el-button v-popover:popover5 icon="el-icon-edit-outline" round>设置补货单导出选项</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-tooltip content="双击某一行修改某台设备的补货数量" placement="top-end" effect="light">
          <el-table
            v-loading.body="replenishmentListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="replenishment"
            stripe
            border
            highlight-current-row
            @selection-change="selectChange"
            ref="replenishmentRef"
            @row-dblclick="handleAlterProductNum"
            style="width: 100%">
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              prop="replenishmentStatus"
              label="状态"
              width="100"
              align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.replenishmentStatus === '未补货' ? 'primary' : 'danger'"
                  close-transition>{{scope.row.replenishmentStatus}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="machineName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="turnover" label="距上次补货营业额" align="center"
                             :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="lastReplenishmentDate" label="上次补货时间" align="center"
                             :formatter="formatterDateTime" show-overflow-tooltip></el-table-column>
            <el-table-column prop="preAddress" label="所在地" align="center"></el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="stationName" label="站点" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope" align="center">
                <el-button @click="showSaleCondition(scope.row)" type="text" size="small">距上次补货销售情况</el-button>
                <el-button @click="handlerConfirm(scope.row)" :disabled="scope.row.replenishmentStatus === '未补货'"
                           type="text" size="small">确认收货
                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tooltip>
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
      </el-tab-pane>

      <el-tab-pane name="replenishmentProductList">
        <span slot="label"><i class="el-icon-edit"></i> 商品列表</span>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="selectList.length === 0" style="line-height: 36px;font-weight: bolder;font-size: large">请先选择要补货的设备</span>
            <span v-if="selectList.length != 0"
                  style="line-height: 36px;font-weight: bolder;font-size: large">当前勾选的{{selectList.length}}台设备上所有需要补货的商品</span>

          </div>
          <el-input :disabled="selectList.length === 0" v-model="replenishmentProductListSelects"
                    placeholder="输入商品名称进行筛选"
                    style="line-height: 36px; height: 36px; margin-bottom: 20px"
                    v-on:change="replenishmentProductListSelectChange"></el-input>
          <el-table
            v-loading.body="replenishmentProductListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="replenishmentProductListResult"
            stripe
            border
            highlight-current-row
            style="width: 100%">
            <el-table-column prop="productId" label="商品编号" align="center"></el-table-column>
            <el-table-column prop="productName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="tasteName" label="口味名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="count" label="所需数量" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope" align="center">
                <el-button @click="showChangeReplenishmentCount(scope.row)" type="text" size="small">批量修改数量</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane name="replenishmentHistory">
        <span slot="label"><i class="el-icon-time"></i>补货单历史纪录</span>
        <el-form :model="replenishmentHistorySearchForm"
                 ref="replenishmentHistorySearchForm"
                 class="demo-form-inline"
                 label-position="left"
                 label-width="75px">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="补货时间" prop="dateTime">
                <div class="block">
                  <el-date-picker
                    v-model="replenishmentHistorySearchForm.dateTime"
                    type="datetimerange"
                    placeholder="请选择时间范围"
                    align="right"
                    style="width:108%">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6" :push="1">
              <el-form-item label="批次号" prop="batchId" label-width="20%">
                <el-tooltip class="item" effect="light"
                            content="批次号格式:20170927XX,前八位为补货时间年月日,接下来六位为时分秒,最后的为用户自身ID，支持模糊搜索"
                            placement="top">
                  <el-input v-model="replenishmentHistorySearchForm.batchId"
                            placeholder="请输入批次号"
                            style="width:100%"></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="7" :push="1">
              <el-form-item label="设备名称" prop="machineName" label-width="23%">
                <el-input v-model="replenishmentHistorySearchForm.machineName"
                          placeholder="请输入设备名称"
                          style="width:100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="货值" prop="minProductValue" style="float: left;width: 40%" label-width="30%">
                <input v-model="replenishmentHistorySearchForm.minProductValue"
                       placeholder="最小货值"
                       class="el-input__inner"
                       onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')"
                       onafterpaste="this.value=this.value.replace(/[^\d\.]/g,'')"
                       v-on:blur="checkEffectiveness(1)"/>
              </el-form-item>
              <el-form-item prop="maxProductValue" label="~" style="float: left;margin-left: 20px;width: 50%"
                            label-width="13%">
                <input v-model="replenishmentHistorySearchForm.maxProductValue"
                       placeholder="最大货值"
                       class="el-input__inner"
                       style="width: 50%"
                       onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')"
                       onafterpaste="this.value=this.value.replace(/[^\d\.]/g,'')"
                       v-on:blur="checkEffectiveness(1)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" placeholde="请选择状态" prop="replenishmentStatus" label-width="15%">
                <el-select v-model="replenishmentHistorySearchForm.replenishmentStatus" style="width: 100%" clearable filterable>
                  <el-option
                    v-for="item in sendStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品名称" prop="productName" label-width="25%">
                <el-input v-model="replenishmentHistorySearchForm.productName"
                          placeholder="请输入商品名称"
                          style="width:120%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
             <el-form-item label="单号" prop="id" label-width="20%">
               <el-input v-model="replenishmentHistorySearchForm.id"
                        placeholder="请输入单据号(补货单号)"
                        style="width:120%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item>
                <el-button type="primary" round icon="el-icon-search" @click="searchReplenishmentHistory">查询</el-button>
                <el-button @click="resetForm('replenishmentHistorySearchForm')" round icon="el-icon-delete">重置
                </el-button>
                <el-button @click="exportReplenishmentTwice" :loading="exportReplenishmentTwiceLoading" round
                           icon="el-icon-share">导出配货表
                </el-button>
                <el-button @click="exportDifference" :loading="exportDifferenceLoading" round
                           icon="el-icon-share">导出补货单与出库单差异
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-tooltip content="双击显示各详情" placement="top-end" effect="light">
          <el-table
            v-loading.body="replenishmentHistoryListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="replenishmentHistoryList"
            stripe
            border
            highlight-current-row
            @selection-change="selectReplenishmentHistoryListChange"
            @row-dblclick="showReplenishmentHistoryDetail"
            style="width: 100%">
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              align="center"
              width="100%">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'success' : scope.row.status === 3 ? 'primary' : 'danger'"
                  close-transition>{{ scope.row.status === 1 ? '已送达' : scope.row.status === 3 ? '审核通过' : '待审核' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="补货单号" align="center"></el-table-column>
            <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
            <el-table-column prop="batchId" label="批次号" align="center"></el-table-column>
            <el-table-column prop="productValue" label="货值" align="center"
                             :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="grossSales" label="理论销售金额" :formatter="formatterMoney"
                             align="center"></el-table-column>
            <el-table-column prop="createdDate" label="补货时间" align="center"
                             :formatter="formatterDateTime"></el-table-column>
          </el-table>
        </el-tooltip>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleReplenishmentHistoryTableSizeChange"
            @current-change="handleReplenishmentHistoryTableCurrentChange"
            :current-page="replenishmentPage"
            :page-sizes="replenishmentSizes"
            :page-size="replenishmentSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="replenishmentTotal">
          </el-pagination>
        </p>
      </el-tab-pane>

      <el-tab-pane name="replenishmentProductStatistics">
        <span slot="label">
          <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
               viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="448"><path
            d="M780.192 999.68H243.936a170.88 170.88 0 0 1-170.688-170.752V170.688A170.88 170.88 0 0 1 243.936 0h536.256a170.88 170.88 0 0 1 170.752 170.688v170.688a24.448 24.448 0 0 1-48.832 0V170.688c0-67.2-54.656-121.856-121.92-121.856H243.936c-67.2 0-121.92 54.656-121.92 121.856v658.304c0 67.2 54.656 121.984 121.92 121.984h536.256a122.112 122.112 0 0 0 121.92-121.984V633.856a24.448 24.448 0 0 1 48.832 0v195.072a170.88 170.88 0 0 1-170.752 170.752z"
            fill="#4D4D4D" p-id="449"></path><path
            d="M170.784 292.544H24.48a24.32 24.32 0 1 1 0-48.704h146.304a24.32 24.32 0 1 1 0 48.704zM170.784 438.848H24.48a24.32 24.32 0 1 1 0-48.704h146.304a24.32 24.32 0 1 1 0 48.704zM170.784 585.152H24.48a24.384 24.384 0 0 1 0-48.832h146.304a24.448 24.448 0 0 1 0 48.832zM170.784 731.392H24.48a24.384 24.384 0 0 1 0-48.768h146.304a24.448 24.448 0 0 1 0 48.768zM926.56 633.856h-170.56a97.664 97.664 0 0 1-97.536-97.536V438.848c0-53.76 43.776-97.536 97.536-97.536h170.56c53.76 0 97.536 43.84 97.536 97.536V536.32c0 53.824-43.776 97.536-97.536 97.536z m-170.56-243.712a48.832 48.832 0 0 0-48.832 48.768V536.32c0 26.944 21.888 48.768 48.832 48.768h170.56a48.832 48.832 0 0 0 48.832-48.768V438.848a48.832 48.832 0 0 0-48.832-48.768h-170.56z"
            fill="#4D4D4D" p-id="450"></path></svg> 商品出货记录</span>
        <el-form :model="replenishmentStatisticsSearchForm"
                 ref="replenishmentStatisticsSearchForm"
                 class="demo-form-inline"
                 label-position="left"
                 label-width="68px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="配货时间" prop="dateTime">
                <div class="block">
                  <el-date-picker
                    v-model="replenishmentStatisticsSearchForm.dateTime"
                    type="datetimerange"
                    placeholder="请选择时间范围"
                    align="right"
                    style="width:115%">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6" :push="2">
              <el-form-item label="设备名称" prop="batchId">
                <el-input v-model="replenishmentStatisticsSearchForm.machineName"
                          placeholder="请输入设备名称"
                          style="width:100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :push="3">
              <el-form-item label="商品名称" prop="productName">
                <el-input v-model="replenishmentStatisticsSearchForm.productName"
                          placeholder="请输入商品名称"
                          style="width:100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="批次号" prop="batchId" label-width="23%">
                <el-tooltip class="item"
                            effect="light"
                            content="批次号格式:20170927XX,前八位为补货时间年月日,接下来六位为时分秒,最后的为用户自身ID，支持模糊搜索"
                            placement="top">
                  <el-input v-model="replenishmentStatisticsSearchForm.batchId"
                            placeholder="请输入批次号"
                            style="width:100%"></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8" :push="1">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="searchReplenishmentStatisticsList">查询
                </el-button>
                <el-button @click="resetForm('replenishmentStatisticsSearchForm')" round icon="el-icon-delete">重置
                </el-button>
                <el-button @click="exportReplenishmentStatisticsList" :loading="exportStatisticsLoading" round
                           icon="el-icon-share">导出
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">

          </el-row>
        </el-form>

        <el-tooltip content="双击显示各详情" placement="top-end" effect="light">
          <el-table v-loading.body="replenishmentStatisticsListLoading"
                    element-loading-text="小喵使出了洪荒之力为您加载。。。"
                    :data="replenishmentStatisticsList"
                    stripe
                    border
                    highlight-current-row
                    @row-dblclick="showStatisticsProductInMachine"
                    style="width: 100%">
            <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="tasteName" label="口味名称" align="center"></el-table-column>
            <el-table-column prop="categoryName" label="品类" align="center"></el-table-column>
            <el-table-column prop="barCode" label="条码" align="center"></el-table-column>
            <el-table-column prop="count" label="数量" align="center"></el-table-column>
          </el-table>
        </el-tooltip>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleReplenishmentStatisticsSizeChange"
            @current-change="handleReplenishmentStatisticsCurrentChange"
            :current-page="replenishmentStatisticsPage"
            :page-sizes="replenishmentStatisticsSizes"
            :page-size="replenishmentStatisticsSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="replenishmentStatisticsTotal">
          </el-pagination>
        </p>

      </el-tab-pane>
    </el-tabs>

    <!--弹出设备销售情况-->
    <el-dialog title="设备距上次补货商品销售情况"
               :visible.sync="dialogTableVisible">
      <el-table
        v-loading.body="replenishmentDetailLoading"
        element-loading-text="小喵使出了吃奶的力为您加载。。。"
        border
        stripe
        highlight-current-row
        :data="replenishmentDetailList">
        <el-table-column prop="productName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tasteName" label="口味名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="count" label="销量" align="center"></el-table-column>
      </el-table>
    </el-dialog>

    <!--弹出设备补货配送情况-->
    <el-dialog :title="conditionDialogMachineName"
               :visible.sync="replenishmentConditionVisible"
               :before-close="closeConditionDialog">
      <div style="overflow:scroll; height: 450px;">
        <el-card class="box-card" v-for="item in replenishmentCondition" :key="item.batchId"
                 style="margin-bottom: 20px">
          <div style="height: 20px;">
            <span style="line-height: 20px;"><strong>批次号:</strong>{{item.batchId}}</span>
            <el-tag :type="item.status === 0 ? 'danger' : item.status === 3 ? 'warning' : ''">{{item.status === 0 ? '待审核' : item.status === 3 ? '审核通过' : '已送达'}}</el-tag>
            <el-button @click="exportOneMachineTwice(item.batchId)"
                       style="float: right;margin-bottom: 10px;margin-left: 20px"
                       round
                       icon="el-icon-share"
                       :loading="exportTwiceLoading"
                       type="primary">导出配货表
            </el-button>
            <el-button @click="confirmOne(item.batchId)"
                       :disabled="replenishmentHistoryCondition.status !== 3"
                       round
                       style="float: right;margin-bottom: 10px;"
                       type="primary">
              确认收货
            </el-button>
          </div>
          <el-table :data="item.details"
                    stripe
                    border
                    highlight-current-row
                    style="width: 100%;">
            <el-table-column property="productName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="tasteName" label="口味名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="count" label="数量" align="center"></el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-dialog>

    <!--弹出设备历史补货情况-->
    <el-dialog :title="replenishmentHistoryConditionTitle"
               :visible.sync="replenishmentHistoryConditionVisible"
               :before-close="closeReplenishmentHistoryConditionDialog">
      <el-card class="box-card" style="margin-bottom: 20px">
        <div style="height: 20px;">
          <span style="line-height: 20px;"><strong>批次号:</strong>{{replenishmentHistoryCondition.batchId}}</span>
          <el-tag :type="replenishmentHistoryCondition.status === 0 ? 'danger' : replenishmentHistoryCondition.status === 3 ? 'warning' : ''">{{replenishmentHistoryCondition.status === 0 ? '待审核' : replenishmentHistoryCondition.status === 3 ? '审核通过' : '已送达'}}</el-tag>
          <el-button @click="exportOneMachineTwice(replenishmentHistoryCondition.batchId)"
                     style="float: right;margin-bottom: 5px;margin-left: 20px"
                     round
                     icon="el-icon-show"
                     :loading="exportTwiceLoading"
                     type="primary">导出配货表
          </el-button>
          <el-button v-if="replenishmentHistoryCondition.status !== 1"
                     :disabled="replenishmentHistoryCondition.status !== 3"
                     @click="confirmOne(replenishmentHistoryCondition.batchId)"
                     style="float: right;margin-bottom: 5px;" round type="primary">确认收货
          </el-button>
        </div>
        <el-table :data="replenishmentHistoryCondition.details"
                  stripe
                  border
                  highlight-current-row
                  style="width: 100%;">
          <el-table-column property="productName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="tasteName" label="口味名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column property="count" label="数量" align="center"></el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <!--修改某台设备补货数量-->
    <el-dialog title="补货清单"
               :visible.sync="replenishmentListDialogTableVisible"
               style="">
      <div style="height: 500px;overflow-y: scroll">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="float: left;line-height: 50px;font-size: 17px">
              <b>当前设备:</b>
              {{machineName}}
            </span>
            <span style="float:left; margin-left: 20px;line-height: 50px;font-size: 17px">
              <b>所属站点:</b>
              {{stationName}}
            </span>
            <span style="float:left; margin-left: 20px;;line-height: 50px;font-size: 17px">
              <b>距上次补货营业额:</b>
              {{turnover}}元
            </span>
            <el-button :disabled="selectProducts.length <= 0" @click="updateMachineConfirmAdd" round icon="el-icon-edit"
                       type="primary" style="float: right;margin-top: 8px">批量修改
            </el-button>
          </div>
          <div style="height: 0px;clear: left"></div>
          <el-input v-model="productSelect"
                    placeholder="输入商品名称进行筛选"
                    style="margin-bottom: 20px;"
                    v-on:change="productSelectChange"></el-input>
          <el-table
            v-loading.body="replenishmentCountLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="replenishmentCountListResult"
            stripe
            border
            highlight-current-row
            @selection-change="handleProductSelectionChange"
            style="width: 100%;">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column property="productId" label="商品编号" align="center"></el-table-column>
            <el-table-column property="productName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="tasteName" label="口味名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column property="stock" label="库存" align="center"></el-table-column>
            <el-table-column property="onwayStock" label="在途库存" align="center"></el-table-column>
            <el-table-column property="adviceAddCount" label="建议补货量" align="center"></el-table-column>
            <el-table-column property="confirmAddCount" label="确认补货量" align="center">
              <template slot-scope="scope" align="center">
                <el-input id="a"
                          type="number"
                          v-model="scope.row.confirmAddCount"
                          ref="cac"
                          @blur="check(scope.row)"
                          pattern="^[1-9]\d*|0$"
                          style=" text-align: center"
                          min="0" step="1" max="9999"></el-input>
                <span property="newConfirmAddCount" style="display: none">{{ scope.row.newConfirmAddCount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-dialog>

    <!--修改勾选的设备上所有有这种商品的补货数量-->
    <el-dialog title="修改商品补货数量"
               :visible.sync="changeProductInMachinesDialogVisible"
               :before-close="closeChangeProductInMachinesDialog">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;font-size: 20px">{{selectProductName + '(' + selectTasteName + ')'}}</span>
          <el-button @click="updateConfirmAddCountNumber" style="float: right;"
                     :disabled="productInMachineSelect.length === 0" round icon="el-icon-edit" type="primary">批量修改
          </el-button>
        </div>
        <el-input v-model="productSelectTwo" placeholder="输入设备名称进行筛选"
                  style="margin-bottom: 10px;line-height: 50px"
                  v-on:change="productSelectTwoChange"></el-input>
        <el-table
          v-loading.body="changeProductInMachinesDialogMachineListLoading"
          element-loading-text="小喵使出了洪荒之力为您加载。。。"
          :data="changeProductInMachinesDialogMachineList"
          stripe
          border
          highlight-current-row
          @selection-change="changeProductInMachinesDialogMachineListSelectChange"
          ref="changeProductInMachinesDialogMachineListRef"
          style="width: 100%">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="machineId" label="设备编号" align="center"></el-table-column>
          <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
          <el-table-column prop="adviceAddCount" label="建议补货数量" align="center"></el-table-column>
          <el-table-column prop="confirmAddCount" label="确认补货量" align="center">
            <template slot-scope="scope" align="center">
              <el-input id="a" type="number" v-model="scope.row.confirmAddCount" ref="cac" @blur="checkTwo(scope.row)"
                        pattern="^[1-9]\d*|0$" style=" text-align: center"
                        min="0" step="1" max="9999"></el-input>
              <span property="newConfirmAddCount" style="display: none">{{ scope.row.newConfirmAddCount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <!--配货统计之显示某一商品在各设备上的配货统计-->
    <el-dialog title="商品配货统计"
               :visible.sync="productStatisticsInMachinesDialogVisible">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;font-size: 20px">{{statisticsSelectProduct.productName + '(' + statisticsSelectProduct.tasteName + ')'}}</span>
          <span style="line-height: 36px;font-size: 20px;margin-left: 10px"
                v-if="statisticsSelectProduct.productNumber">出货量:{{statisticsSelectProduct.productNumber}}</span>
        </div>
        <el-table v-loading.body="productStatisticsInMachinesListLoading"
                  element-loading-text="小喵使出了洪荒之力为您加载。。。"
                  :data="productStatisticsInMachinesList"
                  stripe
                  border
                  highlight-current-row
                  style="width: 100%">
          <el-table-column prop="machineId" label="设备编号" align="center"></el-table-column>
          <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
          <el-table-column prop="count" label="数量" align="center"></el-table-column>
        </el-table>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleProductStatisticsInMachinesSizeChange"
            @current-change="handleProductStatisticsInMachinesCurrentChange"
            :current-page="productStatisticsInMachinesPage"
            :page-sizes="productStatisticsInMachinesSizes"
            :page-size="productStatisticsInMachinesSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="productStatisticsInMachinesTotal">
          </el-pagination>
        </p>
      </el-card>
    </el-dialog>

    <!--选择货舱-->
    <el-dialog title="请选择仓库" :visible.sync="dialogStockVisible" style="margin-top:10%;height: 300px">
      <label style="margin-left: 25%"><strong>货仓:</strong></label>
      <el-select v-model="stock" clearable placeholder="请选择">
        <el-option
          v-for="item in stockList"
          :key="item.id"
          :label="item.stockName"
          :value="item.id"
          :before-close="handleStockClose">
        </el-option>
      </el-select>
      <el-button @click="sureReplenishment" round style="margin-left: 20px">确认补货</el-button>
    </el-dialog>

    <a id="getExcel" style="display: none"></a>
  </div>
</template>
<script>
  import {
    confirmProduct,
    exportExcelTwice, exportReplenishmentStatistics, fetchExportDifference,
    fetchReplenishment,
    fetchReplenishmentAndExportExcel, fetchReplenishmentStatisticsList,
    fetchSaleCondition, fetchStatisticsProductInMachine,
    fetchStockInfo,
    fetchUpdateConfirmAddCount,
    fetchUpdateConfirmAddCountByMachineIds, fetchUpdateConfirmAddCountByProducts,
    getAllProductInMachine,
    getChangeReplenishmentCount,
    getMachineProduct,
    getReplenishmentHistoryDetail,
    getReplenishmentHistoryList,
    showReplenishmentCondition
  } from '../../api/replenishment';
  import { fetchOfficeTree } from '../../api/office';
  import { fetchStations } from '../../api/station';
  import ElFormItem from 'element-ui/packages/form/src/form-item';
  import {dealDateTime} from "../../api/discount";

  const setOptions = ['条形码', '二维码', '添加商品汇总', '地址汇总'];
  export default {
    components: { ElFormItem },
    created() {
      this.search();
      this.fetchOfficeCasc();
      this.getStationList();
      const data = window.localStorage.getItem('replenishmentSet');
      if (data != null) {
        const arr = data.split(',');
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] !== '') {
            this.checkedSet.push(arr[i]);
          }
        }
      } else if (data == null) {
        this.checkedSet = setOptions;
        window.localStorage.setItem('replenishmentSet', this.checkedSet.toString());
      }
    },
    data() {
      return {
        replenishmentSearchForm: {
          address: '',
          machineName: '',
          parentIdList: [],
          station: '',
          minTurnover: '',
          maxTurnover: '',
          dateTime: '',
          replenishmentStatus: ''
        },
        replenishmentHistorySearchForm: {
          id: '',
          productName: '',
          batchId: '',
          machineName: '',
          dateTime: '',
          minProductValue: '',
          maxProductValue: '',
          replenishmentStatus: ''
        },
        replenishmentStatisticsSearchForm: {
          dateTime: '',
          batchId: '',
          machineName: '',
          productName: ''
        },
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        ignoreStock: false,
        productSelect: '',
        productSelectTwo: '',
        replenishmentProductListSelects: '',
        activeName: 'machineList',
        sets: setOptions,
        checkedSet: [],
        replenishmentCountListResult: [],
        offices: [],
        stationList: [],
        replenishment: [],
        replenishmentHistoryList: [],
        replenishmentCountList: [],
        replenishmentDetailList: [],
        replenishmentProductList: [],
        productStatisticsInMachinesList: [],
        replenishmentProductListResult: [],
        replenishmentStatisticsList: [],
        stockList: [],
        selectList: [],
        productInMachineSelect: [],
        selectReplenishmentHistoryList: [],
        replenishmentCondition: [],
        changeProductInMachinesDialogMachineList: [],
        changeProductInMachinesDialogMachineListResult: [],
        replenishmentMachine: [],
        replenishmentHistoryCondition: {
          batchId: '',
          status: '',
          details: []
        },
        currentRow: '',
        stock: '',
        machineName: '尚未选择任何设备',
        stationName: '尚未选择任何设备',
        machineId: '',
        turnover: '0',
        witchMachineCondition: '',
        conditionDialogMachineName: '',
        currentRowMachineId: '',
        replenishmentCountListSize: 'large',
        selectProductName: '',
        statisticsSelectProduct: {
          productName: '',
          productId: '',
          tasteName: '',
          tasteId: '',
          productNumber: ''
        },
        status: [{
          value: '全部',
          label: '全部'
        }, {
          value: '补货中',
          label: '补货中'
        }, {
          value: '未补货',
          label: '未补货'
        }],
        sendStatus: [{
          value: '全部',
          label: '全部'
        }, {
          value: '待审核',
          label: '待审核'
        }, {
          value: '审核通过',
          label: '审核通过'
        }, {
          value: '送达',
          label: '送达'
        }],
        selectProductId: '',
        selectTasteId: '',
        selectTasteName: '',
        selectProducts: [],
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100, 200, 500],
        replenishmentPage: 1,
        replenishmentSizes: [10, 20, 50, 100, 200],
        replenishmentSize: 10,
        replenishmentTotal: 0,
        replenishmentStatisticsPage: 1,
        replenishmentStatisticsSizes: [10, 20, 50, 100, 200],
        replenishmentStatisticsSize: 10,
        replenishmentStatisticsTotal: 0,
        productStatisticsInMachinesSizes: [10, 20, 50, 100, 200],
        productStatisticsInMachinesPage: 1,
        productStatisticsInMachinesSize: 10,
        productStatisticsInMachinesTotal: 0,
        replenishmentHistoryConditionTitle: '',
        officeDisabled: false,
        exportLoading: false,
        exportTwiceLoading: false,
        replenishmentLoading: false,
        confirmLoading: false,
        exportStatisticsLoading: false,
        replenishmentListLoading: false,
        replenishmentCountLoading: false,
        replenishmentDetailLoading: false,
        productStatisticsInMachinesListLoading: false,
        replenishmentStatisticsListLoading: false,
        replenishmentProductListLoading: false,
        replenishmentHistoryListLoading: false,
        exportReplenishmentTwiceLoading: false,
        exportDifferenceLoading: false,
        changeProductInMachinesDialogMachineListLoading: false,
        popoverVisible: false,
        dialogStockVisible: false,
        dialogTableVisible: false,
        replenishmentConditionVisible: false,
        changeProductInMachinesDialogVisible: false,
        replenishmentListDialogTableVisible: false,
        replenishmentHistoryConditionVisible: false,
        productStatisticsInMachinesDialogVisible: false,
        canSearch: true,
        canSearchReplenishmentHistory: true,
        // 初始化时间快捷选项
        pickerOption: {
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setHours(0, 0, 0, 0);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              end.setHours(23, 59, 59, 999);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '今天',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setHours(0, 0, 0, 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 182);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      search() {
        if (this.canSearch !== false) {
          let officeId = null;
          let regionId = null;
          let companyId = null;
          let ad = null;
          let ma = null;
          let bd = null;
          let ed = null;
          if (this.replenishmentSearchForm.length !== 0) {
            if (this.replenishmentSearchForm.parentIdList.length === 3) {
              companyId = this.replenishmentSearchForm.parentIdList[0];
              regionId = this.replenishmentSearchForm.parentIdList[1];
              officeId = this.replenishmentSearchForm.parentIdList[2];
            } else if (this.replenishmentSearchForm.parentIdList.length === 2) {
              companyId = this.replenishmentSearchForm.parentIdList[0];
              regionId = this.replenishmentSearchForm.parentIdList[1];
            } else if (this.replenishmentSearchForm.parentIdList.length === 1) {
              companyId = this.replenishmentSearchForm.parentIdList[0];
            }
          }
          if (this.replenishmentSearchForm.address != '') {
            ad = this.replenishmentSearchForm.address;
          }
          if (this.replenishmentSearchForm.machineName != '') {
            ma = this.replenishmentSearchForm.machineName;
          }
          if (this.replenishmentSearchForm.dateTime && this.replenishmentSearchForm.dateTime.length === 2) {
            bd = dealDateTime(this.replenishmentSearchForm.dateTime[0]);
            ed = dealDateTime(this.replenishmentSearchForm.dateTime[1]);
          }
          const data = {
            regionId,
            companyId,
            officeId,
            address: ad,
            machineName: ma,
            beginDate: bd,
            endDate: ed,
            stationId: this.replenishmentSearchForm.station,
            minTurnover: this.replenishmentSearchForm.minTurnover,
            maxTurnover: this.replenishmentSearchForm.maxTurnover,
            replenishmentStatus: this.replenishmentSearchForm.replenishmentStatus
          };
          this.replenishmentListLoading = true;
          fetchReplenishment(data, this.page, this.size).then(response => {
            this.replenishmentListLoading = false;
            this.replenishment = response.response;
            this.total = response.total;
          })
        }
      },
      searchReplenishmentStatisticsList() {
        this.replenishmentStatisticsListLoading = true;
        fetchReplenishmentStatisticsList(this.replenishmentStatisticsSearchForm, this.replenishmentStatisticsPage, this.replenishmentStatisticsSize).then(response => {
          this.replenishmentStatisticsListLoading = false;
          if (response.code === 0) {
            this.replenishmentStatisticsList = response.response;
            this.replenishmentStatisticsTotal = response.total;
          }
        });
      },
      showStatisticsProductInMachine(row, event) {
        this.statisticsSelectProduct.productName = row.productName;
        this.statisticsSelectProduct.productId = row.productId;
        this.statisticsSelectProduct.tasteId = row.tasteId;
        this.statisticsSelectProduct.tasteName = row.tasteName;
        this.statisticsSelectProduct.productNumber = row.count;
        this.productStatisticsInMachinesDialogVisible = true;
        this.getStatisticsProductInMachine();
      },
      getStatisticsProductInMachine() {
        this.productStatisticsInMachinesListLoading = true;
        fetchStatisticsProductInMachine(this.statisticsSelectProduct.productId, this.statisticsSelectProduct.tasteId, this.productStatisticsInMachinesPage, this.productStatisticsInMachinesSize).then(response => {
          this.productStatisticsInMachinesListLoading = false;
          if (response.code === 0) {
            this.productStatisticsInMachinesList = response.response;
            this.productStatisticsInMachinesTotal = response.total;
          }
        });
      },
      handleSizeChange(val) {
        this.size = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleProductStatisticsInMachinesSizeChange(val) {
        this.productStatisticsInMachinesSize = val;
        this.getStatisticsProductInMachine();
      },
      handleProductStatisticsInMachinesCurrentChange(val) {
        this.productStatisticsInMachinesPage = val;
        this.getStatisticsProductInMachine();
      },
      handleReplenishmentHistoryTableSizeChange(val) {
        this.replenishmentSize = val;
        this.searchReplenishmentHistory();
      },
      handleReplenishmentHistoryTableCurrentChange(val) {
        this.replenishmentPage = val;
        this.searchReplenishmentHistory();
      },
      handleReplenishmentStatisticsSizeChange(val) {
        this.replenishmentStatisticsSize = val;
        this.searchReplenishmentStatisticsList();
      },
      handleReplenishmentStatisticsCurrentChange(val) {
        this.replenishmentStatisticsPage = val;
        this.searchReplenishmentStatisticsList();
      },
      fetchOfficeCasc() {
        fetchOfficeTree().then(response => {
          this.offices = response.response[0].children;
        })
      },
      handleAlterProductNum(row) {
        this.replenishmentListDialogTableVisible = true;
        this.replenishmentCountLoading = true;
        this.currentRow = row;
        this.machineName = row.machineName;
        if (row.stationName != '') {
          this.stationName = row.stationName;
        } else {
          this.stationName = '当前设备还没有选择站点';
        }
        this.turnover = row.turnover;
        this.machineId = row.machineId;
        this.getMP(row.machineId);
        // this.activeName = 'replenishmentList';
      },
      getMP(machineId) {
        getMachineProduct(machineId).then(response => {
          this.productSelect = '';
          this.replenishmentCountLoading = false;
          this.replenishmentCountList = response.response;
          this.replenishmentCountListResult = response.response;
          if (response.response == '') {
            this.$message({
              showClose: true,
              message: '当前设备还没有商品',
              duration: 3000,
              type: 'warning'
            });
          }
        });
      },
      productSelectChange() {
        this.replenishmentCountListResult = [];
        this.replenishmentCountList.forEach(item => {
          if (!this.productSelect) {
            this.replenishmentCountListResult.push(item)
          } else {
            if (item.productName.indexOf(this.productSelect) !== -1) {
              this.replenishmentCountListResult.push(item)
            }
          }
        });
      },
      productSelectTwoChange() {
        this.changeProductInMachinesDialogMachineList = [];
        this.changeProductInMachinesDialogMachineListResult.forEach(item => {
          if (!this.productSelectTwo) {
            this.changeProductInMachinesDialogMachineList.push(item)
          } else {
            if (item.machineName.indexOf(this.productSelectTwo) !== -1) {
              this.changeProductInMachinesDialogMachineList.push(item)
            }
          }
        });
      },
      replenishmentProductListSelectChange() {
        this.replenishmentProductListResult = [];
        this.replenishmentProductList.forEach(item => {
          if (!this.replenishmentProductListSelects) {
            this.replenishmentProductListResult.push(item)
          } else {
            if (item.productName.indexOf(this.replenishmentProductListSelects) !== -1) {
              this.replenishmentProductListResult.push(item)
            }
          }
        })
      },
      check(row) {
        // 判断输入数字是否合法
        if (!isNaN(parseInt(row.confirmAddCount))) {
          if (row.confirmAddCount != '' && row.confirmAddCount != undefined) {
            if (isNaN(parseInt(row.confirmAddCount))) {
              // 数字不合法
              row.confirmAddCount = row.newConfirmAddCount;
              this.$notify({
                title: '补货量错误',
                message: '补货量应为正整数',
                type: 'error',
                duration: 1000
              });
            } else {
              if (row.confirmAddCount !== row.newConfirmAddCount) {
                row.confirmAddCount = parseInt(row.confirmAddCount);
                this.saveConfirmAddCount(row, this.machineId);
              }
            }
          } else {
            row.confirmAddCount = row.newConfirmAddCount;
          }
        } else {
          row.confirmAddCount = row.newConfirmAddCount;
          this.$notify({
            title: '补货量错误',
            message: '补货量应为正整数',
            type: 'error',
            duration: 1000
          });
        }
      },
      checkTwo(row) {
        // 判断输入数字是否合法
        if (!isNaN(parseInt(row.confirmAddCount))) {
          if (row.confirmAddCount != '' && row.confirmAddCount != undefined) {
            if (isNaN(parseInt(row.confirmAddCount))) {
              // 数字不合法
              row.confirmAddCount = row.newConfirmAddCount;
              this.$notify({
                title: '补货量错误',
                message: '补货量应为正整数',
                type: 'error',
                duration: 1000
              });
            } else {
              if (row.confirmAddCount !== row.newConfirmAddCount) {
                row.confirmAddCount = parseInt(row.confirmAddCount);
                this.saveConfirmAddCount(row, row.machineId);
              }
            }
          } else {
            row.confirmAddCount = row.newConfirmAddCount;
          }
        } else {
          row.confirmAddCount = row.newConfirmAddCount;
          this.$notify({
            title: '补货量错误',
            message: '补货量应为正整数',
            type: 'error',
            duration: 1000
          });
        }
      },
      showSaleCondition(row) {
        this.replenishmentDetailLoading = true;
        this.dialogTableVisible = true;
        fetchSaleCondition(row.machineId).then(response => {
          this.replenishmentDetailList = response.response;
          this.replenishmentDetailLoading = false;
        });
      },
      saveConfirmAddCount(row, machineId) {
        fetchUpdateConfirmAddCount(machineId, row.confirmAddCount, row.productId, row.tasteId).then(response => {
          if (response.code !== 0) {
            row.adviceAddCount = row.newConfirmAddCount;
            this.$notify({
              title: '修改补货量',
              message: '修改失败',
              type: 'error',
              duration: 1000
            });
          } else {
            this.$notify({
              title: '修改补货量',
              message: response.desc,
              type: 'success',
              duration: 1000
            });
            // 选中这一行
            this.$refs.replenishmentRef.toggleRowSelection(this.currentRow, true);
          }
        });
      },
      replenishmentAndExport() {
        if (this.selectList.length !== 0) {
          this.replenishmentMachine = [];
          for (let i = 0; i < this.selectList.length; i++) {
            this.replenishmentMachine.push(this.selectList[i].machineId);
          }
          this.dialogStockVisible = true;
          this.getStockInfo();
        } else {
          this.$notify.info({
            title: '-_-||',
            message: '请先选择设备',
            duration: 3000
          });
        }
      },
      batchConfirm() {
        if (this.selectList.length !== 0) {
          this.replenishmentMachine = [];
          for (let i = 0; i < this.selectList.length; i++) {
            this.replenishmentMachine.push(this.selectList[i].machineId);
          }
          const data = {
            machineIds: this.replenishmentMachine
          };
          const _this = this;
          this.confirmLoading = true;
          confirmProduct(data).then(response => {
            this.confirmLoading = false;
            let type = 'error';
            let msg = '确认配送到达失败';
            if (response.code === 0) {
              type = 'success';
              msg = response.desc;
            }
            this.$notify({
              title: '确认配送到达',
              type,
              message: msg,
              duration: 3000
            });
            if (type === 'success') {
              _this.search();
            }
          });
        }
        else {
          this.$notify.info({
            title: '-_-||',
            message: '请先选择设备',
            duration: 3000
          });
        }
      },
      selectChange(selection) {
        this.selectList = selection;
      },
      changeProductInMachinesDialogMachineListSelectChange(selection) {
        this.productInMachineSelect = selection;
      },
      selectReplenishmentHistoryListChange(selection) {
        this.selectReplenishmentHistoryList = selection;
      },
      getStationList() {
        fetchStations().then(response => {
          this.stationList = response.response
        })
      },
      checkEffectiveness(type) {
        if (type === 0) {
          if (this.replenishmentSearchForm.minTurnover !== '') {
            this.replenishmentSearchForm.minTurnover = parseFloat(this.replenishmentSearchForm.minTurnover);
          }
          if (this.replenishmentSearchForm.maxTurnover !== '') {
            this.replenishmentSearchForm.maxTurnover = parseFloat(this.replenishmentSearchForm.maxTurnover);
          }
          this.canSearch = true;
          if (this.replenishmentSearchForm.minTurnover !== '' && this.replenishmentSearchForm.maxTurnover !== '') {
            if (this.replenishmentSearchForm.minTurnover > this.replenishmentSearchForm.maxTurnover) {
              this.$notify.warning({
                title: '-_-||',
                message: '最小营业额不应该大于最大营业额',
                duration: 2000
              });
              this.canSearch = false;
            }
          }
        } else {
          if (this.replenishmentHistorySearchForm.minProductValue !== '') {
            this.replenishmentHistorySearchForm.minProductValue = parseFloat(this.replenishmentHistorySearchForm.minProductValue);
          }
          if (this.replenishmentHistorySearchForm.maxProductValue !== '') {
            this.replenishmentHistorySearchForm.maxProductValue = parseFloat(this.replenishmentHistorySearchForm.maxProductValue);
          }
          this.canSearchReplenishmentHistory = true;
          if (this.replenishmentHistorySearchForm.minProductValue !== '' && this.replenishmentHistorySearchForm.maxProductValue !== '') {
            if (this.replenishmentHistorySearchForm.minProductValue > this.replenishmentHistorySearchForm.maxProductValue) {
              this.$notify.warning({
                title: '-_-||',
                message: '最小货值不应该大于最大货值',
                duration: 2000
              });
              this.canSearchReplenishmentHistory = false;
            }
          }
        }
      },
      handlerConfirm(row) {
        this.replenishmentConditionVisible = true;
        this.conditionDialogMachineName = row.machineName;
        showReplenishmentCondition(row.machineId).then(response => {
          if (response.code === 0) {
            this.witchMachineCondition = row.machineId;
            if (response.response.length > 0) {
              this.replenishmentCondition = response.response;
            }
          } else {
            this.$message({
              message: response.desc,
              duration: 2000,
              type: 'error',
              showClose: true
            });
          }
        });
      },
      // 某个设备一个配货单的确认收货
      confirmOne(batchId) {
        const data = {
          machineId: this.witchMachineCondition,
          batchId
        };
        confirmProduct(data).then(response => {
          let type = 'error';
          let msg = '确认配送到达失败';
          if (response.code === 0) {
            type = 'success';
            msg = response.desc;
          }
          this.$notify({
            title: '确认配送到达',
            type,
            message: msg,
            duration: 3000
          });
          if (type === 'success') {
            showReplenishmentCondition(this.witchMachineCondition).then(response => {
              if (response.code === 0 && response.response.length > 0) {
                this.replenishmentCondition = response.response;
              } else {
                this.witchMachineCondition = '';
                this.replenishmentCondition = [];
                this.replenishmentConditionVisible = false;
                this.search();
              }
            });
          }
        });
      },
      // 导出单个设备的某一个配货单
      exportOneMachineTwice(batchId) {
        let showBarcode, showQRecord, showSummary, showAddress;
        showBarcode = false;
        showQRecord = false;
        showSummary = false;
        showAddress = false;
        this.checkedSet.forEach(item => {
          if (item === '条形码') {
            showBarcode = true;
          } else if (item === '二维码') {
            showQRecord = true;
          } else if (item === '添加商品汇总') {
            showSummary = true;
          } else {
            showAddress = true;
          }
        })
        this.exportTwiceLoading = true;
        const data = {
          machineId: this.witchMachineCondition,
          batchId,
          showBarcode,
          showQRecord,
          showSummary,
          showAddress
        };
        exportExcelTwice(data).then(response => {
          this.exportTwiceLoading = false;
          if (response.code === 0) {
            const oGetExcel = document.getElementById('getExcel');
            oGetExcel.setAttribute('href', response.response[0]);
            oGetExcel.setAttribute('download', response.response[1]);
            oGetExcel.click();
          } else {
            this.$notify.info({
              title: '导出Excel',
              message: response.desc,
              duration: 3000
            });
            showReplenishmentCondition(this.witchMachineCondition).then(response => {
              if (response.code === 0) {
                if (response.response.length > 0) {
                  this.replenishmentCondition = response.response;
                }
              } else {
                this.witchMachineCondition = '';
                this.replenishmentCondition = [];
                this.replenishmentConditionVisible = false;
                this.search();
              }
            });
          }
        });
        const _this = this;
        setTimeout(function() {
          if (_this.exportTwiceLoading === true) {
            _this.exportTwiceLoading = false;
            _this.$notify.info({
              title: '-_-||',
              message: '导出Excel失败',
              duration: 3000
            });
          }
        }, 300000);
      },
      exportReplenishmentTwice() {
        if (this.selectReplenishmentHistoryList.length === 0) {
          this.$message({
            message: '请先选择要导出的配货单',
            type: 'warning',
            duration: 1000
          });
        } else {
          // 先进行处理选中的配货单
          const replenishmentIdList = [];
          for (let i = 0; i < this.selectReplenishmentHistoryList.length; i++) {
            replenishmentIdList.push(this.selectReplenishmentHistoryList[i].id);
          }

          let showBarcode, showQRecord, showSummary, showAddress;
          showBarcode = false;
          showQRecord = false;
          showSummary = false;
          showAddress = false;
          this.checkedSet.forEach(item => {
            if (item === '条形码') {
              showBarcode = true;
            } else if (item === '二维码') {
              showQRecord = true;
            } else if (item === '添加商品汇总') {
              showSummary = true;
            } else {
              showAddress = true;
            }
          })
          this.exportReplenishmentTwiceLoading = true;
          exportExcelTwice({
            replenishmentIdList,
            showBarcode,
            showQRecord,
            showSummary,
            showAddress
          }).then(response => {
            this.exportReplenishmentTwiceLoading = false;
            if (response.code === 0) {
              const oGetExcel = document.getElementById('getExcel');
              oGetExcel.setAttribute('href', response.response[0]);
              oGetExcel.setAttribute('download', response.response[1]);
              oGetExcel.click();
            } else {
              this.$notify.info({
                title: '-_-||',
                message: response.desc,
                duration: 3000
              });
            }
          });
          const _this = this;
          setTimeout(function () {
            if (_this.exportReplenishmentTwiceLoading === true) {
              _this.exportReplenishmentTwiceLoading = false;
              _this.$notify.info({
                title: '-_-||',
                message: '导出Excel失败',
                duration: 3000
              });
            }
          }, 300000);
        }
      },
      exportDifference() {
        if (this.selectReplenishmentHistoryList.length === 0) {
          this.$message({
            message: '请先选择要导出的配货单',
            type: 'warning',
            duration: 1000,
          });
        } else {
          // 先进行处理选中的配货单
          const replenishmentIdList = [];
          for (let i = 0; i < this.selectReplenishmentHistoryList.length; i++) {
            replenishmentIdList.push(this.selectReplenishmentHistoryList[i].id);
          }
          this.exportDifferenceLoading = true;
          fetchExportDifference(replenishmentIdList).then(response => {
            this.exportDifferenceLoading = false;
            if (response.code === 0) {
              const oGetExcel = document.getElementById('getExcel');
              oGetExcel.setAttribute('href', response.response[0]);
              oGetExcel.setAttribute('download', response.response[1]);
              oGetExcel.click();
            } else {
              this.$notify.info({
                title: '-_-||',
                message: response.desc,
                duration: 3000
              });
            }
          })
          const _this = this;
          setTimeout(function () {
            if (_this.exportDifferenceLoading === true) {
              _this.exportDifferenceLoading = false;
              _this.$notify.info({
                title: '-_-||',
                message: '导出Excel失败',
                duration: 3000
              });
            }
          }, 300000);
        }
      },
      exportMachinesReplenishmentTwice() {
        this.exportLoading = true;
        if (this.selectList.length !== 0) {
          let machineIdList = [];
          for (let i = 0; i < this.selectList.length; i++) {
            machineIdList.push(this.selectList[i].machineId);
          }
          let showBarcode, showQRecord, showSummary, showAddress;
          showBarcode = false;
          showQRecord = false;
          showSummary = false;
          showAddress = false;
          this.checkedSet.forEach(item => {
            if (item === '条形码') {
              showBarcode = true;
            } else if (item === '二维码') {
              showQRecord = true;
            } else if (item === '添加商品汇总') {
              showSummary = true;
            } else {
              showAddress = true;
            }
          })
          const data = {
            machineIds: machineIdList,
            showBarcode,
            showQRecord,
            showSummary,
            showAddress
          };
          exportExcelTwice(data).then(response => {
            this.exportLoading = false;
            if (response.code === 0) {
              const oGetExcel = document.getElementById('getExcel');
              oGetExcel.setAttribute('href', response.response[0]);
              oGetExcel.setAttribute('download', response.response[1]);
              oGetExcel.click();
            } else {
              this.$notify.info({
                title: '-_-||',
                message: response.desc,
                duration: 3000
              });
            }
          });
          const _this = this;
          setTimeout(function() {
            if (_this.exportLoading === true) {
              _this.exportLoading = false;
              _this.$notify.info({
                title: '-_-||',
                message: '补货失败',
                duration: 3000
              });
            }
          }, 300000);
        } else {
          this.exportLoading = false;
          this.$notify.info({
            title: '-_-||',
            message: '请先选择需要再次导出Excel设备',
            duration: 3000
          });
        }
      },
      exportReplenishmentStatisticsList() {
        this.exportStatisticsLoading = true;
        exportReplenishmentStatistics(this.replenishmentStatisticsSearchForm).then(response => {
          this.exportStatisticsLoading = false;
          if (response.code === 0) {
            const oGetExcel = document.getElementById('getExcel');
            oGetExcel.setAttribute('href', response.response[0]);
            oGetExcel.setAttribute('download', response.response[1]);
            oGetExcel.click();
          } else {
            this.$notify.info({
              title: '-_-||',
              message: response.desc,
              duration: 3000
            });
          }
        });
        const _this = this;
        setTimeout(function () {
          if (_this.exportStatisticsLoading === true) {
            _this.exportStatisticsLoading = false;
            _this.$notify.info({
              title: '-_-||',
              message: '导出失败',
              duration: 3000
            });
          }
        }, 300000);
      },
      showReplenishmentHistoryDetail(row, event) {
        this.replenishmentHistoryConditionVisible = true;
        this.replenishmentHistoryConditionTitle = row.machineName;
        getReplenishmentHistoryDetail(row.id).then(response => {
          if (response.code === 0) {
            this.witchMachineCondition = row.machineId;
            this.replenishmentHistoryCondition = response.response;
          } else {
            this.replenishmentHistoryConditionVisible = false;
          }
        });
      },
      // 关闭弹窗
      closeConditionDialog(done) {
        this.witchMachineCondition = '';
        this.replenishmentCondition = [];
        done();
        this.search();
      },
      closeReplenishmentHistoryConditionDialog(done) {
        this.witchMachineCondition = '';
        this.replenishmentHistoryCondition.batchId = '';
        this.replenishmentHistoryCondition.status = '';
        this.replenishmentHistoryCondition.details = [];
        done();
        this.searchReplenishmentHistory();
      },
      getStockInfo() {
        fetchStockInfo().then(response => {
          this.stockList = response.response;
        });
      },
      sureReplenishment() {
        if (this.stock !== '') {
          const _this = this;
          const t = window.setTimeout(function() {
            if (_this.replenishmentLoading === true) {
              _this.replenishmentLoading = false;
              _this.ignoreStock = false;
              _this.$notify.info({
                title: '-_-||',
                message: '发生错误',
                duration: 3000
              });
              _this.search();
            }
          }, 300000);
          this.stationList = [];
          this.dialogStockVisible = false;
          this.replenishmentLoading = true;
          let showSummary, showAddress;
          showSummary = false;
          showAddress = false;
          this.checkedSet.forEach(item => {
            if (item === '添加商品汇总') {
              showSummary = true;
            } else {
              showAddress = true;
            }
          })
          fetchReplenishmentAndExportExcel(this.replenishmentMachine, this.stock, showSummary, showAddress, this.ignoreStock).then(response => {
            this.replenishmentLoading = false;
            if (response.code === 0) {
              this.ignoreStock = false;
              if (response.response != null) {
                const oGetExcel = document.getElementById('getExcel');
                oGetExcel.setAttribute('href', response.response[0]);
                oGetExcel.setAttribute('download', response.response[1]);
                oGetExcel.click();
                this.search();
                this.getStationList();
                this.selectList = [];
              } else {
                this.$message.error(response.desc);
              }
            } else if (response.code === 2) {
              if (response.response !== undefined && response.response != null) {
                const h = this.$createElement;
                const msg = [];
                for (let i = 0; i < response.response.length; i++) {
                  if (response.response[i].note !== null) {
                    msg.push(h('p', { style: 'color:#FF0000' }, response.response[i].productName + '(' + response.response[i].tasteName + ')' + ' ' + response.response[i].note));
                  } else {
                    msg.push(h('p', { style: 'color:#000' }, response.response[i].productName + '(' + response.response[i].tasteName + ')' + ' ' + ' 需求量:' + response.response[i].count + '库存量' + response.response[i].stock));
                  }
                }
                this.$notify.error({
                  title: '商品库存不足',
                  message: h('div', { style: 'overflow-y: scroll; height: 150px' }, msg),
                  duration: 0,
                  offset: -10
                });
              } else {
                this.$notify.error({
                  title: '商品库存不足',
                  message: '出现异常',
                  duration: 0
                });
              }
              if (!this.ignoreStock) {
                this.$confirm('仓库库存不能满足申请补货数量, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  window.clearTimeout(t)
                  this.ignoreStock = true;
                  this.sureReplenishment(this.ignoreStock);
                  return;
                }).catch(() => {  });
              }
            }
          });
        } else {
          this.$message.error('请先选择仓库在进行补货');
        }
      },
      handleStockClose(done) {
        done();
        this.stationList = [];
        this.dialogStockVisible = false;
      },
      // 格式化时间
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 2)
        } else {
          return cellValue;
        }
      },
      searchReplenishmentHistory() {
        if (this.canSearchReplenishmentHistory) {
          getReplenishmentHistoryList(this.replenishmentHistorySearchForm, this.replenishmentPage, this.replenishmentSize).then(response => {
            if (response.code === 0) {
              this.replenishmentHistoryList = response.response;
              this.replenishmentTotal = response.total;
            } else {
              this.$notify.error({
                title: '-_-||',
                message: '查无数据',
                duration: 1000
              });
            }
          });
        }
      },
      searchReplenishmentProductList() {
        if (this.replenishmentMachine.length !== 0) {
          this.replenishmentProductListLoading = true;
          getAllProductInMachine(this.replenishmentMachine).then(response => {
            this.replenishmentProductListLoading = false;
            if (response.code === 0) {
              this.replenishmentProductListSelects = '';
              this.replenishmentProductList = response.response;
              this.replenishmentProductListResult = response.response;
            }
          })
        }
      },
      selectTab(va) {
        if (va.name === 'replenishmentHistory') {
          this.searchReplenishmentHistory();
        } else if (va.name === 'replenishmentProductList') {
          if (this.selectList.length !== 0) {
            this.replenishmentMachine = [];
            for (let i = 0; i < this.selectList.length; i++) {
              this.replenishmentMachine.push(this.selectList[i].machineId);
            }
            this.searchReplenishmentProductList();
          } else {
            this.replenishmentProductListSelects = '';
            this.replenishmentProductList = [];
            this.replenishmentProductListResult = [];
          }
        } else if (va.name === 'replenishmentProductStatistics') {
          this.searchReplenishmentStatisticsList();
        }
      },
      showChangeReplenishmentCount(row) {
        this.selectProductName = row.productName;
        this.selectProductId = row.productId;
        this.selectTasteId = row.tasteId;
        this.selectTasteName = row.tasteName;
        this.changeProductInMachinesDialogVisible = true;
        this.productSelectTwo = '';
        this.getShowChangeReplenishmentCount(row.productId, row.tasteId);
      },
      getShowChangeReplenishmentCount(productId, tasteId) {
        if (this.selectList.length !== 0) {
          this.changeProductInMachinesDialogMachineListLoading = true;
          let machineIdList = [];
          for (let i = 0; i < this.selectList.length; i++) {
            machineIdList.push(this.selectList[i].machineId);
          }
          getChangeReplenishmentCount(productId, machineIdList, tasteId).then(response => {
            this.changeProductInMachinesDialogMachineListLoading = false;
            if (response.code === 0) {
              this.changeProductInMachinesDialogMachineListResult = response.response;
              this.changeProductInMachinesDialogMachineList = response.response;
            } else {
              this.$message.error(response.desc);
            }
          });
          const _this = this;
          setTimeout(function() {
            if (_this.changeProductInMachinesDialogMachineListLoading === true) {
              _this.changeProductInMachinesDialogMachineListLoading = false;
              _this.selectProductName = '';
              _this.selectProductId = '';
              _this.selectTasteId = ''
              _this.selectTasteName = '';
              _this.$notify.info({
                title: '-_-||',
                message: '查询失败，请刷新重试',
                duration: 3000
              });
            }
          }, 300000);
        } else {
          this.$message.error('请先在设备列表勾选设备后再进行操作');
        }
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元';
        } else {
          return cellValue;
        }
      },
      closeChangeProductInMachinesDialog(done) {
        this.selectProductName = '';
        this.selectProductId = '';
        this.selectTasteId = ''
        this.selectTasteName = '';
        this.productSelectTwo = '';
        this.changeProductInMachinesDialogMachineListResult = [];
        this.changeProductInMachinesDialogMachineList = [];
        done();
        this.searchReplenishmentProductList();
      },
      updateConfirmAddCountNumber() {
        this.$prompt('请输入要为勾选的设备配送该商品个数', '*_*', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?:0|[1-9][0-9]?|100)$/,
          inputErrorMessage: '商品个数应为0到100的正整数'
        }).then(({ value }) => {
          const machineIds = [];
          this.productInMachineSelect.forEach(item => {
            machineIds.push(item.machineId)
          });
          fetchUpdateConfirmAddCountByMachineIds(machineIds, value, this.selectProductId, this.selectTasteId).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '修改补货量',
                message: '修改成功',
                type: 'success',
                duration: 1000
              });
              this.getShowChangeReplenishmentCount(this.selectProductId, this.selectTasteId);
            } else {
              this.$notify({
                title: '修改补货量',
                message: '修改失败',
                type: 'error',
                duration: 1000
              });
            }
          });
        }).catch(() => {
          /* this.$message({
             type: 'info',
             message: '取消输入'
           });*/
        });
      },
      handleProductSelectionChange(selection) {
        this.selectProducts = selection;
      },
      updateMachineConfirmAdd() {
        let p = [];
        if (this.selectProducts.length <= 0) {
          this.$message({
            showClose: true,
            message: '请先选择商品',
            type: 'error'
          });
        } else {
          const _this = this;
          this.$prompt('请输入要为勾选的设备配送该商品个数', '*_*', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^(?:0|[1-9][0-9]?|100)$/,
            inputErrorMessage: '商品个数应为0到100的正整数'
          }).then(({ value }) => {
            _this.selectProducts.forEach(function(value, index, array) {
              const pt = {
                productId: value.productId,
                tasteId: value.tasteId
              }
              p.push(pt);
            });
            fetchUpdateConfirmAddCountByProducts(_this.machineId, value, p).then(response => {
              if (response.code === 0) {
                this.$notify({
                  title: '修改补货量',
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                // 刷新
                _this.getMP(_this.machineId);
                // 选中这一行
                _this.$refs.replenishmentRef.toggleRowSelection(_this.currentRow, true);
              } else {
                this.$notify({
                  title: '修改补货量',
                  message: '修改失败',
                  type: 'error',
                  duration: 1000
                });
              }
            });
          }).catch(() => {
            /* this.$message({
               type: 'info',
               message: '取消输入'
             });*/
          });
        }
      },
      changeSelect(val) {
        if (val.length === 0) {
          window.localStorage.setItem('replenishmentSet', '');
        } else {
          window.localStorage.setItem('replenishmentSet', val.toString());
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
