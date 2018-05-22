<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="stockExcelList">
        <span slot="label"><i class="el-icon-document"></i> 导入商品信息</span>
        <el-form :inline="true" :model="stockExcelSearch" class="demo-form-inline">
          <el-form-item label="导入用户" prop="dateTime">
            <el-input
              v-model="stockExcelSearch.userName"
              placeholder="导入用户">
            </el-input>
          </el-form-item>
          <el-form-item label="导入日期" prop="dateTime">
            <el-date-picker
              v-model="stockExcelSearch.dateTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              placeholder="选择时间范围"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="getStockExcelList" @click="getStockExcelList">查询</el-button>
            <el-button icon="plus" @click="addStockExcel">导入</el-button>
            <el-button @click="downloadStockExcel">导入模板下载</el-button>
          </el-form-item>
        </el-form>
        <el-tooltip class="item" effect="dark" content="双击商品展示详情" placement="top-end">
          <el-table
            ref="multipleTable"
            v-loading="stockExcelListLoading"
            :data="stockExcelList"
            @row-dblclick="searchStockExcelDetail"
            :border="hasBorder"
            height="450"
            stripe
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="导入用户"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="导入日期"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="status"
              label="是否入库"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'primary' : ''"
                  close-transition>{{scope.row.status === 1 ?'是':'否'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status===0"
                  size="small"
                  type="info" @click="confirmExcel(scope.row)">确认入库
                </el-button>
                <el-button v-if="scope.row.status===1" size="small" :plain="true" :disabled="true">已入库</el-button>
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogShow" :close="resetForm">
          <div style="align-content:center">
            <el-upload
              class="upload-img"
              ref="uploadExcel"
              :action="uploadExcelUrl"
              :headers="uploadExcelHeaders"
              :data="uploadExcelData"
              :on-success="handleSuccess"
              list-type="files">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
            </el-upload>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShow = false">关闭</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="dialogTitle1" :visible.sync="dialogShow1" :close="resetForm1">
          <div style="align-content:center">
            <el-form :inline="true" :model="stockExcel" label-position="left" ref="stockInfoForm1" :rules="stockInfoFormRules"
                     v-loading="formLoading" label-width="200px"
                     style="margin: 0 3%">
              <el-form-item label="仓库信息" prop="stockInfoId" label-width="100px">
                  <el-select v-model="stockExcel.stockInfoId" filterable clearable placeholder="选择仓库" style="width: 480px;">
                    <el-option v-for="stockInfo in stockInfoList" :key="stockInfo.id" :label="stockInfo.stockName"
                               :value="parseInt(stockInfo.id)"></el-option>
                  </el-select>
                </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="impStockProduct">确认入库</el-button>
            <el-button @click="dialogShow1 = false">关闭</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="dialogTitle2" :visible.sync="dialogShow2" :close="resetForm2">
          <div style="align-content:center">
            <el-form :inline="true" :model="stockExcel" label-position="left" ref="stockInfoForm2" :rules="stockInfoFormRules"
                     v-loading="formLoading" label-width="200px"
                     style="margin: 0 3%">
              <el-form-item label="仓库信息" prop="stockInfoId" label-width="100px">
                <el-select v-model="stockExcel.stockInfoId" filterable clearable placeholder="选择仓库" style="width: 480px;">
                  <el-option v-for="stockInfo in stockInfoList" :key="stockInfo.id" :label="stockInfo.stockName"
                             :value="parseInt(stockInfo.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <a id="getExcel" style="display: none"></a>
          <div slot="footer" class="dialog-footer">
            <el-button @click="downloadStockProduct">下载</el-button>
            <el-button @click="dialogShow2 = false">关闭</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="stockExcelDetail">
        <el-alert v-if="!stockExcelDetail" :closable="false"
                  title="请选择一个商品,才能查看商品信息！！！" type="warning">
        </el-alert>
        <span slot="label"><i class="el-icon-document"></i> 商品信息</span>
        <el-card class="box-card" v-if="stockExcelDetail.productName">
          <span style="line-height: 18px;" >商品详细信息</span>
        </el-card>
        <div v-if="stockExcelDetail.productName" >
          <el-table
            ref="multipleTable"
            v-loading="stockExcelDetailListLoading"
            :data="stockExcelDetailList"
            height="450"
            stripe
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              prop="productId"
              label="商品ID"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="商品名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="tasteName"
              label="商品口味"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="stock"
              label="库存"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="导入日期"
              show-overflow-tooltip>
            </el-table-column>
            <!--<el-table-column
              prop="purchasePrice"
              label="商品进价"
              show-overflow-tooltip>
            </el-table-column>-->
          </el-table>
        </div>
        <!--<p class="block" style="float:right">
          <el-pagination
            @size-change="stockExcelDetailHandleSizeChange"
            @current-change="stockExcelDetailHandleCurrentChange"
            :current-page="stockExcelDetailPage"
            :page-sizes="stockExcelDetailSizes"
            :page-size="stockExcelDetailSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="stockExcelDetailTotal">
          </el-pagination>
        </p>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchStockExcelList,fetchSaveStockInfo,fetchStockExcelDetailList,fetchUpdateStockProduct,fetchDownloadStockProduct} from 'api/stockExcel';
  import { fetchStockInfoList} from 'api/stockInfo';
  import { getToken } from 'utils/auth';
  export default {
    created() {
      this.getStockExcelList()
    },
    data() {
      return {
        activeName: 'stockExcelList',
        stockExcelSearch: {
          dateTime: '',
        },
        stockExcelList: [],
        stockExcelListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        dialogTitle: '导入商品',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        filterText: '',
        menus: [],
        uploadDialogShow: false,
        menus: [],
        uploadExcelUrl: process.env.BASE_API + '/api/private/stockExcel/importStockExcel',
        uploadExcelHeaders: {
          'X-AUTH-TOKEN': getToken()
        },
        uploadExcelData: {
          id: ''
        },
        hasBorder : true,
        dialogTitle1: '确认入库',
        dialogShow1: false,
        saveLoading1: false,
        stockExcelDetailList: [],
        stockExcelDetailListLoading: false,
        stockExcelDetailPage: 1,
        stockExcelDetailSize: 10,
        stockExcelDetailTotal: 0,
        stockExcelDetailSizes: [10, 20, 50, 100],
        stockInfoSearch: {
          stockName: '',
        },
        stockInfo: {
          id: '',
          stockName: '',
          officeIdList: '',
          officeId: '',
          regionId: '',
          companyId: '',
          officeName: '',
          regionName: '',
          companyName: '',
          address: '',
          note: ''
        },
        stockInfoTemplate: {
          id: '',
          stockName: ''
        },
        templateId: '',
        stockInfoList: [],
        dialogTitle2: '导入商品模板下载',
        dialogShow2: false,
        saveLoading2: false,
        pickerOptions: {
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
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        stockExcel: {
          id: '',
          userId:'',
          userName:'',
          productId: '',
          productName:'',
          createDate: '',
          purchasePrice: '',
          stock: '',
          status:'',
          uuid:'',
          stockInfoId:''
        },
        stockExcelDetail: {},
        stockInfoFormRules: {
          stockInfoId: [
            {type: 'number',required: true, message: '请选择仓库', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      getStockExcelList() {
        this.stockExcelListLoading = true
        fetchStockExcelList(this.stockExcelSearch, this.page, this.size).then(response =>{
          this.stockExcelListLoading = false
          this.stockExcelList = response.response
          this.total = response.total
        })
      },
      getStockExcelDetailList(row){
        this.stockExcelDetailListLoading = true
        fetchStockExcelDetailList({"uuid":row.uuid},1, 100000).then(response =>{
          this.stockExcelDetailListLoading = false
          this.stockExcelDetailList = response.response
          this.stockExcelDetail = response.response[0]
          this.stockExcelDetailSizes = response.total
        })
      },

      impStockProduct(){
          this.$refs['stockInfoForm1'].validate((valid) => {
            if (valid) {
              fetchUpdateStockProduct(this.stockExcel.stockInfoId, this.stockExcel.uuid).then(response => {
                // console.log("response.response==="+JSON.stringify(response.response.length))
                if (response.code === 0) {
                  if(response.response.length > 0) {
                    this.$message.success('入库成功,但商品ID为：'+response.response+"入库失败，原因库存没有该商品ID")
                    this.$message.w
                    this.dialogShow1 = false
                    this.getStockExcelList()
                  }else{
                    this.$message.success('入库成功')
                    this.dialogShow1 = false
                    this.getStockExcelList()
                  }
                } else {
                  this.$message.error('入库失败')
                }
              })
            } else {
              return false
            }
          })
      },

      downloadStockProduct() {
        this.$refs['stockInfoForm2'].validate((valid) => {
          if (valid) {
            fetchDownloadStockProduct(this.stockExcel.stockInfoId).then(response => {
              if (response.response[0]!=='') {
                var stockProductExcel = document.getElementById('getExcel');
                stockProductExcel.setAttribute("href", response.response[0]);
                stockProductExcel.setAttribute("download", response.response[1]);
                stockProductExcel.click();
              } else {
                this.$message({
                  showClose: true,
                  message: '获取excel失败,模板数据为空！',
                  duration: 3000,
                  type: 'warning'
                });
              }
            })
          } else {
            return false;
          }
        })
      },

      //查询订单记录
      searchStockExcelDetail(row, event) {
        this.activeName = 'stockExcelDetail';
        this.getStockExcelDetailList(row)
      },

      addStockExcel() {
        this.dialogShow = true
        this.resetForm()
      },

      downloadStockExcel() {
        this.dialogShow2 = true
        this.resetForm2()
        fetchStockInfoList(this.stockInfoSearch, 1, 100000).then(response =>{
          this.stockInfoListLoading = false
          this.stockInfoList = response.response
          this.total = response.total
        })
      },

      confirmExcel(row) {
        this.dialogShow1 = true
        this.resetForm1()
        fetchStockInfoList(this.stockInfoSearch, 1, 1000000).then(response =>{
          this.stockInfoListLoading = false
          this.stockInfoList = response.response
          this.stockExcel = row
        })
      },
      uploadExcel(id) {
        this.uploadExcelData.id = id
        this.uploadDialogShow = true
        if (this.$refs.uploadExcel) {
          this.$refs.uploadExcel.clearFiles()
        }
      },
      handleSuccess(response, file, fileList) {
       // console.log("response.code ==="+response.code )
        if (response.code === 0) {
          this.$message.success('上传成功')
          this.getStockExcelList()
          if(fileList.length > 1){
            fileList.shift()
          }
        } else {
          this.$refs.uploadExcel.clearFiles()
          this.$message.error(response.desc)
        }
      },
      resetForm() {
        if (this.$refs['stockExcelForm']) {
          this.$refs['stockExcelForm'].resetFields();
        }
        this.saveLoading = false
      },

      resetForm1() {
        if (this.$refs['stockExcelForm1']) {
          this.$refs['stockExcelForm1'].resetFields();
        }
        this.saveLoading1 = false
      },

      resetForm2() {
        if (this.$refs['stockExcelForm']) {
          this.$refs['stockExcelForm'].resetFields();
        }
        this.saveLoading1 = false
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleSizeChange(val) {
        this.size = val
        this.getStockExcelList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getStockExcelList()
      },
      stockExcelDetailHandleSizeChange(val) {
        this.stockExcelDetailSize = val
        this.getStockExcelDetailList()
      },
      stockExcelDetailHandleCurrentChange(val) {
        this.stockExcelDetailPage = val
        this.getStockExcelDetailList()
      },
      tabClick(tab, event) {
        if (tab.name === 'stockExcelList') {
          if (this.stockExcelList.length < 1) {
            this.getStockExcelList()
          }
        }
        if (tab.name === 'stockExcelDetailList') {

        }
      }
    },
    watch: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
