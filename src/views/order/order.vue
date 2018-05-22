<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="selectTab">
      <el-tab-pane name="orderAllList">
        <span slot="label"><i class="el-icon-document"></i> 订单列表</span>
        <el-form :model="orderSearchForm" ref="orderSearchForm" class="demo-form-inline" label-width="75px"
                 label-position="left">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="订单号" prop="orderId" label-width="25%">
                <el-input v-model="orderSearchForm.orderId"
                          placeholder="请输入订单号"
                          @input="checkNum(orderSearchForm.orderId)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="orderSearchForm.machineName" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="商品名称" prop="productNameForSearch">
                <el-input v-model="orderSearchForm.productNameForSearch" placeholder="请输入商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间" prop="dateTime" label-width="15%">
                <el-date-picker
                  v-model="orderSearchForm.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOption"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="手机号" prop="mobile" label-width="25%">
                <el-input type="text" v-model="orderSearchForm.mobile"
                          placeholder="请输入顾客手机号"
                          pattern="^[0-9]*[1-9][0-9]*$"
                          :maxlength="11"
                          v-on:blur="checkMobile(orderSearchForm)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="订单状态" prop="status">
                <el-select v-model="orderSearchForm.status"
                           clearable
                           filterable
                           placeholder="请选择订单状态"
                           style="width:100%">
                  <el-option
                    v-for="item in orderStatusAddException"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="机构" prop="parentIdList" label-width="20%">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="orderSearchForm.parentIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构"
                  style="width:100%"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="search">查询</el-button>
                <el-button icon="el-icon-delete" round @click="resetForm('orderSearchForm')">重置</el-button>
                <el-button icon="el-icon-share" round @click="exportExcel" :loading="exportExcelLoading">导出Excel
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-tooltip class="item" effect="dark" content="双击订单展示详情" placement="top-end">
          <el-table
            v-loading.body="orderListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            stripe
            border
            highlight-current-row
            :data="orderList"
            ref="refOrderList"
            show-summary
            :summary-method="getOrderSummaries"
            @row-dblclick="getOrderDetail"
            style="width: 100%;">
            <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
            <el-table-column prop="mobile" label="顾客手机号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="machineName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="preDiscountPrice" label="折前价" align="center"
                             :formatter="formatterPreDiscountPrice"></el-table-column>
            <el-table-column prop="status" label="订单状态" align="center" :formatter="formatterStatus"></el-table-column>
            <el-table-column prop="isException" label="是否异常" align="center"
                             :formatter="formatterIsException"></el-table-column>
            <el-table-column prop="totalPrice" label="折后价" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="paidPrice" label="支付金额" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="paidType" label="支付类型" align="center"
                             :formatter="formatterPaidType" show-overflow-tooltip></el-table-column>
            <el-table-column prop="weight" label="订单重量" align="center" :formatter="formatterWeight"></el-table-column>
            <el-table-column prop="actualWeight" label="上传重量" align="center"
                             :formatter="formatterWeight"></el-table-column>
            <el-table-column prop="refundNum" label="是否有退款"align="center" width="50px"
                             :formatter="formatterRefundNum"></el-table-column>
            <el-table-column prop="smsCount" label="发送短信次数" align="center"
                             :formatter="formatterSmsCount"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status=='1' && scope.row.isException=='-1'"
                  size="small"
                  type="text"
                  @click="updateByTotalPrice(scope.$index, scope.row)">修改价格
                </el-button>
                <el-button
                  v-if="scope.row.status=='2' && scope.row.isException=='1'"
                  size="small"
                  type="text"
                  @click="repairOrderDialog(scope.$index, scope.row)">补单
                </el-button>
                <el-button v-if="(scope.row.status=='1' && scope.row.isException=='-1') || (scope.row.status=='2' && scope.row.isException=='1')"
                           size="small"
                           type="text"
                           @click="toNormal(scope.$index, scope.row)">置为正常
                </el-button>
                <el-button v-if="scope.row.batchId != null && scope.row.videoUrl == null"
                           size="small"
                           type="text"
                           @click="getVideo(scope.$index, scope.row)">获取视频
                </el-button>
                <!--<el-button
                  v-if="scope.row.videoUrl"
                  size="small"
                  type="text"
                  @click="showVideoUrl(scope.$index, scope.row)">视频
                </el-button>-->
                <a v-if="scope.row.videoUrl" :href="scope.row.videoUrl" target="_Blank"><font color="#4db3ff">视频</font></a>
              </template>
            </el-table-column>
            <div style="display: none" prop="createdDate"></div>
          </el-table>
        </el-tooltip>

        <p class="block" style="float:right; ">
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
      </el-tab-pane>

      <el-tab-pane name="reserve">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4309"><path
          d="M827.258644 661.687378l-110.402437-97.124147 50.117683-56.969503 110.402437 97.124147-50.117683 56.969503ZM600.095688 919.912581l-110.402437-97.124147 200.267827-227.647365 110.402437 97.124147-200.267827 227.647365ZM468.3776 846.8992 578.7648 944.0256 462.1824 965.2736ZM331.4176 249.856l313.0368 0 0 91.0336-313.0368 0 0-91.0336ZM331.4176 424.704l313.0368 0 0 91.0336-313.0368 0 0-91.0336ZM331.4176 599.5008l166.7584 0 0 91.0336-166.7584 0 0-91.0336ZM401.5616 880.2816 290.5088 880.2816c-27.8016 0-50.5856-22.784-50.5856-50.5856L239.9232 194.816c0-27.8016 22.784-50.5856 50.5856-50.5856l395.9296 0c27.8016 0 50.5856 22.784 50.5856 50.5856L737.024 393.216l91.648 0L828.672 142.0288c0-48.6912-39.8336-88.5248-88.5248-88.5248L236.6464 53.504c-48.6912 0-88.5248 39.8336-88.5248 88.5248l0 739.9424c0 48.6912 39.8336 88.5248 88.5248 88.5248l164.864 0L401.5616 880.2816 401.5616 880.2816z"
          p-id="4384"></path></svg> 预定订单</span>
        <el-form :model="reserveSearchForm"
                 ref="reserveSearchForm"
                 class="demo-form-inline"
                 label-width="75px"
                 label-position="left">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="订单号" prop="orderId" label-width="25%">
                <el-input v-model="reserveSearchForm.orderId"
                          placeholder="请输入订单号"
                          @input="checkNum(reserveSearchForm.orderId)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="reserveSearchForm.machineName" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="商品名称" prop="productNameForSearch">
                <el-input v-model="reserveSearchForm.productNameForSearch" placeholder="请输入商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="时间" prop="dateTime" label-width="12%">
                <el-date-picker
                  v-model="reserveSearchForm.dateTime"
                  type="datetimerange"
                  :picker-options="pickerOption"
                  placeholder="请选择时间范围"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="手机号" prop="mobile" label-width="25%">
                <el-input type="text" v-model="reserveSearchForm.mobile"
                          placeholder="请输入顾客手机号"
                          pattern="^[0-9]*[1-9][0-9]*$"
                          :maxlength="11"
                          v-on:blur="checkMobile(reserveSearchForm)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="快递单号" prop="courierNumber">
                <el-input type="text" v-model="reserveSearchForm.courierNumber"
                          placeholder="请输入快递单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="收货地址" prop="address">
                <el-input type="text" v-model="reserveSearchForm.address"
                          placeholder="请输入收货地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机构" prop="parentIdList" label-width="15%">
                <el-cascader
                  :disabled="officeDisabled"
                  :options="offices"
                  v-model="reserveSearchForm.parentIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  placeholder="请选择机构" style="width:100%"></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="收货人" prop="consignee" label-width="25%">
                <el-input type="text"
                          v-model="reserveSearchForm.consignee"
                          placeholder="请输入收货人姓名"
                          style="width: 95%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="订单状态" prop="status" style="width:100%">
                <el-select v-model="reserveSearchForm.status" clearable filterable placeholder="请选择订单状态">
                  <el-option
                    v-for="item in orderStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="配送状态" prop="delivered" style="width: 100%;margin-left: 10px">
                <el-select
                  clearable
                  filterable
                  v-model="reserveSearchForm.delivered"
                  placeholder="请选择配送状态">
                  <el-option
                    v-for="item in deliveredStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="searchReserveList">查询</el-button>
                <el-button icon="el-icon-delete" round @click="resetForm('reserveSearchForm')">重置</el-button>
                <el-button icon="el-icon-share" round @click="exportReserveExcel" :loading="exportReserveExcelLoading">
                  导出Excel
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-tooltip class="item" effect="dark" content="双击展示详情" placement="top-end">
          <el-table
            v-loading.body="reserveListLoading"
            element-loading-text="小喵使出了洪荒之力为您加载。。。"
            :data="reserveList"
            stripe
            highlight-current-row
            ref="refReserveList"
            border
            show-summary
            :summary-method="getReserveSummaries"
            @row-dblclick="getOrderDetail"
            style="width: 100%;">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="68px">
                  <el-form-item label="收货地址" style="width: 30%">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="快递名称" style="width: 30%">
                    <span>{{ props.row.courierName }}</span>
                  </el-form-item>
                  <el-form-item label="快递单号" style="width: 30%">
                    <span>{{ props.row.courierNumber}}</span>
                  </el-form-item>
                  <el-form-item label="留言">
                    <span>{{ props.row.leavingMessage }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
            <el-table-column prop="mobile" label="顾客手机号" align="center" show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
            <el-table-column prop="preDiscountPrice" label="折前价" align="center"
                             :formatter="formatterPreDiscountPrice"></el-table-column>
            <el-table-column prop="status" label="订单状态" align="center" :formatter="formatterStatus"></el-table-column>
            <el-table-column prop="totalPrice" label="折后价" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="paidPrice" label="支付金额" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="paidType" label="支付类型" align="center"
                             :formatter="formatterPaidType"></el-table-column>
            <el-table-column prop="refundNum" label="是否有退款"align="center"
                             :formatter="formatterRefundNum"></el-table-column>
            <el-table-column prop="delivered"
                             label="配送状态"
                             align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.delivered === 0 ? 'danger': scope.row.delivered === 1 ? 'warning' : 'success'"
                  close-transition>{{scope.row.delivered === 0 ? '未配送' : scope.row.delivered === 1 ? '配送中' : '已送达' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="changeReserveInfo(scope.row)">修改</el-button>
                <el-button type="text" :disabled="scope.row.delivered === 2 || scope.row.status === '1'" @click="sureSend(scope.row)">确认送达</el-button>
              </template>
            </el-table-column>
            <div style="display: none" prop="createdDate"></div>
          </el-table>
        </el-tooltip>

        <p class="block" style="float:right; ">
          <el-pagination
            @size-change="handleReserveSizeChange"
            @current-change="handleReserveCurrentChange"
            :current-page="reservePage"
            :page-sizes="reserveSizes"
            :page-size="reserveSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="reserveTotal">
          </el-pagination>
        </p>
        <el-dialog title="修改预定订单"
                   :visible.sync="changeReserveOrderInfoDialogVisible">
          <el-form :model="changeReserveOrderForm" label-position="left" inline class="demo-table-expand"
                   label-width="68px">
            <el-row :gutter="5" style="margin-left: 30%">
              <el-form-item label="快递名称" prop="courierName">
                <el-input v-model="changeReserveOrderForm.courierName" placeholder="请输入快递名称"></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="5" style="margin-left: 30%">
              <el-form-item label="快递单号" prop="courierNumber">
                <el-input v-model="changeReserveOrderForm.courierNumber" :maxlength="15"
                          placeholder="请输入快递单号"></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="5" style="margin-left: 30%">
              <el-form-item label="配送状态" prop="delivered">
                <el-select
                  clearable
                  filterable
                  v-model="changeReserveOrderForm.delivered"
                  placeholder="请选择配送状态">
                  <el-option
                    v-for="item in deliveredStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row :gutter="5" style="margin-left: 30%">
              <el-form-item label="收货人" prop="consignee">
                <el-input v-model="changeReserveOrderForm.consignee"></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="5" style="margin-left: 30%">
              <el-form-item label="收货地址" prop="address">
                <el-input v-model="changeReserveOrderForm.address"></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="5" style="margin-left: 30%">
              <el-form-item label="联系方式" prop="phoneNumber">
                <input v-model="changeReserveOrderForm.phoneNumber"
                       placeholder="请填写联系方式"
                       class="el-input__inner"
                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                       onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"/>
              </el-form-item>
            </el-row>
            <el-row :gutter="5" style="margin-left: 30%">
              <el-button type="primary" icon="el-icon-edit" round @click="saveChange" :loading="saveChangeLoading">保存
              </el-button>
              <el-button icon="el-icon-delete" round @click="changeReserveOrderInfoDialogVisible = false"
                         style="margin-left: 30px">取消
              </el-button>
            </el-row>
          </el-form>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="orderDetail">
        <span slot="label"><i class="el-icon-edit"></i> 订单详情</span>
        <div v-show="tipsShow" style="text-align: center; display: block">
          <span style="margin: 0 auto">请先选择订单</span>
        </div>
        <div v-show="contentShow">
          <el-card class="box-card" style="margin-top: 5px;">
            <el-form label-position="left" inline>
              <el-row :gutter="1" style="height: 50px">
                <el-col :span="4">
                  <el-form-item label="订单号:" style="line-height: 50px">
                    <span style="line-height: 50px"> {{orderBuyerInfo.orderId}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="支付金额:" style="line-height: 50px">
                    <span style="line-height: 50px"> {{orderBuyerInfo.paidPrice}}元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="顾客联系方式:" style="line-height: 50px">
                    <span style="line-height: 50px">{{orderBuyerInfo.mobile}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6" style="height: 50px;">
                  <el-form-item label="下单时间:" style="line-height: 50px">
                    <span
                      style="line-height: 50px">{{ orderBuyerInfo.createdDate ? orderBuyerInfo.createdDate.substring(0, orderBuyerInfo.createdDate.length - 2) : ''}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="付款时间:" style="line-height: 50px">
                    <span
                      style="line-height: 50px">{{ orderBuyerInfo.paidDate ? orderBuyerInfo.paidDate.substring(0, orderBuyerInfo.paidDate.length - 2) : ''}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="1" style="height: 50px" v-if="orderBuyerInfo.isReserve">
                <el-col :span="4" style="height: 50px;">
                  <el-form-item label="快递名称:" style="line-height: 50px" v-if="orderBuyerInfo.courierName !== undefined">
                    <span
                      style="line-height: 50px">{{ orderBuyerInfo.courierName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="height: 50px;">
                  <el-form-item label="快递单号:" style="line-height: 50px"
                                v-if="orderBuyerInfo.courierNumber !== undefined">
                    <span style="line-height: 50px">{{ orderBuyerInfo.courierNumber }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5" style="height: 50px;">
                  <el-form-item label="配送情况:" style="line-height: 50px" v-if="orderBuyerInfo.delivered !== undefined">
                    <span
                      style="line-height: 50px">{{ orderBuyerInfo.delivered == '0' ? '未配送' : orderBuyerInfo.delivered == '1' ? '配送中' : '已送达'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6" style="height: 50px;">
                  <el-form-item label="收货人:" style="line-height: 50px" v-if="orderBuyerInfo.consignee !== undefined">
                    <span style="line-height: 50px">{{ orderBuyerInfo.consignee }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5" style="height: 50px;">
                  <el-form-item label="收货地址:" style="line-height: 50px" v-if="orderBuyerInfo.address !== undefined">
                    <span style="line-height: 50px">{{ orderBuyerInfo.address }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="1" style="height: 50px" v-if="orderBuyerInfo.isReserve">
                <el-col :span="4">
                  <el-form-item label="联系方式:" style="line-height: 50px" v-if="orderBuyerInfo.phoneNumber != undefined">
                    <span style="line-height: 50px"> {{orderBuyerInfo.phoneNumber}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>

          <el-table class="box-card"
                    v-loading.body="orderDetailLoading"
                    element-loading-text="小喵使出了洪荒之力为您加载。。。"
                    :data="orderDetailList"
                    stripe
                    border
                    show-summary
                    :summary-method="getDetailSummaries"
                    style="width: 100%;">
            <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="count" label="购买量" align="center"></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价" align="center"
                             :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="salePrice" label="商品原价" align="center" :formatter="formatterMoney"></el-table-column>
            <el-table-column prop="preDiscountPrice" label="商品售价" align="center"
                             :formatter="formatterMoney"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-dialog title="修改订单金额" :visible.sync="orderInfoDialogShow">
        <div style="align-content:center">
          <el-form :model="orderInfo"
                   ref="orderInfoForm"
                   :rules="orderInfoRules"
                   v-loading="orderInfoLoading">
            <el-form-item prop="id" v-show="false">
              <el-input type="text" v-model="orderInfo.id"></el-input>
            </el-form-item>
            <el-form-item prop="status" v-show="false">
              <el-input type="text" v-model="orderInfo.status"></el-input>
            </el-form-item>
            <el-form-item label="订单金额" prop="totalPrice">
              <el-input type="number" v-model="orderInfo.totalPrice" placeholder="订单金额"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveOrderInfo(orderInfo)" :loading="saveOrderInfoLoading">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="订单差价补单" :visible.sync="repairOrderDialogShow">
        <div style="align-content:center;">
          <el-form :model="repairOrder" ref="repairOrderForm" :rules="repairOrderRules"
                   v-loading="repairOrderLoading">
            <el-form-item prop="id" v-show="false">
              <el-input type="text" v-model="repairOrder.id"></el-input>
            </el-form-item>
            <el-form-item label="商品个数" prop="count">
              <el-input style="width: 480px;" type="number" v-model="repairOrder.count"
                        focus="this.value=this.value.replace(/[^1-9]/g,'')" placeholder="商品个数"></el-input>
            </el-form-item>
            <el-form-item>
              <p><font color="red">补单时商品单价默认是0.1元</font></p>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveRepairOrder(repairOrder)" :loading="saveRepairOrderLoading">确定
          </el-button>
          <el-button @click="cancelRepairOrder">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="视频" :visible.sync="videoDialogShow" :close="resetShowVideoUrl">
        <div align="center">
          <el-form :model="videoUrl" ref="showVideoUrlForm">
            <el-form-item>
              <video controls autobuffer id="videoUrl1">
                <source type="video/mp4" :src="videoUrl">
                <source type="video/ogg" :src="videoUrl">
                <source type="video/webm" :src="videoUrl">
                <object :data="videoUrl">
                  <embed :src="videoUrl">
                </object>
              </video>
            </el-form-item>
          </el-form>
        </div>
        <!--<video>
          <source src="videoUrl" />
        </video>-->

      </el-dialog>
    </el-tabs>
  </div>
</template>
<script>

  import { fetchOfficeTree } from '../../api/office';
  import {
    fetchOrderDetailList,
    fetchOrderList,
    fetchReserveList,
    fetchSaveChange,
    getExcel,
    getReserveExcel,
    fetchUpdateByTotalPrice,
    fetchSaveRepairOrder, fetchOrderToNormal, fetchVideo, fetchSureSend
  } from '../../api/order';

  export default {
    created() {
      this.search();
      this.fetchOfficeCasc();
    },
    data() {
      return {
        orderSearchForm: {
          parentIdList: [],
          machineName: '',
          productNameForSearch: '',
          createdDate: '',
          orderId: '',
          mobile: '',
          dateTime: '',
          companyId: '',
          regionId: '',
          officeId: '',
          status: ''
        },
        offices: [],
        orderList: [],
        orderDetailList: [],
        // 分页
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        // 标签页
        activeName: 'orderAllList',
        // 记录当前选中的订单编号
        currentOrderId: '',
        contentShow: true,
        tipsShow: false,
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
        },
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        orderStatus: [{
          value: '3',
          label: '全部'
        }, {
          value: '2',
          label: '已支付'
        }, {
          value: '1',
          label: '未支付'
        }],
        orderStatusAddException: [{
          value: '3',
          label: '全部'
        }, {
          value: '2',
          label: '已支付'
        }, {
          value: '1',
          label: '未支付'
        }, {
          value: '0',
          label: '正常订单'
        }, {
          value: '-1',
          label: '异常订单'
        }],
        orderBuyerInfo: {},
        orderListLoading: false,
        orderDetailLoading: false,
        exportExcelLoading: false,
        officeDisabled: false,

        orderInfoDialogShow: false,
        orderInfoLoading: false,
        saveOrderInfoLoading: false,
        orderInfo: {
          id: '',
          status: '',
          totalPrice: ''
        },
        orderInfoRules: {
          totalPrice: [
            { required: true, message: '请输入订单价格', trigger: 'blur' }
          ]
        },
        videoUrl: '',
        videoDialogShow: false,
        repairOrderDialogShow: false,
        repairOrderLoading: false,
        saveRepairOrderLoading: false,
        repairOrder: {
          id: '',
          count: ''
        },
        repairOrderRules: {
          count: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (/^[1-9]\d*$/.test(value) === false) {
                  callback(new Error('商品数量请输入正整数'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ]
        },

        /* 预定 */
        reserveSearchForm: {
          parentIdList: [],
          machineName: '',
          productNameForSearch: '',
          createdDate: '',
          orderId: '',
          mobile: '',
          dateTime: '',
          companyId: '',
          regionId: '',
          officeId: '',
          status: '',
          address: '',
          delivered: '',
          consignee: '',
          courierNumber: ''
        },
        changeReserveOrderForm: {
          id: '',
          courierName: '',
          courierNumber: '',
          delivered: '',
          consignee: '',
          address: '',
          phoneNumber: ''
        },
        reserveListLoading: false,
        saveChangeLoading: false,
        exportReserveExcelLoading: false,
        changeReserveOrderInfoDialogVisible: false,
        reserveList: [],
        reservePage: 1,
        reserveSizes: [10, 20, 50, 100],
        reserveSize: 10,
        reserveTotal: 0,
        deliveredStatus: [{
          value: '0',
          label: '未配送'
        }, {
          value: '1',
          label: '配送中'
        }, {
          value: '2',
          label: '已送达'
        }]
      }
    },
    methods: {
      // 查询订单记录
      search() {
        this.orderListLoading = true;
        fetchOrderList(this.orderSearchForm, this.page, this.size).then(response => {
          if (response.response != null) {
            this.orderList = response.response;
            console.log(response.response)
            this.total = response.total;
          } else {
            this.orderList = [];
          }
          this.orderListLoading = false;
        });
      },
      exportExcel() {
        this.exportExcelLoading = true;
        getExcel(this.orderSearchForm).then(response => {
          this.exportExcelLoading = false;
          if (response.code === 0 && response.response != undefined && response.response != null && response.response.length > 0) {
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
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 初始化机构
      fetchOfficeCasc() {
        fetchOfficeTree().then(response => {
          if (response.code === 0 && response.response) {
            this.offices = response.response[0].children;
          }
        });
      },
      // 去除输入的非数字
      checkMobile(object) {
        object.mobile = object.mobile.replace(/[^0-9]/ig, '');
      },
      // 处理输入非数字
      checkNum(val) {
        this.orderSearchForm.orderId = val.replace(/[^\d]/g, '');
      },
      handleSizeChange(val) {
        this.size = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      getOrderDetail(row, event) {
        this.activeName = 'orderDetail';
        this.currentOrderId = row.id;
        this.orderBuyerInfo = {
          orderId: this.currentOrderId,
          mobile: row.mobile,
          createdDate: row.createdDate,
          paidDate: row.paidDate,
          paidPrice: row.paidPrice,
          isReserve: row.orderChannel === '1',
          courierName: row.courierName,
          courierNumber: row.courierNumber,
          delivered: row.delivered,
          consignee: row.consignee,
          address: row.address,
          phoneNumber: row.phoneNumber
        };
        this.orderDetailLoading = true;
        fetchOrderDetailList(this.currentOrderId).then(response => {
          this.orderDetailLoading = false;
          this.orderDetailList = response.response;
          this.contentShow = true;
          this.tipsShow = false;
        })
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元';
        } else {
          return cellValue;
        }
      },
      formatterStatus(row, column, cellValue) {
        if (cellValue) {
          if (cellValue === '1') {
            return '未付款';
          } else if (cellValue === '2') {
            return '已付款';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },
      formatterIsException(row, column, cellValue) {
        if (cellValue) {
          if (cellValue === -1) {
            return '异常订单';
          } else if (cellValue === 1) {
            return '异常订单';
          } else if (cellValue === 2) {
            return '正常订单';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },

      formatterWeight(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '克';
        } else {
          return cellValue;
        }
      },
      formatterRefundNum(row, column, cellValue) {
        if (cellValue) {
          return '是';
        } else {
          return '否';
        }
      },
      formatterSmsCount(row, column, cellValue) {
        if (cellValue || cellValue === 0 ) {
          return cellValue + '次';
        } else {
          return cellValue;
        }
      },
      formatterPaidType(row, column, cellValue) {
        if (cellValue) {
          if (row.status === '2') {
            if (cellValue === '0') {
              return '余额支付';
            } else if (cellValue === '1') {
              return '微信支付';
            } else if (cellValue === '2') {
              return '支付宝支付';
            } else {
              return '其他支付方式';
            }
          } else {
            return '';
          }
        }
      },
      formatterPreDiscountPrice(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元'
        } else {
          if (row.totalPrice) {
            return row.totalPrice + '元';
          } else {
            return cellValue;
          }
        }
      },
      handleChange(value) {
        if (value[0]) {
          this.orderSearchForm.companyId = value[0]
        } else {
          this.orderSearchForm.companyId = null
        }
        if (value[1]) {
          this.orderSearchForm.regionId = value[1]
        } else {
          this.orderSearchForm.regionId = null
        }
        if (value[2]) {
          this.orderSearchForm.officeId = value[2]
        } else {
          this.orderSearchForm.officeId = null
        }
      },
      // 预定
      searchReserveList() {
        this.reserveListLoading = true;
        fetchReserveList(this.reserveSearchForm, this.reservePage, this.reserveSize).then(response => {
          this.reserveListLoading = false;
          if (response.code === 0) {
            this.reserveList = response.response;
            this.reserveTotal = response.total;
          }
        });
      },
      // 统计
      getDetailSummaries(param) {
        if (param.data && param.data.length > 0) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '合计';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            let ind = 0;
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  let result;
                  if (index === 1) {
                    result = (Number(prev) + Number(curr)).toFixed(2);
                  } else {
                    let count = Number(data[ind].count);
                    if (!count) {
                      count = 1;
                    }
                    result = (Number(prev) + Number(Number(curr) * count)).toFixed(2);
                  }
                  ind++;
                  return result;
                } else {
                  ind++;
                  return prev;
                }
              }, 0);
              if (index !== 0 && index !== 1) {
                sums[index] += ' 元';
              } else if (index === 1) {
                sums[index] = parseInt(sums[index])
              }
            }
          });
          return sums;
        }
        return '';
      },
      getOrderSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index !== 0 && index !== 1 && index !== 2 && index !== 4 && index !== 5 && index !== 7 && index !== 8 && index !== 11) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return (Number(prev) + Number(curr)).toFixed(2);
                } else {
                  return prev;
                }
              }, 0);
              if (index === 9 || index === 10) {
                sums[index] += ' 克';
              } else {
                sums[index] += ' 元';
              }
            }
          }
        });
        return sums;
      },
      getReserveSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index !== 0 && index !== 1 && index !== 2 && index !== 3 && index !== 5 && index !== 8 && index !== 9 && index !== 10) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return (Number(prev) + Number(curr)).toFixed(2);
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 元';
            }
          }
        });
        return sums;
      },
      exportReserveExcel() {
        this.exportReserveExcelLoading = true;
        getReserveExcel(this.reserveSearchForm).then(response => {
          this.exportReserveExcelLoading = false;
          if (response.code === 0 && response.response != undefined && response.response != null && response.response.length > 0) {
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
          }
        });
      },
      saveChange() {
        this.saveChangeLoading = true;
        fetchSaveChange(this.changeReserveOrderForm).then(response => {
          this.saveChangeLoading = false;
          if (response.code === 0) {
            this.searchReserveList();
            this.$message('修改成功');
            this.changeReserveOrderInfoDialogVisible = false;
          }
        })
      },
      changeReserveInfo(row) {
        this.changeReserveOrderForm.id = row.id;
        this.changeReserveOrderForm.address = row.address;
        this.changeReserveOrderForm.consignee = row.consignee;
        this.changeReserveOrderForm.courierName = row.courierName;
        this.changeReserveOrderForm.courierNumber = row.courierNumber;
        this.changeReserveOrderForm.delivered = row.delivered.toString();
        this.changeReserveOrderForm.phoneNumber = row.phoneNumber;
        this.changeReserveOrderInfoDialogVisible = true;
      },
      sureSend(row) {
        let msg = '是否确认送达?';
        const _this = this;
        if (row.status === '1') {
          msg = '对方尚未付款,' + msg;
        } else {
          this.$confirm(msg, '提示', {
            title: '确认送达',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            fetchSureSend(row.id).then(response => {
              if (response.code === 0) {
                _this.$message({
                  type: 'success',
                  message: '确认送达成功!'
                });
                _this.$nextTick(function() {
                  _this.searchReserveList();
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '确认送达失败!'
                });
              }
            })
          }).catch(() => {});
        }
      },
      handleReserveSizeChange(val) {
        this.reserveSize = val;
        this.searchReserveList();
      },
      handleReserveCurrentChange(val) {
        this.reservePage = val;
        this.searchReserveList();
      },
      /* 通用 */
      selectTab(va) {
        if (va.name === 'orderDetail') {
          // 若是没有选中订单则提示用户
          if (this.currentOrderId === '') {
            this.contentShow = false;
            this.tipsShow = true;
          } else {
            this.contentShow = true;
            this.tipsShow = false;
          }
        } else if (va.name === 'reserve') {
          this.searchReserveList();
        }
      },
      resetShowVideoUrl() {
        if (this.$refs.showVideoUrlForm) {
          this.resetForm('showVideoUrlForm');
        }
      },
      cancel() {
        this.resetOrderInfo1();
        this.orderInfoDialogShow = false;
      },
      updateByTotalPrice(index, row) {
        this.orderInfo.id = row.id;
        this.orderInfoDialogShow = true;
      },
      saveOrderInfo(data) {
        this.$refs.orderInfoForm.validate(valid => {
          if (valid) {
            this.saveOrderInfoLoading = true;
            fetchUpdateByTotalPrice(data).then(response => {
              this.orderInfoDialogShow = false;
              if (response.code === 0) {
                this.saveOrderInfoLoading = false;
                this.search();
                this.resetOrderInfo1();
              }
            });
            this.saveDealLoading = false;
          }
        })
      },
      repairOrderDialog(index, row) {
        this.repairOrder.id = row.id;
        this.repairOrderDialogShow = true;
      },
      saveRepairOrder(data) {
        this.saveRepairOrderLoading = true;
        this.$refs.repairOrderForm.validate(valid => {
          if (valid) {
            fetchSaveRepairOrder(data).then(response => {
              if (response.code === 0) {
                this.saveRepairOrderLoading = false;
                this.search();
                this.resetRepairOrder();
                this.repairOrderDialogShow = false;
              } else {
                this.repairOrderDialogShow = false;
              }
            })
          } else {
            this.saveRepairOrderLoading = false;
            return false;
          }
        })
      },
      resetRepairOrder() {
        if (this.$refs.repairOrderForm) {
          this.resetForm('repairOrderForm');
        }
      },
      cancelRepairOrder() {
        this.resetRepairOrder();
        this.repairOrderDialogShow = false;
      },
      getVideo(index, row) {
        fetchVideo(row.id).then(response => {
          if (response.code === 0) {
            this.$message({
              showClose: true,
              message: '请求视频成功，请五分钟刷新(请不要重复请求)',
              duration: 4000,
              type: 'success'
            });
          } else {
            this.$message({
              showClose: true,
              message: response.desc,
              duration: 4000,
              type: 'error'
            });
          }
        })
      },
      toNormal(index, row) {
        fetchOrderToNormal(row.id).then(response => {
          if (response.code === 0) {
            this.$message({
              showClose: true,
              message: '修改成功',
              duration: 3000,
              type: 'success'
            });
            this.search();
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
