<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName">
      <el-tab-pane name="machineList">
        <span slot="label"><i class="el-icon-document"></i> 设备列表</span>
          <el-form :inline="true" :model="machineSearch" class="demo-form-inline">
            <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="机构">
                <el-cascader
                  :options="offices"
                  v-model="machineSearch.officeIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  style="width:240px">
                </el-cascader>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="设备名称">
                <el-input v-model="machineSearch.machineName" placeholder="设备名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="站点">
                <el-input v-model="machineSearch.stationName" placeholder="站点名称"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="状态">
                <el-select v-model="machineSearch.machineStatus" clearable placeholder="请选择设备状态">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
            <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="网点类型">
                <el-select v-model="machineSearch.branchType" clearable placeholder="请选择网点类型">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item>
                <el-button type="primary" icon="getMachineList" @click="getMachineList">查询</el-button>
                <el-button icon="plus" @click="addMachine(1)">新增</el-button>
              </el-form-item>
            </el-col>
        </el-row>
          </el-form>

        <el-table
          ref="multipleTable"
          v-loading="machineListLoading"
          :data="machineList"
          stripe
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <machineDetail :machine="props.row"></machineDetail>
            </template>
          </el-table-column>

          <el-table-column
            prop="machineName"
            label="设备名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="officeName"
            label="机构"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="address"
            label="地址"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="machineStatus"
            label="状态"
            align="center"
            :formatter="formatterStatus"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="branchType"
            label="网点类型"
            align="center"
            :formatter="formatterBranchType"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="qrcodeUrl" label="二维码" align="center">
            <template slot-scope="scope">
              <el-popover
                ref="qrcodeUrlImg"
                placement="right"
                trigger="hover">
                <img :src="scope.row.qrcodeUrl" style="width:120px;height:120px;"/>
              </el-popover>
              <el-button v-popover:qrcodeUrlImg type="text" v-if="scope.row.qrcodeUrl">查看</el-button>
              <a :href="scope.row.qrcodeUrl" :download="scope.row.machineName"><font color="#4db3ff">下载</font></a>
            </template>
          </el-table-column>

          <el-table-column
            prop="stationName"
            label="所属站点"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="isGravitySensor" label="设备类型" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.isGravitySensor" placeholder="请选择" @change="versionChange(scope.row)">
                <el-option
                  v-for="item in machineTypeProps"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="400px" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="machineEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="machineDelete(scope.$index, scope.row)">删除
              </el-button>
              <el-button
                v-show="scope.row.machineStatus === 1 ? true:false"
                size="small"
                @click="installIsOk(scope.$index, scope.row)">已装
              </el-button>
              <el-button
                v-show="scope.row.machineStatus === 2 ? true:false"
                size="small"
                type="warning"
                @click="preRemove(scope.$index, scope.row)">撤点
              </el-button>
              <el-button
                size="small"
                type="info"
                @click="toMachineProductDetail(scope.$index, scope.row)">更多设备信息
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogShow" :close="resetForm">
          <div style="align-content:center">
            <el-form :inline="true" :model="machine" label-position="left" ref="machineForm" :rules="machineFormRules"
                     v-loading="formLoading" label-width="200px"
                     style="margin: 0 3%">

              <el-form-item label="设备名称" prop="machineName" label-width="100px">
                <el-input style="width: 480px;" v-model="machine.machineName" placeholder="设备名称"></el-input>
              </el-form-item>

              <el-form-item label="设备状态" prop="machineStatus" label-width="100px">
                <el-select v-model="machine.machineStatus" filterable clearable placeholder="请选择设备状态"
                           style="width:480px">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="parseInt(item.value)"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="机构" prop="officeIdList" label-width="100px">
                <el-cascader
                  :disabled="officeDisbled"
                  :options="offices"
                  v-model="machine.officeIdList"
                  :props="cascaderProps"
                  clearable
                  @change="handleMachineChange"
                  placeholder="机构"
                  style="width:480px">
                </el-cascader>
              </el-form-item>

              <el-form-item label="所在地" prop="preAddress" label-width="100px">
                <el-input style="width: 480px;" v-model="machine.preAddress" placeholder="所在地"
                          ref="preAddress"></el-input>
              </el-form-item>

              <el-form-item label="网点类型" prop="branchType" label-width="100px">
                <el-select v-model="machine.branchType" filterable clearable placeholder="网点类型" style="width:480px">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="parseInt(item.value)">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="地址" prop="address" label-width="100px">
                <el-input style="width: 480px;" v-model="machine.address" placeholder="地址"></el-input>
              </el-form-item>

              <el-form-item label="安装时间" prop="installDate" label-width="100px" v-show=installDateShow>
                <el-date-picker
                  v-model="machine.installDate"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions0"
                  style="width: 480px;">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="网点" prop="branchId" label-width="100px">
                <el-select v-model="machine.branchId" filterable clearable placeholder="选择网点" style="width: 480px;">
                  <el-option v-for="branch in branchList" :key="branch.id" :label="branch.companyName"
                             :value="parseInt(branch.id)"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="站点" prop="stationId" label-width="100px">
                <el-select v-model="machine.stationId" filterable clearable placeholder="选择站点" style="width: 480px;">
                  <el-option v-for="station in stations" :key="station.id" :label="station.stationName"
                             :value="parseInt(station.id)"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="设备类型" prop="dtId" label-width="100px">
                <el-select v-model="machine.dtId" filterable clearable placeholder="选择设备类型" style="width: 480px;">
                  <el-option v-for="deviceType in deviceTypeList" :key="deviceType.id" :label="deviceType.dtName"
                             :value="parseInt(deviceType.id)"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="加盟商" prop="franchiseesId" label-width="100px">
                <el-select v-model="machine.franchiseesId" filterable clearable style="width: 480px;">
                  <el-option v-for="item in franchisees" :key="item.id" :label="item.name"
                             :value="parseInt(item.id)"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="templateHidden" label="商品模板" prop="templateId" label-width="100px">
                <el-select v-model="machine.templateId" filterable clearable placeholder="选择模板" style="width: 480px;">
                  <el-option v-for="template in machineAddTemplates" :key="template.id" :label="template.templateName"
                             :value="parseInt(template.id)"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="备注" prop="note" label-width="100px">
                <el-input style="width: 480px;" v-model="machine.note" placeholder="备注"></el-input>
              </el-form-item>

              <el-form-item prop="id">
                <el-input :hidden="true" style="width: 50px;" v-model="machine.id"></el-input>
              </el-form-item>

            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveMachine" :loading="saveLoading">确定</el-button>
            <el-button @click="dialogShow = false">取消</el-button>
          </div>
        </el-dialog>

        <el-dialog title="撤点原因" :visible.sync="removeDialogShow" v-on:close="resetForm2">
          <div style="align-content:center">
            <el-form :model="removeDetail" ref="removeDetailForm" :rules="removeDetailRules"
                     v-loading="removeDetailLoading"
            >
              <el-form-item prop="id" v-show="false">
                <el-input type="text" v-model="removeDetail.id"></el-input>
              </el-form-item>
              <el-form-item prop="revocation">
                <el-input type="textarea" v-model="removeDetail.revocation" :autosize="{ minRows: 4}"
                          placeholder="请输入撤点原因"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveRemoveDeal(removeDetail)" :loading="saveDealLoading">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="machineDetail" @tab-click="clickMachineDetail">
        <span slot="label"><i class="el-icon-date"></i> 设备信息</span>
        <el-alert v-if="!machineDetail.id" :closable="false"
                  title="请选择一台设备,才能查看更多信息！！！" type="warning">
        </el-alert>
        <el-card v-if="machineDetail.id" class="box-card">
          <machineDetail :machine="machineDetail"></machineDetail>
        </el-card>
        <el-card v-if="machineDetail.id" class="box-card" style="margin-top:10px">
          <div slot="header" class="clearfix" style="height: 28px;">
            <span style="line-height: 18px;" v-if="machineDetail.id">设备更多操作</span>
            <el-button v-if="machineDetail.status===0" type="info" size="small" @click="updateMachineStatus"
                       :disabled="bl">同步阿里云
            </el-button>
            <el-button v-if="machineDetail.status===1" size="small" :plain="true" :disabled="true">已同步阿里云</el-button>
            <el-button v-if="machineDetail.id" type="info" size="small" @click="getProductModel">初始化商品</el-button>
            <span style="line-height: 18px;" v-if="machineDetail.id">设备在售商品</span>
            <el-button v-if="machineDetail.id" type="info" size="small" @click="getProducts">上架</el-button>
            <el-button v-if="machineDetail.id" type="info" size="small" @click="offProduct">下架</el-button>
            <el-input id="newFloor" style="width: 100px;" type="number" pattern="[0-9]*" :min="1" :max="10"
                      v-model="this.newFloor"   v-show="editFloors"></el-input>
            <el-button v-show="!editFloors" type="info" @click='editMoveMachineProductOnFloor' size="mini">批量修改层数</el-button>
            <el-button v-show="editFloors" type="info" @click='saveMoveMachineProductOnFloor' size="mini">提交</el-button>
          </div>
          <el-input v-model="machineProductCardSelect" placeholder="输入商品名称筛选"
                    style="margin-bottom:10px;width:15%" v-on:change="machineProductCardSelectChange"></el-input>
          <el-table
            v-loading="machineProductsLoading"
            @selection-change="handleMachinesProductSelectionChange"
            :data="machineProductsResult"
            border
            height='600'
            stripe
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="productId" label="商品ID"></el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column prop="onFloor" label="商品所在层数">
              <template slot-scope="scope">
                <el-input style="width: 100px;" type="number" pattern="[0-9]*" :min="1" :max="10"
                          v-model.number="scope.row.newFloor"  v-show="scope.row.edit"></el-input>
                <span v-show="!scope.row.edit">{{ scope.row.onFloor }}</span>
                <el-button v-show="!scope.row.edit" type="text" @click='editFloor(scope.row)' size="mini">修改</el-button>
                <el-button v-show="scope.row.edit" type="text" @click='saveFloor(scope.row)' size="mini">提交</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="tasteName" label="商品口味"></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价"></el-table-column>
            <el-table-column prop="salePrice" label="商品售价" aligin="center">
              <!--<template slot-scope="scope">
                <el-input style="width: 100px;" type="number" pattern="[0-9]*"
                          v-model.number="scope.row.newSalePrice" v-show="scope.row.salePriceEdit"></el-input>
                <span v-show="!scope.row.salePriceEdit">{{ scope.row.salePrice }}</span>
                <el-button v-show='!scope.row.salePriceEdit' type="text" @click='editSalePrice(scope.row)' size="mini">
                  修改
                </el-button>
                <el-button v-show='scope.row.salePriceEdit' type="text" @click='saveSalePrice(scope.row)' size="mini">
                  提交
                </el-button>
              </template>-->
            </el-table-column>
            <el-table-column prop="stock" label="库存"></el-table-column>
          </el-table>
          <p class="block" style="float:right">
            <el-pagination
              layout="total"
              :total="machineProductsTotal">
            </el-pagination>
          </p>
        </el-card>
        <el-dialog title="商品列表" :visible.sync="productDialogShow">
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
            <el-table-column prop="productId" label="商品ID"></el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column prop="tasteName" label="口味"></el-table-column>
            <el-table-column prop="salePrice" label="售价"></el-table-column>
            <el-table-column prop="purchasePrice" label="进价"></el-table-column>
            <el-table-column prop="floors" label="商品所在层">
              <template slot-scope="scope">
                <el-input-number v-model="num" size="mini" @change="allFloor" controls-position="right" :min="1" :max="10"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
          <p class="block" style="float:left">
            <el-pagination
              layout="total"
              :total="productTotal">
            </el-pagination>
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addProduct" :loading="saveLoading">确定</el-button>
            <el-button @click="productDialogShow = false">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="利用模板初始化商品列表" :visible.sync="newProductDialogShow">
          <el-form :model="machineDetail" label-position="left" ref="productModel" class="product-form"
                   v-loading="formLoading" label-width="100px" style="margin: 0 3%">
            <el-form-item label="设备名称" prop="machineName1">
              <el-input v-model="machineDetail.machineName" placeholder="设备名称" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品模板" prop="categoryId">
              <el-select v-model="template.id" filterable clearable placeholder="选择模板" style="width:100%">
                <el-option v-for="template in templates" :key="template.id" :label="template.templateName"
                           :value="parseInt(template.id)"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="initByTemplate" :loading="saveLoading">确定</el-button>
            <el-button @click="newProductDialogShow = false">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    fetchMachineList,
    fetchDeleteMachine,
    fetchSaveMachine,
    fetchUpdateMachine,
    fetchMachinesProduct,
    fetchUpdateMachineStatus,
    offProduct,
    addProduct,
    fetchDownLoad,
    initByTemplate,
    updateSalePrice,
    fetchUadateMachineStatus,
    fetchBranchList,
    fetchProductList,
    fetchVersionChange
  } from 'api/machine';
  import {fetchUpdateFloor, fetchUpdateMoveFloor} from 'api/areaProduct';
  import {fetchOfficeTree} from 'api/office';
  import {fetchOffice} from 'utils/office';
  import {fetchTemplateList} from 'api/template';
  import {fetchStationList} from 'api/station';
  import {fetchDeviceTypeList} from 'api/deviceType';
  import machineDetail from './machineDetail'
  import {getFrachisees} from "../../api/franchisees";

  export default {
    created() {
      this.getMachineList()
      this.getOffices()
      this.getBranchList()
    },
    components: {
      machineDetail
    },
    data() {
      return {
        activeName: 'machineList',
        deviceTypeList: [],
        num: 2,
        newFloor:1,
        editFloors:false,
        productDetail: {},
        machineSearch: {
          name: '',
          mobile: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeIdList: [],
          machineName: '',
          stationName: '',
          machineStatus: '',
          branchType: ''
        },
        offices: [],
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        machineTypeProps: [{
          value: 2,
          label: '非重力感应'
        }, {
          value: 1,
          label: '重力感应'
        }, {
          value: 3,
          label: '重力解析'
        }],
        machineList: [],
        machineDetail: {},
        bl: false,
        machineProductsSelection: [],
        machineListLoading: false,
        machineProductsLoading: false,
        machineProducts: [],
        machineProductCardSelect: '',
        machineProductsResult: [],
        machineProductsTotal: 0,
        productTotal: 0,
        productDialogShow: false,
        productDialogLoading: false,
        productDialogSelect: '',
        productsResult: [],
        products: [],
        productsSelection: [],
        //模板
        newProductDialogShow: false,
        newProductDialogLoading: false,
        templates: [],
        stations: [],
        station: {},
        dl: {},
        franchisees: [],
        machineAddTemplates: [],
        templateHidden: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        officeDisbled: false,
        filterText: '',
        installDateShow: true,
        branchList: [],
        machine: {
          id: '',
          machineName: '',
          officeIdList: [],
          officeId: '',
          regionId: '',
          companyId: '',
          officeName: '',
          regionName: '',
          companyName: '',
          preAddress: '',
          address: '',
          qrcodeUrl: '',
          qrcode: '',
          note: '',
          templateId: '',
          stationId: '',
          franchiseesId: '',
          dtId: '',
          stationName: '',
          machineStatus: '',
          installDate: '',
          branchType: '',
          branchId: '',
          branchName: '',
          peopleNumber: '',
          buildingName: '',
          area: '',
          isGravitySensor:''
        },
        role: {
          id: '',
          name: '',
          enName: '',
          officeId: '',
          menuIds: [],
          remarks: ''
        },
        template: {
          id: '',
          templateName: ''
        },
        options1: [{
          value: 1,
          label: '未安装',
          disabled: false
        }, {
          value: 2,
          label: '运营中',
          disabled: true
        }, {
          value: 3,
          label: '已撤点',
          disabled: true
        }],
        options2: [{
          value: 1,
          label: '直营'
        }, {
          value: 2,
          label: '加盟商运营'
        }, {
          value: 3,
          label: '加盟商委托总部运营'
        }],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        removeDialogShow: false,
        removeDetail: {
          id: '',
          revocation: '',
          machineStatus: ''
        },
        removeDetailLoading: false,
        saveDealLoading: false,
        machineFormRules: {
          machineName: [
            {required: true, message: '请输入设备名称', trigger: 'blur'}
          ],
          officeIdList: [
            {type: 'array', required: true, message: '请选择机构', trigger: 'change'}
          ],
          preAddress: [
            {required: true, message: '请输入所在地', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ],
          machineStatus: [
            {type: 'number', required: true, message: '请选择设备状态', trigger: 'blur'}
          ],
          branchType: [
            {type: 'number', required: true, message: '请选择网点类型', trigger: 'blur'}
          ]
          /*,
          stationId: [
            {type: 'number', required: true, message: '请选择站点', trigger: 'blur'}
          ]*/
        },
        removeDetailRules: {
          revocation: [
            {required: true, message: '请输入撤点原因', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getMachineList() {
        this.machineListLoading = true
        fetchMachineList(this.machineSearch, this.page, this.size).then(response => {
          this.machineListLoading = false
          this.machineList = response.response
          this.total = response.total
        })
      },
      getBranchList() {
        fetchBranchList().then(response => {
          this.branchList = response.response
        })
      },
      getOffices() {
        fetchOfficeTree().then(response => {
          if (response.response) {
            this.offices = response.response[0].children
          }
        })
      },

      allFloor(value){
        //console.log(value);
        this.num = value;
      },

      machineEdit(index, row) {
        console.log('row.machineStatus=' + row.machineStatus)
        this.templateHidden = false;
        this.dialogTitle = '编辑设备';
        if (row.machineStatus !== 1) {
          this.options1[0].disabled = true;
          this.options1[1].disabled = false;
          this.options1[2].disabled = true;
        } else {
          this.options1[0].disabled = true;
          this.options1[1].disabled = false;
          this.options1[2].disabled = true;
        }
        /*编辑设备时安装时间不显示*/
        this.installDateShow = false;
        this.getDeviceTypeList();
        this.dialogShow = true;
        this.formLoading = true;
        fetchUpdateMachine(row.id).then(response => {
          this.formLoading = false;
          this.machine = response.response;
          /*编辑设备时将安装时间设置为空字符串，后台不更新*/
          this.machine.installDate = '';
          this.machine.officeIdList = [];
          this.machine.officeIdList.push(response.response.companyId.toString());
          this.machine.officeIdList.push(response.response.regionId.toString());
          this.machine.officeIdList.push(response.response.officeId.toString());
        })
      },
      formatterStatus(row, column, cellValue) {
        if (cellValue) {
          if (cellValue === 1) {
            return '未安装';
          } else if (cellValue === 2) {
            return '运营中';
          } else if (cellValue === 3) {
            return '已撤点';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },
      formatterBranchType(row, column, cellValue) {
        if (cellValue) {
          if (cellValue === 1) {
            return '直营';
          } else if (cellValue === 2) {
            return '加盟商运营';
          } else if (cellValue === 3) {
            return '加盟商委托总部运营';
          } else {
            return cellValue;
          }
        } else {
          return cellValue;
        }
      },
      machineDelete(index, row) {
        this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.machineListLoading = true
          fetchDeleteMachine(row.id).then(response => {
            this.getMachineList();
            this.$message.success('删除成功')
          })
        })
      },
      installIsOk(index, row) {
        const updateMachineStatus2 = row
        updateMachineStatus2.machineStatus = 2
        updateMachineStatus2.installDate = ''
        fetchSaveMachine(updateMachineStatus2).then(response => {
          row.machineStatus = 2
          this.$message.success('操作成功')
        })
      },
      preRemove(index, row) {
        this.removeDetail.id = row.id
        this.removeDetail.machineStatus = 3
        this.removeDialogShow = true
      },
      saveRemoveDeal(data) {
        this.saveDealLoading = true
        const removeDet = data
        this.$refs['removeDetailForm'].validate((valid) => {
          if (valid) {
            fetchUadateMachineStatus(removeDet).then(response => {
              if (response.code === 0) {
                this.saveDealLoading = false
                this.getMachineList()
                this.resetForm2()
                this.removeDialogShow = false
              } else {
                this.saveDealLoading = false
              }
            })
          } else {
            this.saveDealLoading = false
            return false
          }
        })
      },
      toMachineProductDetail(index, row) {
        this.activeName = 'machineDetail'
        this.machineDetail = row
        this.getMachinesProduct()
      },

      getMachinesProduct() {
        this.machineProductCardSelect = ''
        this.machineProductsLoading = true
        fetchMachinesProduct(this.machineDetail).then(response => {
          this.machineProductsLoading = false
          this.machineProducts = response.response
          this.machineProductsResult = response.response
          this.machineProductsTotal = this.machineProductsResult.length
        })
      },

      addMachine(index) {
        this.dialogTitle = '新增设备'
        this.getDeviceTypeList()
        this.dialogShow = true
        this.resetForm()
        this.installDateShow = true
        this.options1[0].disabled = false
        this.options1[1].disabled = true
        this.options1[2].disabled = true
        this.machineAddTemplates = ''
        this.templateHidden = true
        this.stations = ''
      },
      saveMachine() {
        this.$refs['machineForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            if (this.machine.stationId) {
              this.machine.stationName = this.stations.find((item) => {
                return item.id === this.machine.stationId
              }).stationName
            } else {
              this.machine.stationName = ''
            }
            if (this.machine.branchId) {
              this.machine.branchName = this.branchList.find((item) => {
                return item.id === this.machine.branchId
              }).companyName
            } else {
              this.machine.branchName = ''
            }
            fetchSaveMachine(this.machine).then(response => {
              this.getMachineList()
              this.saveLoading = false
              this.$message.success('保存成功')
              this.dialogShow = false
            })
          } else {
            return false
          }
        })
      },
      //修改设备在售商品在货架的位置
      editMoveMachineProductOnFloor() {
        const machineProducts = []
        this.machineProductsSelection.forEach(item => {
          const areaProduct = new Object();
          areaProduct.machineId = item.machineId
          areaProduct.productId = item.productId
          areaProduct.onFloor = item.onFloor
          machineProducts.push(areaProduct)
        })
        if (machineProducts.length > 0) {
          this.editFloors = true

        } else {
          this.$message.error('请至少选择一条记录后再进行批量修改操作')
        }
      },
      saveMoveMachineProductOnFloor(){
        var floorText = document.getElementById("newFloor").value;
        if(floorText < 1 || floorText > 10){
          this.$message({
            message: '输入的层数不在正确范围内！！！',
            type: 'error',
            duration: 2000
          });
          return
        }
        const machineProducts = []
        this.machineProductsSelection.forEach(item => {
          const areaProduct = new Object();
          areaProduct.machineId = item.machineId
          areaProduct.productId = item.productId
          areaProduct.tasteId = item.tasteId
          //console.log(this.newFloor)
          areaProduct.onFloor = floorText
          machineProducts.push(areaProduct)
        })
        fetchUpdateMoveFloor(machineProducts).then(response => {
          //console.log(machineProducts)
          this.$message.success('修改成功！！')
          this.machineProductsSelection = []
          this.getMachinesProduct()
        })
        this.editFloors = false
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
      machineProductCardSelectChange() {
        this.machineProductsResult = [];
        this.machineProducts.forEach(item => {
          if (!this.machineProductCardSelect) {
            this.machineProductsResult.push(item)
          } else {
            if (item.productName.indexOf(this.machineProductCardSelect) !== -1) {
              this.machineProductsResult.push(item)
            }
          }
        })
        this.machineProductsTotal = this.machineProductsResult.length
      },
      resetForm() {
        if (this.$refs['machineForm']) {
          this.$refs['machineForm'].resetFields();
        }
        this.saveLoading = false
      },
      resetForm2() {
        if (this.$refs['removeDetailForm']) {
          this.$refs['removeDetailForm'].resetFields();
          console.log("##################################################")
        }
      },
      versionChange(data){
        let machineInfo = new Object()
        machineInfo.id = data.id
        machineInfo.isGravitySensor = data.isGravitySensor
        fetchVersionChange(machineInfo).then(response => {
          if (response.code === 0) {
            this.$message.success('设备版本切换成功')
          } else {
              if (data.isGravitySensor === 1) {
                data.isGravitySensor = 2
                this.$message.warning('设备版本切换失败')
              } else if (data.isGravitySensor === 2){
                data.isGravitySensor = 1
                this.$message.warning('设备版本切换失败')
              }
          }
        })

      },
      cancel() {
        this.resetForm2()
        this.removeDialogShow = false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleSizeChange(val) {
        this.size = val
        this.getMachineList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getMachineList()
      },
      handleChange(value) {
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
      handleMachineChange(value) {
        if (value[0]) {
          this.machine.companyId = value[0]
        } else {
          this.machine.companyId = ''
        }
        if (value[1]) {
          this.machine.regionId = value[1]
        } else {
          this.machine.regionId = ''
        }
        if (value[2]) {
          this.machine.officeId = value[2]
        } else {
          this.machine.officeId = ''
        }
        fetchOffice(this.offices, this.machine, value);
        console.log("this.machineSearch.companyId=========" + this.machineSearch.companyId);
        fetchTemplateList({'companyId': this.machine.companyId}, 1, 10000).then(response => {
          this.newProductDialogLoading = false
          this.machineAddTemplates = response.response
        })
        this.getStationList();
      },
      handleMachinesProductSelectionChange(val) {
        this.machineProductsSelection = val
      },
      handleProductsSelectionChange(val) {
        this.productsSelection = val
      },
      clickMachineDetail() {
        if (!machineDetail.id) {
          activeName = 'machineList'
          this.$notify({
            title: '警告',
            message: '请选择设备后再查看商品信息',
            type: 'warning'
          });
        }
      },
      getProducts() {
        this.productDialogSelect = ''
        this.productDialogShow = true
        this.productDialogLoading = true
        fetchProductList(this.machineDetail.id).then(response => {
          this.productDialogLoading = false
          this.products = response.response
          this.productsResult = response.response
          this.productTotal = this.productsResult.length
        })
      },

      addProduct() {
        let products = []
        this.productsSelection.forEach(item => {
          let product = new Object()
          product.productId = item.productId
          product.machineId = this.machineDetail.id
          product.tasteId = item.tasteId
          product.onFloor = this.num
          products.push(product)
        })
        if (products.length > 0) {
          this.saveLoading = true
          addProduct(products).then(response => {
            this.saveLoading = false
            this.productDialogShow = false
            this.$message.success('上架成功')
            this.getMachinesProduct()
          })
        } else {
          this.$message.error('请至少选择一条后再进行上架操作')
        }
      },

      offProduct() {
        let machineProducts = []
        this.machineProductsSelection.forEach(item => {
          let machineProduct = new Object()
          machineProduct.machineId = item.machineId
          machineProduct.productId = item.productId
          machineProduct.tasteId = item.tasteId
          machineProducts.push(machineProduct)
        })
        if (machineProducts.length > 0) {
          offProduct(machineProducts).then(response => {
            this.$message.success('下架成功')
            this.getMachinesProduct()
          })
        } else {
          this.$message.error('请至少选择一条后再进行下架操作')
        }
      },

      editFloor(machine) {
        machine.edit = true;
        machine.newFloor = machine.onFloor
      },
      saveFloor(machine) {
        if(machine.newFloor < 1 || machine.newFloor > 10){
          this.$message({
            message: '输入的层数不在正确范围内！！！',
            type: 'error',
            duration: 2000
          });
          return
        }
        fetchUpdateFloor({'machineId':machine.machineId,'productId':machine.productId,'tasteId':machine.tasteId,'onFloor':machine.newFloor}).then(response => {
          if (response.code === 0) {
            machine.onFloor = machine.newFloor
            machine.edit=false
          }
        })
      },

      updateMachineStatus() {
        fetchUpdateMachineStatus(this.machineDetail.id).then(response => {
          if (response.response.status == 1) {
            this.$message.success('同步成功')
            toMachineProductDetail(1, this.machineDetail.id)
            this.bl = true;
          } else {
            this.$message.error('同步失败')
          }
        })
      },

      modelResetForm() {
        if (this.$refs['productModel']) {
          this.$refs['productModel'].resetFields();
        }
        this.saveLoading = false
      },

      getProductModel() {
        this.newProductDialogShow = true
        this.newProductDialogLoading = true
        this.modelResetForm()
        fetchTemplateList({'companyId': this.machineDetail.companyId}, 1, 10000).then(response => {
          this.newProductDialogLoading = false
          this.templates = response.response
        })
      },

      initByTemplate() {
        initByTemplate(this.machineDetail.id, this.template.id).then(response => {
          this.$message.success('初始化模板成功')
          this.getMachinesProduct()
          this.newProductDialogShow = false
        })
      },
      getFranchiseesList() {
        getFrachisees().then(response => {
          if (response.code === 0) {
            this.franchisees = response.response;
          } else {
            this.franchisees = '';
          }
        })
      },
      getStationList() {
        fetchStationList(this.station, 1, 10000).then(response => {
          this.stations = response.response
        })
      },
      editSalePrice(machineProduct) {
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
      },
      open(theMessage) {
        this.$message({
          message: theMessage,
          duration: 2000,
          type: 'success'
        });
      },
      getDeviceTypeList() {
        console.log('lklllllllll')
        fetchDeviceTypeList({}, 1, 1000).then(response => {
          console.log(JSON.stringify(response.response))
          this.deviceTypeList = response.response
        })
      }
    },
    watch: {
      dialogShow: {
        handler: function (curVal, oldVal) {
          if (curVal === true) {
            /*this.getFranchiseesList();*/
            this.getStationList();
          }
        },
        deep: true
      },
      machine: {
        handler: function (cv, ov) {
          if (cv.franchiseesId === null) {
            cv.franchiseesId = ''
          }
          if (cv.branchType === 2 || cv.branchType === 3) {
            this.getFranchiseesList();
          } else {
            this.franchisees = '';
            cv.franchiseesId = '';
          }
        },
        deep: true
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
