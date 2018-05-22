<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="stockInfoList">
        <span slot="label"><i class="el-icon-document"></i> 仓库信息</span>
        <el-form :inline="true" :model="stockInfoSearch" class="demo-form-inline">
          <el-form-item label="大区">
            <el-select v-model="stockInfoSearch.companyId" filterable clearable placeholder="选择大区" style="width: 280px;">
              <el-option v-for="office in offices" :key="office.id" :label="office.name" :value="parseInt(office.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="stockInfoSearch.stockName" placeholder="仓库名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="getStockInfoList" @click="getStockInfoList">查询</el-button>
            <el-button icon="plus" @click="addStockInfo">新增</el-button>
          </el-form-item>
        </el-form>

        <el-table
          ref="multipleTable"
          v-loading="stockInfoListLoading"
          :data="stockInfoList"
          :border="hasBorder"
          height="450"
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="stockName"
            label="仓库名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="大区名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="address"
            label="仓库地址"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="note"
            label="备注"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="stockInfoEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="stockInfoDelete(scope.$index, scope.row)">删除</el-button>
              <el-button
                size="small"
                type="info"
                @click="toStockInfoDetail(scope.$index, scope.row)">更多仓库信息</el-button>
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
            <el-form :inline="true" :model="stockInfos" label-position="left" ref="stockInfoForm" :rules="stockInfoFormRules"
                     v-loading="formLoading" label-width="100px" style="margin: 0 3%">
              <el-form-item label="仓库名称" prop="stockName">
                <el-input style="width: 480px;" v-model="stockInfos.stockName" ></el-input>
              </el-form-item>

              <el-form-item label="大区" prop="companyId">
                <el-select v-model="stockInfos.companyId" filterable clearable placeholder="选择大区" style="width: 480px;">
                  <el-option v-for="office in offices" :key="office.id" :label="office.name" :value="parseInt(office.id)"></el-option>
                </el-select>
              </el-form-item>

              <!--<el-form-item label="机构" prop="officeIdList" label-width="100px">
                <el-cascader
                  :disabled="officeDisbled"
                  :options="offices"
                  v-model="stockInfos.officeIdList"
                  :props="cascaderProps"
                  clearable
                  @change="handleStockInfoChange"
                  placeholder="机构"
                  style="width:480px">
                </el-cascader>
              </el-form-item>-->

              <el-form-item label="地址" prop="address">
                <el-input style="width: 480px;" pattern="[0-9]*" v-model.number="stockInfos.address" ></el-input>
              </el-form-item>

              <el-form-item label="备注" prop="note">
                <el-input style="width: 480px;" v-model.number="stockInfos.note" ></el-input>
              </el-form-item>

              <el-form-item prop="id">
                <el-input :hidden="true" v-model="stockInfos.id" ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveStockInfo" :loading="saveLoading">确定</el-button>
            <el-button @click="dialogShow = false">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="stockInfoDetailList">
        <el-alert v-if="!stockInfos.stockName" :closable="false"
                  title="请选择一个仓库,才能查看仓库明细！！！" type="warning">
        </el-alert>
        <span slot="label"><i class="el-icon-document"></i>仓库明细</span>
        <el-card class="box-card" v-if="stockInfos.stockName">
          <span style="line-height: 18px;" >仓库商品</span>
          <el-button type="info" size="small" @click="getProducts">商品入库</el-button>
          <el-button type="info" size="small"  @click="offProduct">下架商品</el-button>
          <el-button type="info" size="small" @click="exportExcel" style="margin-right: 0" :loading="exportLoading">导出</el-button>
          <el-button type="info" size="small" @click="exportMore">导出更多信息</el-button>
        </el-card>
        <el-card v-if="stockInfos.stockName">
          <el-input v-model="stockProductDialogSelect" placeholder="输入商品名称筛选" style="margin-bottom:10px;width:33.3%" v-on:change="stockProductDialogSelectChange"></el-input>
          <el-table
            v-loading="stockProductLoading"
            @selection-change="handleStockProductSelectionChange"
            :data="stockProductsResult"
            ref="stockProductsRef"
            :border="hasBorder"
            height="450"
            stripe
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="productId" label="商品ID" ></el-table-column>
            <el-table-column prop="productName" label="商品名称" ></el-table-column>
            <el-table-column prop="tasteName" label="商品口味" ></el-table-column>
            <!--<el-table-column prop="salePrice" label="商品售价" ></el-table-column>
            <el-table-column prop="purchasePrice" label="商品进价" ></el-table-column>-->
            <el-table-column prop="stock" label="库存" align="center">
              <template slot-scope="scope">
                <el-input style="width: 100px;" type="number" pattern="[0-9]*"
                          v-model.number="scope.row.newStock" v-show="scope.row.edit"></el-input>
                <span v-show="!scope.row.edit">{{ scope.row.stock }}</span>
                <el-button v-show='!scope.row.edit' type="text" @click='editStock(scope.row)' size="mini">修改</el-button>
                <el-button v-show='scope.row.edit' type="text" @click='saveStockCount(scope.row)' size="mini">提交</el-button>
              </template>
            </el-table-column>
          </el-table>
          <p class="block" style="float:right">
            <el-pagination
              layout="total"
              :total="stockProductTotal">
            </el-pagination>
          </p>
        </el-card>
        <el-dialog title="商品列表" :visible.sync="productDialogShow">
          <el-input v-model="productDialogSelect" placeholder="输入商品名称筛选" style="margin-bottom:10px;width:33.3%" v-on:change="productDialogSelectChange"></el-input>
          <el-table
            v-loading="productDialogLoading"
            @selection-change="handleProductsSelectionChange"
            :data="productsResult"
            stripe
            height='450'
            style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="productId" label="商品ID" ></el-table-column>
            <el-table-column prop="productName" label="商品名称" ></el-table-column>
            <el-table-column prop="tasteName" label="商品口味" ></el-table-column>
            <!--<el-table-column prop="salePrice" label="售价" ></el-table-column>
            <el-table-column prop="purchasePrice" label="进价" ></el-table-column>-->
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addProduct" :loading="saveLoading">确定</el-button>
            <el-button @click="productDialogShow = false">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <!--以下为盘库部分-->
      <el-tab-pane name="stockExcelList">
        <span slot="label"><i class="el-icon-document"></i> 盘库记录</span>
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
            <el-button @click="downloadStockExcel">盘库模板下载</el-button>
          </el-form-item>
        </el-form>
        <el-tooltip class="item" effect="dark" content="双击展示记录详情" placement="top-end">
          <el-table
            ref="multipleTable"
            v-loading="stockExcelListLoading"
            :data="stockExcelList"
            @row-dblclick="searchStocktakingExcelDetail"
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
              label="是否已盘库"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 1 ? 'primary' : ''"
                  close-transition>{{scope.row.status === 1 ?'是':'否'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status===0"
                           size="small"
                           type="info" @click="confirmExcel(scope.row)">盘库
                </el-button>
                <el-button v-if="scope.row.status===1" size="small" :plain="true" :disabled="true">已盘库</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tooltip>
        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="page1"
            :page-sizes="sizes1"
            :page-size="size1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </p>
        <el-dialog :title="dialogTitle" :visible.sync="dialogShowa" :close="resetForma">
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
            <el-button @click="dialogShowa = false">关闭</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="dialogTitle1" :visible.sync="dialogShow1" v-on:close="resetForm1">
          <div style="align-content:center">
            <el-form :inline="true" :model="stockExcel" label-position="left" ref="stockInfoForm1" :rules="stockInfoFormRules1"
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
            <el-button @click="impStockProduct" v-loading="sure">确认盘库</el-button>
            <el-button @click="resetForm1">关闭</el-button>
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
          <!--<a id="getExcel" style="display: none"></a>-->
          <div slot="footer" class="dialog-footer">
            <el-button @click="downloadStockProduct">下载</el-button>
            <el-button @click="dialogShow2 = false">关闭</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="stockExcelDetail">
        <el-alert v-if="!currentRecordId" :closable="false"
                  title="请选择一条记录,才能查看记录详情！！！" type="warning">
        </el-alert>
        <span slot="label"><i class="el-icon-document"></i> 记录详情</span>
        <el-card class="box-card" v-if="currentRecordId">
          <span style="line-height: 18px;" >记录详情</span>
        </el-card>
        <div v-if="currentRecordId" >
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
            <!--<el-table-column
              prop="purchasePrice"
              label="商品进价"
              show-overflow-tooltip>
            </el-table-column>-->
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

      <el-tab-pane name="replenishmentAuditing">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1613"><path
          d="M73.502212 884.833979 73.502212 49.921494C73.663636 45.906744 77.003319 42.755883 81.023375 42.823991L799.838528 42.823991C803.86815 42.74274 807.222182 45.897186 807.383606 49.921494L807.383606 450.942356C824.113112 458.894189 839.381432 469.606161 852.546458 482.630198L852.546458 49.921494C852.546458 22.43958 828.906808 0.17923 799.850486 0.17923L81.023375 0.17923C51.967053 0.17923 28.33936 22.487375 28.33936 49.921494L28.33936 884.833979C28.33936 912.315892 51.967053 934.576243 81.023375 934.576243L425.693537 934.576243 425.693537 894.094189C425.693537 893.353372 425.908769 892.672298 425.932684 891.931482L81.023375 891.931482C77.005711 891.993615 73.67081 888.845143 73.502212 884.833979L73.502212 884.833979ZM951.015107 974.233839C950.853682 978.248588 947.513998 981.39945 943.493943 981.331342L523.576276 981.331342C519.55622 981.39945 516.216536 978.248588 516.055113 974.233839L516.055113 894.177829C516.216536 890.163081 519.55622 887.012219 523.576276 887.080326L943.517857 887.080326C947.542696 887.012219 950.888358 890.159496 951.062935 894.177829L951.062935 974.31748 951.015107 974.233839ZM732.053596 714.775898 732.053596 714.775898 830.162328 844.375822 636.872019 844.375822 732.053596 714.775898ZM659.375722 589.498996C659.375722 550.892882 692.617111 519.467912 733.511195 519.467912 774.405279 519.467912 807.646668 550.880933 807.646668 589.498996 807.646668 627.866138 774.787913 659.064084 734.180805 659.446441L732.793755 659.446441C692.258391 659.076033 659.351807 627.890035 659.351807 589.498996L659.375722 589.498996ZM943.493943 844.375822 885.692188 844.375822 772.874739 695.352159C819.305069 679.926441 852.833434 638.536289 852.833434 589.510945 852.833434 527.377923 799.33632 476.847048 733.523153 476.847048 667.709984 476.847048 614.200913 527.389871 614.200913 589.510945 614.200913 638.500443 647.765151 679.926441 694.171565 695.352159L581.3302 844.375822 523.552361 844.375822C494.496038 844.375822 470.868346 866.672019 470.868346 894.094189L470.868346 974.233839C470.868346 1001.715753 494.496038 1023.976102 523.552361 1023.976102L943.446113 1023.976102C972.502436 1023.976102 996.142086 1001.667958 996.142086 974.209942L996.142086 894.070291C996.142086 866.66007 972.538308 844.375822 943.529815 844.375822L943.493943 844.375822ZM438.559629 626.754912 179.826829 626.754912C167.355329 626.754912 157.239424 636.313839 157.239424 648.071319 157.239424 659.828799 167.355329 669.387725 179.826829 669.387725L438.559629 669.387725C451.031128 669.387725 461.147034 659.828799 461.147034 648.071319 461.147034 636.313839 451.031128 626.754912 438.559629 626.754912L438.559629 626.754912ZM179.802915 473.97937C167.331414 473.97937 157.21551 483.538296 157.21551 495.295776 157.21551 507.053256 167.331414 516.612182 179.802915 516.612182L510.040573 516.612182C522.488159 516.612182 532.604063 507.053256 532.604063 495.295776 532.604063 483.538296 522.488159 473.97937 510.040573 473.97937L179.802915 473.97937ZM717.045946 342.544131C717.045946 330.774702 706.93004 321.227725 694.458541 321.227725L179.826829 321.227725C167.379244 321.227725 157.263338 330.786651 157.263338 342.544131 157.263338 354.30161 167.379244 363.860536 179.826829 363.860536L694.494413 363.860536C706.918083 363.860536 717.045946 354.30161 717.045946 342.544131L717.045946 342.544131ZM694.482455 168.476079 179.850743 168.476079C167.379244 168.476079 157.263338 178.035005 157.263338 189.792485 157.263338 201.549965 167.379244 211.108891 179.850743 211.108891L694.494413 211.108891C706.965912 211.108891 717.081818 201.549965 717.081818 189.792485 717.081818 178.035005 706.953955 168.476079 694.482455 168.476079L694.482455 168.476079ZM73.502212 884.833979 73.502212 49.921494C73.663636 45.906744 77.003319 42.755883 81.023375 42.823991L799.838528 42.823991C803.86815 42.74274 807.222182 45.897186 807.383606 49.921494L807.383606 450.942356C824.113112 458.894189 839.381432 469.606161 852.546458 482.630198L852.546458 49.921494C852.546458 22.43958 828.906808 0.17923 799.850486 0.17923L81.023375 0.17923C51.967053 0.17923 28.33936 22.487375 28.33936 49.921494L28.33936 884.833979C28.33936 912.315892 51.967053 934.576243 81.023375 934.576243L425.693537 934.576243 425.693537 894.094189C425.693537 893.353372 425.908769 892.672298 425.932684 891.931482L81.023375 891.931482C77.005711 891.993615 73.67081 888.845143 73.502212 884.833979L73.502212 884.833979ZM951.015107 974.233839C950.853682 978.248588 947.513998 981.39945 943.493943 981.331342L523.576276 981.331342C519.55622 981.39945 516.216536 978.248588 516.055113 974.233839L516.055113 894.177829C516.216536 890.163081 519.55622 887.012219 523.576276 887.080326L943.517857 887.080326C947.542696 887.012219 950.888358 890.159496 951.062935 894.177829L951.062935 974.31748 951.015107 974.233839 951.015107 974.233839ZM732.053596 714.775898 732.053596 714.775898 830.162328 844.375822 636.872019 844.375822 732.053596 714.775898 732.053596 714.775898ZM659.375722 589.498996C659.375722 550.892882 692.617111 519.467912 733.511195 519.467912 774.405279 519.467912 807.646668 550.880933 807.646668 589.498996 807.646668 627.866138 774.787913 659.064084 734.180805 659.446441L732.793755 659.446441C692.258391 659.076033 659.351807 627.890035 659.351807 589.498996L659.375722 589.498996 659.375722 589.498996ZM943.493943 844.375822 885.692188 844.375822 772.874739 695.352159C819.305069 679.926441 852.833434 638.536289 852.833434 589.510945 852.833434 527.377923 799.33632 476.847048 733.523153 476.847048 667.709984 476.847048 614.200913 527.389871 614.200913 589.510945 614.200913 638.500443 647.765151 679.926441 694.171565 695.352159L581.3302 844.375822 523.552361 844.375822C494.496038 844.375822 470.868346 866.672019 470.868346 894.094189L470.868346 974.233839C470.868346 1001.715753 494.496038 1023.976102 523.552361 1023.976102L943.446113 1023.976102C972.502436 1023.976102 996.142086 1001.667958 996.142086 974.209942L996.142086 894.070291C996.142086 866.66007 972.538308 844.375822 943.529815 844.375822L943.493943 844.375822 943.493943 844.375822ZM438.559629 626.754912 179.826829 626.754912C167.355329 626.754912 157.239424 636.313839 157.239424 648.071319 157.239424 659.828799 167.355329 669.387725 179.826829 669.387725L438.559629 669.387725C451.031128 669.387725 461.147034 659.828799 461.147034 648.071319 461.147034 636.313839 451.031128 626.754912 438.559629 626.754912L438.559629 626.754912ZM179.802915 473.97937C167.331414 473.97937 157.21551 483.538296 157.21551 495.295776 157.21551 507.053256 167.331414 516.612182 179.802915 516.612182L510.040573 516.612182C522.488159 516.612182 532.604063 507.053256 532.604063 495.295776 532.604063 483.538296 522.488159 473.97937 510.040573 473.97937L179.802915 473.97937 179.802915 473.97937ZM717.045946 342.544131C717.045946 330.774702 706.93004 321.227725 694.458541 321.227725L179.826829 321.227725C167.379244 321.227725 157.263338 330.786651 157.263338 342.544131 157.263338 354.30161 167.379244 363.860536 179.826829 363.860536L694.494413 363.860536C706.918083 363.860536 717.045946 354.30161 717.045946 342.544131L717.045946 342.544131ZM694.482455 168.476079 179.850743 168.476079C167.379244 168.476079 157.263338 178.035005 157.263338 189.792485 157.263338 201.549965 167.379244 211.108891 179.850743 211.108891L694.494413 211.108891C706.965912 211.108891 717.081818 201.549965 717.081818 189.792485 717.081818 178.035005 706.953955 168.476079 694.482455 168.476079L694.482455 168.476079Z"
          p-id="1614"></path></svg>补货单审核</span>

        <el-form :model="replenishmentAuditingSearchForm"
                 ref="replenishmentAuditingSearchForm"
                 class="demo-form-inline"
                 label-position="left"
                 label-width="75px">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="补货时间" prop="dateTime">
                <div class="block">
                  <el-date-picker
                    v-model="replenishmentAuditingSearchForm.dateTime"
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
                  <el-input v-model="replenishmentAuditingSearchForm.batchId"
                            placeholder="请输入批次号"
                            style="width:100%"></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="7" :push="1">
              <el-form-item label="设备名称" prop="machineName" label-width="23%">
                <el-input v-model="replenishmentAuditingSearchForm.machineName"
                          placeholder="请输入设备名称"
                          style="width:100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item label="货值" prop="minProductValue" style="float: left;width: 40%" label-width="30%">
                <input v-model="replenishmentAuditingSearchForm.minProductValue"
                       placeholder="最小货值"
                       class="el-input__inner"
                       onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')"
                       onafterpaste="this.value=this.value.replace(/[^\d\.]/g,'')"
                       v-on:blur="checkEffectiveness(1)"/>
              </el-form-item>
              <el-form-item prop="maxProductValue" label="~" style="float: left;margin-left: 20px;width: 50%"
                            label-width="13%">
                <input v-model="replenishmentAuditingSearchForm.maxProductValue"
                       placeholder="最大货值"
                       class="el-input__inner"
                       style="width: 50%"
                       onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')"
                       onafterpaste="this.value=this.value.replace(/[^\d\.]/g,'')"
                       v-on:blur="checkEffectiveness(1)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品名称" prop="productName" label-width="25%">
                <el-input v-model="replenishmentAuditingSearchForm.productName"
                          placeholder="请输入商品名称"
                          style="width:120%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :push="1">
              <el-form-item label="单号" prop="id" label-width="20%">
                <el-input v-model="replenishmentAuditingSearchForm.id"
                          placeholder="请输入单据号(补货单号)"
                          style="width:120%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="9" :push="8">
              <el-form-item>
                <el-button type="primary" round icon="el-icon-search" @click="getReplenishmentAuditing">查询</el-button>
                <el-button @click="rest('replenishmentAuditingSearchForm')" round icon="el-icon-delete">重置
                </el-button>
                <el-button @click="passAll" round
                           icon="el-icon-circle-check">批量通过
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          v-loading.body="replenishmentAuditingListLoading"
          element-loading-text="小喵使出了洪荒之力为您加载。。。"
          :data="replenishmentAuditingList"
          stripe
          border
          highlight-current-row
          @selection-change="changeSelectReplenishment"
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
          <el-table-column prop="batchId" label="批次号" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="machineName" label="设备名称" align="center"></el-table-column>
          <el-table-column prop="stockName" label="仓库"  show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="productValue" label="货值" show-overflow-tooltip align="center"
                           :formatter="formatterMoney"></el-table-column>
          <el-table-column prop="grossSales" label="理论销售金额" :formatter="formatterMoney"
                           align="center"></el-table-column>
          <el-table-column prop="createdDate"
                           label="补货时间"
                           align="center"
                           show-overflow-tooltip
                           :formatter="formatterDateTime"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="auditing(scope.row)"
                         type="text"
                         size="small">
                审核
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleReplenishmentAuditingTableSizeChange"
            @current-change="handleReplenishmentAuditingTableCurrentChange"
            :current-page="replenishmentAuditingPage"
            :page-sizes="replenishmentAuditingSizes"
            :page-size="replenishmentAuditingSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="replenishmentAuditingTotal">
          </el-pagination>
        </p>

      </el-tab-pane>
    </el-tabs>

    <!--审核补货数量-->
    <el-dialog title="修改商品补货数量"
               :visible.sync="auditingDialogVisible"
               :before-close="closeAuditingDialog">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-row :gutter="16">
            <el-col :span="10">
              <span style="line-height: 36px;font-size: 20px">批次号:</span>{{currentRow.batchId}}
            </el-col>
            <el-col :span="7">
              <span style="line-height: 36px;font-size: 20px">仓库:</span>{{currentRow.stockName}}
            </el-col>
            <el-col :span="7">
              <span style="line-height: 36px;font-size: 20px">设备:</span>{{currentRow.machineName}}
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="15" style="float: right">
              <el-button @click="edit" style="margin-left: 5px"
                         round icon="el-icon-edit-outline" type="primary" size="medium">批量修改
              </el-button>
              <el-button @click="pass" style="margin-left: 5px"
                         round icon="el-icon-edit" type="primary" size="medium">通过
              </el-button>
              <el-button @click="addNewRecord" style="margin-left: 5px"
                         round icon="el-icon-plus" type="primary" size="medium">增加
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-input v-model="filterProduct" placeholder="输入商品名称进行筛选"
                  style="margin-bottom: 10px;line-height: 50px"
                  v-on:change="filterProductChange"></el-input>
        <el-table
          v-loading.body="auditingDialogListLoading"
          element-loading-text="小喵使出了洪荒之力为您加载。。。"
          :data="auditingList"
          stripe
          border
          highlight-current-row
          style="width: 100%">
          <el-table-column prop="barCode" label="条码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="tasteName" label="口味" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="stock" label="库存" align="center"></el-table-column>
          <el-table-column prop="theoryCount" label="理论补货数量" align="center"></el-table-column>
          <el-table-column prop="count" label="实际补货量" align="center">
            <template slot-scope="scope" align="center">
              <el-input id="a" type="number" v-model="scope.row.count" ref="cac" @blur="checkTwo(scope.row)"
                        pattern="^[1-9]\d*$" style=" text-align: center"
                        :min="0" step="1" max="9999"></el-input>
              <span property="newCount" style="display: none">{{ scope.row.newCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" :disabled="scope.row.count > 0 && scope.row.stock > 0" @click="deleteReplenishmentRecord(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <el-dialog title="增加商品补货记录"
               :visible.sync="addReplenishmentRecordDialogVisible"
               :before-close="closeAddReplenishmentRecordDialog">
        <div>
          <el-form :data="addReplenishmentRecordData"
                   label-position="left"
                   label-width="50px"
                   ref="addReplenishmentRecordData"
                   style="margin: 0 3%">
            <el-form-item label="商品" prop="products">
              <div class="block">
                <el-cascader
                  v-model="addReplenishmentRecordData.products"
                  placeholder="请选择商品与口味"
                  :options="product"
                  filterable
                  clearable
                  show-all-levels
                  style="width: 100%">
                </el-cascader>
              </div>
            </el-form-item>
            <el-form-item label="数量" prop="count">
              <el-input type="number"
                        v-model="addReplenishmentRecordData.count"
                        placeholder="请输入实际补货数量"
                        pattern="^[1-9]\d*$"
                        style=" text-align: center"
                        :min="0"
                        step="1"
                        max="9999"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" round @click="saveAddReplenishmentRecord" :loading="saveAddLoading">确定</el-button>
          <el-button round @click="cancel">取消</el-button>
        </div>
    </el-dialog>

    <el-dialog title="导出更多仓库信息"
               :visible.sync="showExportMoreDialog">
      <div class="block" style="margin-left: 30px">
        <span class="demonstration">请选择导出时间</span>
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button style="margin-left: 20%;margin-top: 20px" icon="el-icon-info" type="primary" :loading="exportStockLoading" @click="exportOutStock">导出库到设备信息</el-button>
      <el-button type="primary" icon="el-icon-info" :loading="exportStockLoading" @click="exportInAndOutStock">导出进出库信息</el-button>
    </el-dialog>

    <a id="getExcel" style="display: none"></a>
  </div>
</template>

<script>
  import { fetchStockInfoList,
           fetchDeleteStockInfo,
           fetchSaveStockInfo,
           fetchUpdateStockInfo,
           addProduct,
           fetchStockProduct,
           fetchSaveStock,
           offProduct,
           fetchExportExcel,
           fetchProductList
  } from 'api/stockInfo';
  import { fetchOfficeTree } from 'api/office';
  import { fetchOfficeStockInfo } from 'utils/office';
  import { fetchDownloadStockProduct } from 'api/stockExcel';
  import { fetchStocktakingExcelList, fetchStocktakingExcelDetailList, fetchInitStockProduct } from 'api/stocktakingExcel';
  import { getToken } from 'utils/auth';
  import {
    deleteReplenishmentRecord,
    fetchAddReplenishment,
    fetchChangeReplenishment,
    fetchPass,
    fetchReplenishmentAuditingList,
    getDataForAuditing
  } from '../../api/replenishment';
  import ElButton from 'element-ui/packages/button/src/button';
  import { dealDateTime } from '../../api/discount';
  import { fetchExportInAndOutStock, fetchExportOutStock } from '../../api/stockInfo';
  import ElFormItem from 'element-ui/packages/form/src/form-item';
  import { fetchMachineUnreplenishmentProduct } from '../../api/product';

  export default {
    components: {
      ElFormItem,
      ElButton
    },
    created() {
      this.getStockInfoList()
      this.getOffices()
    },
    data() {
      return {
        exportLoading: false,
        activeName: 'stockInfoList',
        stockInfoSearch: {
          companyId: '',
          stockName: ''
        },
        stockInfoList: [],
        stockInfoListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],
        offices: [],
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        officeDisbled: false,
        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        filterText: '',
        stockInfos: {
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
        hasBorder: true,
        stockProducts: [],
        stockProductPage: 1,
        stockProductSize: 10,
        stockProductTotal: 0,
        stockProductSizes: [10, 20, 50, 100],
        stockProductLoading: false,
        productDialogShow: false,
        productDialogLoading: false,
        productDialogSelect: '',
        stockProductDialogSelect: '',
        productsResult: [],
        stockProductsResult: [],
        products: [],
        productsSelection: [],
        stockProductSelection: [],
        productTotal: 0,
        stockInfoDetail: {},
        stockInfoFormRules: {
          stockName: [
            { required: true, message: '请填写仓库名称', trigger: 'blur' }
          ],
          companyId: [
            { type: 'number', required: true, message: '请选择大区', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请填写仓库地址', trigger: 'blur' }
          ]
        },

        /* 以下为盘库数据初始化 */
        sure: false,
        currentRecordId: '',
        stockExcelSearch: {
          dateTime: ''
        },
        stockExcelList: [],
        stockExcelListLoading: false,
        page1: 1,
        size1: 10,
        total1: 0,
        sizes1: [10, 20, 50, 100],
        dialogTitle: '导入商品库存',
        dialogShowa: false,
        uploadDialogShow: false,
        uploadExcelUrl: process.env.BASE_API + '/api/private/stocktakingExcel/importStocktakingExcel',
        uploadExcelHeaders: {
          'X-AUTH-TOKEN': getToken()
        },
        uploadExcelData: {
          id: ''
        },
        dialogTitle1: '盘库',
        dialogShow1: false,
        saveLoading1: false,
        stockExcelDetailList: [],
        stockExcelDetailListLoading: false,
        stockExcelDetailPage: 1,
        stockExcelDetailSize: 10,
        stockExcelDetailTotal: 0,
        stockExcelDetailSizes: [10, 20, 50, 100],
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
        dialogTitle2: '导入商品库存模板下载',
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
          userId: '',
          userName: '',
          productId: '',
          productName: '',
          createDate: '',
          purchasePrice: '',
          stock: '',
          status: '',
          uuid: '',
          stockInfoId: ''
        },
        stockExcelDetail: {
          productName: ''
        },
        stockInfoFormRules1: {
          stockInfoId: [
            { type: 'number', required: true, message: '请选择仓库', trigger: 'change' }
          ]
        },
        replenishmentAuditingList: [],
        replenishmentAuditingSearchForm: {
          id: '',
          productName: '',
          batchId: '',
          machineName: '',
          dateTime: '',
          minProductValue: '',
          maxProductValue: '',
          replenishmentStatus: ''
        },
        replenishmentAuditingPage: 1,
        replenishmentAuditingSize: 10,
        replenishmentAuditingTotal: 0,
        replenishmentAuditingListLoading: false,
        replenishmentAuditingSizes: [10, 20, 50, 100, 200, 500],
        currentRow: {},
        auditingList: [],
        auditingListForFilter: [],
        auditingDialogListLoading: false,
        auditingDialogVisible: false,
        filterProduct: '',
        selectReplenishmentIds: [],
        showExportMoreDialog: false,
        dateTime: '',
        exportStockLoading: false,
        addReplenishmentRecordDialogVisible: false,
        saveAddLoading: false,
        product: [],
        addReplenishmentRecordData: {
          id: '',
          products: [],
          stockId: '',
          tasteId: '',
          machineId: '',
          productId: '',
          count: ''
        },
        shouldRefresh: false
      }
    },
    methods: {
      getStockInfoList() {
        this.stockInfoListLoading = true;
        fetchStockInfoList(this.stockInfoSearch, this.page, this.size).then(response => {
          this.stockInfoListLoading = false;
          this.stockInfoList = response.response;
          this.total = response.total;
        })
      },
      stockInfoEdit(index, row) {
        this.dialogTitle = '编辑';
        this.dialogShow = true;
        this.formLoading = true;
        fetchUpdateStockInfo(row.id).then(response => {
          this.formLoading = false;
          this.stockInfos = response.response;
          this.stockInfos.officeIdList = [];
          this.stockInfos.officeIdList.push(response.response.companyId.toString());
        })
      },
      stockInfoDelete(index, row) {
        this.$confirm('此操作将永久删除该仓库信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.stockInfoListLoading = true
          fetchDeleteStockInfo(row.id).then(response => {
            this.getStockInfoList();
            this.$message.success('删除成功');
          })
        })
      },

      getOffices() {
        fetchOfficeTree().then(response => {
          if (response.response) {
            this.offices = response.response[0].children;
          }
        })
      },

      addStockInfo() {
        this.dialogTitle = '新增';
        this.dialogShow = true;
        this.resetForm()
      },

      saveStockInfo() {
        this.$refs.stockInfoForm.validate(valid => {
          if (valid) {
            this.saveLoading = true
            if (this.stockInfos.companyId) {
              this.stockInfos.companyName = this.offices.find((item) => {
                return parseInt(item.id) === this.stockInfos.companyId
              }).name
            }
            fetchSaveStockInfo(this.stockInfos).then(response => {
              if (response.code === 0) {
                this.getStockInfoList();
                this.saveLoading = false;
                this.$message.success('保存成功');
                this.dialogShow = false;
              } else {
                this.$message.error(response.desc);
                this.dialogShow = false;
              }
            })
          } else {
            return false
          }
        })
      },
      rest(formName) {
        this.$refs[formName].resetFields();
      },
      resetForm() {
        if (this.$refs.stockInfoForm) {
          this.$refs.stockInfoForm.resetFields();
        }
        this.saveLoading = false
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleSizeChange(val) {
        this.size = val
        this.getStockInfoList()
      },
      handleCurrentChange(val) {
        this.page = val
        this.getStockInfoList()
      },
      stockProductHandleSizeChange(val) {
        this.stockProductSize = val
        this.getStockInfoProduct()
      },
      stockProductHandleCurrentChange(val) {
        this.stockProductPage = val
        this.getStockInfoProduct()
      },
      handleStockProductSelectionChange(val) {
        this.stockProductSelection = val
      },
      toStockInfoDetail(index, row) {
        this.activeName = 'stockInfoDetailList'
        this.stockInfos = row
        this.getStockInfoProduct()
      },
      getStockInfoProduct() {
        this.stockProductLoading = true
        fetchStockProduct(this.stockInfos, this.stockProductPage, this.stockProductSize).then(response => {
          this.stockProductLoading = false
          this.stockProducts = response.response
          this.stockProductsResult = response.response
          this.stockProductTotal = response.total
        })
      },
      getProducts() {
        this.productDialogShow = true
        this.productDialogLoading = true
        fetchProductList(this.stockInfos.id).then(response => {
          this.productDialogLoading = false
          this.products = response.response
          this.productsResult = response.response
        })
      },
      addProduct() {
        let products = []
        this.productsSelection.forEach(item => {
          let product = {};
          product.productId = item.productId
          product.tasteId = item.tasteId
          product.stockInfoId = this.stockInfos.id
          product.productName = item.productName
          products.push(product)
        })
        if (products.length > 0) {
          this.saveLoading = true
          addProduct(products).then(response => {
            this.saveLoading = false
            this.productDialogShow = false
            this.$message.success('上架成功')
            this.getStockInfoProduct()
          })
        } else {
          this.$message.error('请至少选择一条后再进行下架操作')
        }
      },

      offProduct() {
        const stockProducts = []
        this.stockProductSelection.forEach(item => {
          stockProducts.push(item.id)
        })
        if (stockProducts.length > 0) {
          offProduct(stockProducts).then(response => {
            this.$message.success('下架成功')
            this.getStockInfoProduct()
          })
        } else {
          this.$message.error('请至少选择一条后再进行下架操作')
        }
      },
      exportMore() {
        this.showExportMoreDialog = true;
      },
      exportExcel() {
        const stockProducts = []
        this.stockProductSelection.forEach(item => {
          stockProducts.push(item.id)
        })
        if (stockProducts.length > 0) {
          this.exportLoading = true
          fetchExportExcel(stockProducts).then(response => {
            this.exportLoading = false
            if (response.response === '') {
              this.$message({
                showClose: true,
                message: '获取excel失败',
                duration: 3000,
                type: 'warning'
              });
            } else {
              // console.log('-----------------' + JSON.stringify(response.response))
              const stockProductExcel = document.getElementById('getExcel');
              // console.log(response.response);
              stockProductExcel.setAttribute('href', response.response[0]);
              stockProductExcel.setAttribute('download', response.response[1]);
              stockProductExcel.click();
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请勾选要导出的商品',
            duration: 3000,
            type: 'warning'
          });
        }
      },

      handleProductsSelectionChange(val) {
        this.productsSelection = val
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
      stockProductDialogSelectChange() {
        this.stockProductsResult = [];
        this.stockProducts.forEach(item => {
          if (!this.stockProductDialogSelect) {
            this.stockProductsResult.push(item)
          } else {
            if (item.productName.indexOf(this.stockProductDialogSelect) !== -1) {
              this.stockProductsResult.push(item)
            }
          }
        })
        this.stockProductTotal = this.stockProductsResult.length
      },
      editStock(stockProducts) {
        stockProducts.edit = true
        stockProducts.newStock = stockProducts.stock
      },

      saveStockCount(row) {
        // 判断输入数字是否合法
        const re = /^[0-9]*[1-9][0-9]*$/;
        if (re.test(row.newStock)) {
          this.saveStock(row);
        } else {
          this.$notify({
            title: '库存数量错误',
            message: '库存数量应为正整数',
            type: 'error',
            duration: 1000
          });
        }
      },
      saveStock(row) {
        fetchSaveStock({ id: row.id, stock: row.newStock }).then(response => {
          if (response.code !== 0) {
            this.$notify({
              title: '修改补货量',
              message: '修改失败',
              type: 'error',
              duration: 1000
            });
          } else {
            row.stock = row.newStock
            row.edit = false
            this.$notify({
              title: '修改补货量',
              message: response.desc,
              type: 'success',
              duration: 1000
            });
          }
        });
      },
      handleChange(value) {
        if (value[0]) {
          this.stockInfoSearch.companyId = value[0]
        } else {
          this.stockInfoSearch.companyId = ''
        }
        if (value[1]) {
          this.stockInfoSearch.regionId = value[1]
        } else {
          this.stockInfoSearch.regionId = ''
        }
        if (value[2]) {
          this.stockInfoSearch.officeId = value[2]
        } else {
          this.stockInfoSearch.officeId = ''
        }
      },
      handleStockInfoChange(value) {
        if (value[0]) {
          this.stockInfos.companyId = value[0]
        } else {
          this.stockInfos.companyId = ''
        }
        if (value[1]) {
          this.stockInfos.regionId = value[1]
        } else {
          this.stockInfos.regionId = ''
        }
        if (value[2]) {
          this.stockInfos.officeId = value[2]
        } else {
          this.stockInfos.officeId = ''
        }
        fetchOfficeStockInfo(this.offices, this.stockInfos, value);
      },
      tabClick(tab, event) {
        if (tab.name === 'stockInfoList') {
          this.getStockInfoList()
        }
        if (tab.name === 'stockExcelList') {
          if (this.stockExcelList.length < 1) {
            this.getStockExcelList()
          }
        }
        // if (tab.name === 'stockInfoDetailList') {
        // }
        // if (tab.name === 'stockExcelDetailList') {
        //
        // }
        if (tab.name === 'replenishmentAuditing') {
          this.getReplenishmentAuditing()
        }
      },


      /* 以下为盘库部分的方法 */
      getStockExcelList() {
        this.stockExcelListLoading = true
        fetchStocktakingExcelList(this.stockExcelSearch, this.page1, this.size1).then(response =>{
          this.stockExcelListLoading = false
          this.stockExcelList = response.response
          this.total1 = response.total
        })
      },
      getStocktakingExcelDetailList(row) {
        this.stockExcelDetailListLoading = true
        fetchStocktakingExcelDetailList({ uuid: row.uuid }, 1, 100000).then(response =>{
          this.stockExcelDetailListLoading = false
          this.stockExcelDetailList = response.response
          this.stockExcelDetail = response.response[1]
          this.stockExcelDetailSizes = response.total
        })
      },

      impStockProduct() {
        this.$refs.stockInfoForm1.validate(valid => {
          if (valid) {
            this.sure = true
            fetchInitStockProduct(this.stockExcel.stockInfoId, this.stockExcel.uuid).then(response => {
              // console.log('response.response==='+JSON.stringify(response.response.length))
              if (response.code === 0) {
                if (response.response.length > 0) {
                  this.$message({
                    message: '盘库成功,但商品ID为：' + response.response + '盘库失败，原因库存没有该商品ID',
                    type: 'warning',
                    duration: 5000
                  })
                  this.resetForm1()
                  this.getStockExcelList()
                } else {
                  this.$message.success('盘库成功')
                  this.resetForm1()
                  this.getStockExcelList()
                }
              } else {
                this.$message.error('盘库失败')
                this.resetForm1()
              }
            })
          } else {
            return false
          }
        })
      },

      downloadStockProduct() {
        this.$refs.stockInfoForm2.validate(valid => {
          if (valid) {
            fetchDownloadStockProduct(this.stockExcel.stockInfoId).then(response => {
              if (response.response[0] !== '') {
                const stockProductExcel = document.getElementById('getExcel');
                stockProductExcel.setAttribute('href', response.response[0]);
                stockProductExcel.setAttribute('download', response.response[1]);
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

      // 查询导入excel详情
      searchStocktakingExcelDetail(row, event) {
        this.getStocktakingExcelDetailList(row)
        this.currentRecordId = row.uuid
        this.activeName = 'stockExcelDetail';
      },

      addStockExcel() {
        this.dialogShowa = true
        this.resetForma()
      },

      downloadStockExcel() {
        this.dialogShow2 = true
        this.resetForm2()
        fetchStockInfoList(this.stockInfoSearch, 1, 100000).then(response => {
          this.stockInfoListLoading = false
          this.stockInfoList = response.response
          this.total = response.total
        })
      },

      confirmExcel(row) {
        this.dialogShow1 = true
        this.stockExcel = row
      },
      uploadExcel(id) {
        this.uploadExcelData.id = id
        this.uploadDialogShow = true
        if (this.$refs.uploadExcel) {
          this.$refs.uploadExcel.clearFiles()
        }
      },
      handleSuccess(response, file, fileList) {
        // console.log('response.code ==='+response.code )
        if (response.code === 0) {
          this.$message.success('上传成功')
          this.getStockExcelList()
          if (fileList.length > 1) {
            fileList.shift()
          }
        } else {
          this.$refs.uploadExcel.clearFiles()
          this.$message.error(response.desc)
        }
      },
      resetForma() {
        if (this.$refs.stockExcelForm) {
          this.$refs.stockExcelForm.resetFields();
        }
        this.saveLoading = false
      },

      resetForm1() {
        if (this.$refs.stockInfoForm1) {
          this.$refs.stockInfoForm1.resetFields();
        }
        this.dialogShow1 = false
        this.sure = false
      },

      resetForm2() {
        if (this.$refs.stockExcelForm) {
          this.$refs.stockExcelForm.resetFields();
        }
        this.saveLoading1 = false
      },
      handleSizeChange1(val) {
        this.size = val
        this.getStockExcelList()
      },
      handleCurrentChange1(val) {
        this.page = val
        this.getStockExcelList()
      },
      stockExcelDetailHandleSizeChange(val) {
        this.stockExcelDetailSize = val
        this.getStocktakingExcelDetailList()
      },
      stockExcelDetailHandleCurrentChange(val) {
        this.stockExcelDetailPage = val
        this.getStocktakingExcelDetailList()
      },
      getReplenishmentAuditing() {
        this.replenishmentAuditingListLoading = true;
        this.replenishmentAuditingList = [];
        this.shouldRefresh = false;
        fetchReplenishmentAuditingList(this.replenishmentAuditingSearchForm, this.replenishmentAuditingPage, this.replenishmentAuditingSize).then(response => {
          this.replenishmentAuditingListLoading = false
          if (response.code === 0) {
            this.replenishmentAuditingTotal = response.total;
            this.replenishmentAuditingList = response.response;
          }
        })
      },
      handleReplenishmentAuditingTableSizeChange(val) {
        this.replenishmentAuditingSize = val;
        this.getReplenishmentAuditing();
      },
      handleReplenishmentAuditingTableCurrentChange(val) {
        this.replenishmentAuditingPage = val;
        this.getReplenishmentAuditing();
      },
      // 格式化时间
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 2)
        } else {
          return cellValue;
        }
      },
      formatterMoney(row, column, cellValue) {
        if (cellValue) {
          return cellValue + '元';
        } else {
          return cellValue;
        }
      },
      auditing(row) {
        this.auditingDialogVisible = true
        this.currentRow = row;
        this.auditingDialogListLoading = true;
        this.auditingList = [];
        this.auditingListForFilter = [];
        getDataForAuditing(row.id).then(response => {
          this.auditingDialogListLoading = false
          if (response.code === 0) {
            this.auditingList = response.response.details
            this.auditingListForFilter = response.response.details
          } else {
            this.auditingDialogVisible = false
            this.$message('该补货单已通过审核');
            this.getReplenishmentAuditing();
          }
        })
      },
      filterProductChange() {
        this.auditingList = [];
        this.auditingListForFilter.forEach(item => {
          if (!this.filterProduct) {
            this.auditingList.push(item)
          } else {
            if (item.productName.indexOf(this.filterProduct) !== -1) {
              this.auditingList.push(item)
            }
          }
        })
      },
      closeAuditingDialog(done) {
        this.filterProduct = '';
        this.auditingList = [];
        this.auditingListForFilter = [];
        this.currentRow = {};
        if (this.shouldRefresh) {
          this.getReplenishmentAuditing();
        }
        done();
      },
      closeAddReplenishmentRecordDialog(done) {
        this.clear();
        done();
      },
      clear() {
        this.addReplenishmentRecordData.id = '';
        this.addReplenishmentRecordData.stockId = '';
        this.addReplenishmentRecordData.productId = '';
        this.addReplenishmentRecordData.machineId = '';
        this.addReplenishmentRecordData.tasteId = '';
        this.addReplenishmentRecordData.products = [];
        this.addReplenishmentRecordData.count = '';
      },
      changeSelectReplenishment(selection) {
        this.selectReplenishmentIds = [];
        selection.forEach(item => {
          this.selectReplenishmentIds.push(item.id);
        })
      },
      passAll() {
        if (this.selectReplenishmentIds.length === 0) {
          this.$notify.info({
            title: '-_-||',
            message: '请先选择要审核的数据',
            duration: 3000
          });
        } else {
          fetchPass(this.selectReplenishmentIds).then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '审核通过'
              });
              this.getReplenishmentAuditing();
            }
          })
        }
      },
      pass() {
        const aId = [];
        aId.push(this.currentRow.id);
        fetchPass(aId).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '审核成功'
            });
            this.auditingDialogVisible = false;
            this.shouldRefresh = false;
            this.$nextTick(function() {
              this.getReplenishmentAuditing();
            })
          }
        })
      },
      edit() {
        const _this = this
        this.$prompt('请输入要为这个补货单中所有商品分别配送个数', '*_*', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?:0|[1-9][0-9]?|100)$/,
          inputErrorMessage: '商品个数应为0到100的正整数'
        }).then(({ value }) => {
          let couldChange = true
          for (let i = 0; i < _this.auditingListForFilter.length; i++) {
            if (_this.auditingListForFilter.stock < value) {
              couldChange = false
              break;
            }
          }
          if (couldChange) {
            fetchChangeReplenishment(this.currentRow.id, value, null, null).then(response => {
              if (response.code === 0) {
                _this.$message({
                  type: 'success',
                  message: '修改成功'
                });
                _this.auditing(_this.currentRow);
                _this.shouldRefresh = true;
              }
            })
          } else {
            _this.$message({
              type: 'error',
              message: '库存不足以满足补货需求请检查'
            });
          }
        }).catch();
      },
      checkTwo(row) {
        // 判断输入数字是否合法
        if (!isNaN(parseInt(row.count))) {
          if (row.count !== '' && row.count !== undefined) {
            if (isNaN(parseInt(row.count)) || parseInt(row.count) < 0) {
              // 数字不合法
              row.count = row.newCount;
              this.$notify({
                title: '补货量错误',
                message: '补货量应为整数',
                type: 'error',
                duration: 1000
              });
            } else {
              if (row.count !== row.newCount) {
                row.count = parseInt(row.count);
                fetchChangeReplenishment(this.currentRow.id, row.count, row.productId, row.tasteId).then(response => {
                  if (response.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '修改成功'
                    });
                    this.shouldRefresh = true;
                    row.newCount = row.count;
                  } else {
                    row.count = row.newCount;
                  }
                })
              }
            }
          } else {
            row.count = row.newCount;
          }
        } else {
          row.count = row.newCount;
          this.$notify({
            title: '补货量错误',
            message: '补货量应为正整数',
            type: 'error',
            duration: 1000
          });
        }
      },
      checkDateRange() {
        if (this.dateTime !== null) {
          const minDate = dealDateTime(this.dateTime[0])
          const maxDate = dealDateTime(this.dateTime[1])
          if (minDate && maxDate) {
            if ((this.dateTime[1] - this.dateTime[0]) / (1000 * 60 * 60 * 24) > 31) {
              this.$message({
                type: 'error',
                message: '导出数据时间范围最多为31天',
                duration: 8000,
                showClose: true
              });
              return false;
            }
          }
        }
        return true;
      },
      exportOutStock() {
        if (this.checkDateRange()) {
          this.exportStockLoading = true;
          window.setTimeout(function() {
            if (this.exportStockLoading === true) {
              this.exportStockLoading = false;
            }
          }, 180000);
          fetchExportOutStock(this.stockInfos.companyId, this.dateTime).then(response => {
            this.exportStockLoading = false;
            if (response.code === 0) {
              const stockProductExcel = document.getElementById('getExcel');
              stockProductExcel.setAttribute('href', response.response[0]);
              stockProductExcel.setAttribute('download', response.response[1]);
              stockProductExcel.click();
            } else {
              this.$message({
                type: 'error',
                message: response.desc,
                duration: 8000,
                showClose: true
              });
            }
          });
        }
      },
      exportInAndOutStock() {
        if (this.checkDateRange()) {
          this.exportStockLoading = true;
          window.setTimeout(function() {
            if (this.exportStockLoading === true) {
              this.exportStockLoading = false;
            }
          }, 180000);
          fetchExportInAndOutStock(this.stockInfos.companyId, this.dateTime).then(response => {
            this.exportStockLoading = false;
            if (response.code === 0) {
              const stockProductExcel = document.getElementById('getExcel');
              stockProductExcel.setAttribute('href', response.response[0]);
              stockProductExcel.setAttribute('download', response.response[1]);
              stockProductExcel.click();
            } else {
              this.$message({
                type: 'error',
                message: response.desc,
                duration: 8000,
                showClose: true
              });
            }
          });
        }
      },
      getMachineProductsForSelect() {
        this.product = [];
        fetchMachineUnreplenishmentProduct(this.currentRow.id, this.currentRow.machineId).then(response => {
          if (response.code === 0) {
            this.product = response.response;
          } else {
            this.$message({
              type: 'error',
              message: '查询设备上商品出错',
              showClose: true,
              duration: 5000
            })
          }
        });
      },
      addNewRecord() {
        this.addReplenishmentRecordData.stockId = this.currentRow.stockId;
        this.addReplenishmentRecordData.id = this.currentRow.id;
        this.addReplenishmentRecordData.machineId = this.currentRow.machineId;
        this.addReplenishmentRecordDialogVisible = true;
        this.getMachineProductsForSelect();
      },
      saveAddReplenishmentRecord() {
        let message = '';
        if (!this.addReplenishmentRecordData.products || this.addReplenishmentRecordData.products.length !== 2) {
          message = '请填写商品';
        }
        if (!this.addReplenishmentRecordData.count) {
          if (message !== '') {
            message += '和补货数量';
          } else {
            message = '请填写补货数量';
          }
        } else if (parseInt(this.addReplenishmentRecordData.count) < 0) {
          if (message !== '') {
            message += ',';
          }
          message += '补货数量应大于0';
        }
        if (message !== '') {
          this.$message({
            type: 'error',
            showClose: true,
            duration: 5000,
            message
          });
        } else {
          this.saveAddLoading = true;
          const _this = this;
          window.setTimeout(function() {
            if (this.saveAddLoading === true) {
              this.saveAddLoading = false;
            }
          }, 180000)
          this.addReplenishmentRecordData.productId = this.addReplenishmentRecordData.products[0];
          this.addReplenishmentRecordData.tasteId = this.addReplenishmentRecordData.products[1];
          fetchAddReplenishment(this.addReplenishmentRecordData).then(response => {
            let message, type = 'error';
            _this.saveAddLoading = false;
            if (response.code === 0) {
              message = '新增成功';
              type = 'success';
              _this.cancel();
              _this.shouldRefresh = true;
              _this.auditing(_this.currentRow);
            } else {
              message = response.desc
            }
            _this.$message({
              type,
              message,
              duration: 5000,
              showClose: true
            });
          })
        }
      },
      cancel() {
        this.clear();
        this.addReplenishmentRecordDialogVisible = false;
      },
      deleteReplenishmentRecord(row) {
        this.$confirm('删除后无法撤销确认删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const _this = this;
          // 确认删除
          deleteReplenishmentRecord(row.id).then(response => {
            if (response.code === 0) {
              _this.$message({
                type: 'success',
                message: '删除成功'
              });
              _this.shouldRefresh = true;
              _this.auditing(_this.currentRow);
            } else {
              _this.$message({
                type: 'error',
                message: '删除失败'
              });
            }
          })
        }).catch(() => {});
      }
    },
    watch: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
