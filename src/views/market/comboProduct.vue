<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName"
             @tab-click="changeTab">

      <el-tab-pane name="product">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2806"><svg
          class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
          viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2269"><path
          d="M811.524794 91.052762l-507.989663 0c-54.255695 0-99.431593 39.495526-108.364033 91.239004-52.927443 7.92039-93.650937 53.67855-93.650937 108.776426l0 535.989367c0 60.653405 49.344848 109.998253 109.998253 109.998253l507.989663 0c54.255695 0 99.431593-39.495526 108.365056-91.237981 52.92642-7.92039 93.650937-53.67855 93.650937-108.777449L921.524071 201.051015C921.522024 140.39761 872.177176 91.052762 811.524794 91.052762zM789.505291 827.057559c0 38.597063-31.402197 69.998237-69.998237 69.998237l-507.989663 0c-38.597063 0-69.998237-31.402197-69.998237-69.998237L141.519154 291.068192c0-38.597063 31.402197-69.998237 69.998237-69.998237l507.989663 0c38.597063 0 69.998237 31.402197 69.998237 69.998237L789.505291 827.057559zM881.523031 737.039359c0 32.382525-22.107507 59.689451-52.018747 67.64668L829.504284 291.068192c0-60.653405-49.344848-109.998253-109.998253-109.998253L236.458433 181.069939c8.621355-28.889981 35.421744-50.018184 67.076698-50.018184l507.989663 0c38.598086 0 69.998237 31.402197 69.998237 69.998237L881.523031 737.039359zM601.725534 257.386068c-19.978007 0-36.173874 16.195867-36.173874 36.173874 0 10.698666 4.672416 20.282952 12.05557 26.90579-3.090385 12.180414-8.131191 27.679409-16.156982 42.951231-21.239743 40.415478-53.436026 60.907185-95.691409 60.907185-42.304502 0-74.677816-20.523429-96.222505-61.000306-8.226359-15.454994-13.392008-31.134091-16.558118-43.382043 7.048533-6.600325 11.478426-15.963577 11.478426-26.380834 0-19.978007-16.195867-36.173874-36.172851-36.173874-19.978007 0-36.173874 16.195867-36.173874 36.173874 0 14.652721 8.728802 27.241434 21.255093 32.926924 3.637854 14.904455 9.856485 34.633798 20.239973 54.451146 28.582989 54.55143 74.281797 83.385129 132.154879 83.385129 57.919131 0 103.465466-28.866445 131.713834-83.479273 10.314926-19.941168 16.413831-39.789215 19.944238-54.729485 12.107759-5.848195 20.482497-18.207687 20.482497-32.55444C637.898385 273.580912 621.703541 257.386068 601.725534 257.386068z"
          p-id="2270"></path></svg></svg> 套餐商品</span>

        <el-form :model="productSearchForm" ref="productSearchForm" class="demo-form-inline" label-width="75px"
                 label-position="left">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="套餐商品名称" prop="productName" label-width="100px">
                <el-input v-model="productSearchForm.productName"
                          clearable
                          placeholder="请输入套餐商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :push="1">
              <el-button icon="el-icon-search" type="primary" round @click="search">搜索</el-button>
              <el-button icon="el-icon-plus" type="primary" round @click="addProduct" style="margin-left: 30px">新增
              </el-button>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          v-loading.body="productListLoading"
          element-loading-text="小喵使出了洪荒之力为您加载。。。"
          stripe
          border
          highlight-current-row
          :data="productList"
          ref="productList">
          <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="productName" label="商品名称" align="center"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="images" label="商品图片" align="center">
            <template slot-scope="scope">
              <el-popover
                ref="productImg"
                placement="right"
                trigger="hover">
                <img :src="scope.row.images" style="width:120px;height:120px;"/>
              </el-popover>
              <el-button v-popover:productImg type="text" v-if="scope.row.images">查看</el-button>
              <el-button type="text" v-text="scope.row.images ? '修改' : '上传'"
                         @click="uploadImg(scope.row.id)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="商城展示类别" align="center"></el-table-column>
          <el-table-column prop="labelName" label="标签名" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="spec" label="规格" align="center"></el-table-column>
          <el-table-column prop="shelfLife" label="保质期" align="center"></el-table-column>
          <el-table-column prop="description" label="描述" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="productEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="productDelete(scope.$index, scope.row)">删除
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

        <el-dialog title="图片上传" :visible.sync="uploadDialogShow">
          <el-upload
            class="upload-img"
            ref="uploadImg"
            :action="uploadImgUrl"
            :headers="uploadImgHeaders"
            :data="uploadImgData"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="comboList">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2806"><path
          d="M56.888889 1024 56.888889 0 739.555556 0 853.333333 113.777778 967.111111 227.555556 967.111111 1024 56.888889 1024ZM910.222222 227.555556 739.555556 227.555556 739.555556 56.888889 113.777778 56.888889 113.777778 967.111111 910.222222 967.111111 910.222222 227.555556ZM284.444444 341.333333 227.555556 341.333333 227.555556 284.444444 284.444444 284.444444 284.444444 341.333333ZM284.444444 568.888889 227.555556 568.888889 227.555556 512 284.444444 512 284.444444 568.888889ZM284.444444 796.444444 227.555556 796.444444 227.555556 739.555556 284.444444 739.555556 284.444444 796.444444ZM796.444444 341.333333 341.333333 341.333333 341.333333 284.444444 796.444444 284.444444 796.444444 341.333333ZM796.444444 568.888889 341.333333 568.888889 341.333333 512 796.444444 512 796.444444 568.888889ZM796.444444 796.444444 341.333333 796.444444 341.333333 739.555556 796.444444 739.555556 796.444444 796.444444Z"
          p-id="2620"></path></svg> 套餐活动</span>

        <el-form :model="comboListSearchForm" ref="comboListSearchForm" class="demo-form-inline" label-width="75px"
                 label-position="left">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="活动名称" prop="productName">
                <el-input v-model="comboListSearchForm.comboProductName"
                          placeholder="请输入套餐活动名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :push="1">
              <el-form-item label="机构" prop="companyId" label-width="15%">
                <el-select v-model="comboListSearchForm.companyId" filterable clearable placeholder="选择大区" style="width: 280px;">
                  <el-option v-for="item in offices"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :push="2">
              <el-form-item label="活动状态" prop="discountOver">
                <el-select v-model="comboListSearchForm.status" clearable placeholder="请选择状态">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="时间" prop="dateTime" label-width="11%">
                <div class="block">
                  <el-date-picker
                    v-model="comboListSearchForm.dateTime"
                    type="datetimerange"
                    :picker-options="pickerOption"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="5" :push="2">
              <el-button icon="el-icon-search" type="primary" round @click="searchComboList">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          v-loading.body="comboListLoading"
          element-loading-text="小喵使出了洪荒之力为您加载。。。"
          stripe
          border
          highlight-current-row
          :data="comboList"
          ref="comboList">
          <el-table-column prop="id" label="活动编号" align="center"></el-table-column>
          <el-table-column prop="comboProductName" label="活动名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="productName" label="商品名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="companyName" label="活动大区" align="center"></el-table-column>
          <el-table-column prop="purchasePrice" label="进价" align="center" :formatter="formatterMoney"></el-table-column>
          <el-table-column prop="salePrice" label="售价" align="center" :formatter="formatterMoney"></el-table-column>
          <el-table-column prop="productStatus" label="商品状态" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.productStatus == 1 ? 'info' : scope.row.productStatus == 2 ? 'success' : 'danger'"
                close-transition>
                {{scope.row.productStatus == 1 ? '新品' : scope.row.productStatus == 2 ? '正常' : '热卖'}}
                </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productSource" label="来源" align="center"></el-table-column>
          <el-table-column prop="status" label="活动状态" align="center">
            <template slot-scope="scope">
              <el-switch
                style="display: block"
                v-model="scope.row.status"
                active-color="#ff4949"
                :active-value="0"
                :inactive-value="1"
                inactive-color="#13ce66"
                active-text="结束"
                inactive-text="进行"
                @change="switchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="beginDate" label="开始时间" align="center" :formatter="formatterDateTime" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endDate" label="结束时间" align="center" :formatter="formatterDateTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="showComboProductDetail(scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <p class="block" style="float:right">
          <el-pagination
            @size-change="handleComboListSizeChange"
            @current-change="handleComboListCurrentChange"
            :current-page="comboListPage"
            :page-sizes="comboListSizes"
            :page-size="comboListSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="comboListTotal">
          </el-pagination>
        </p>

      </el-tab-pane>

      <el-tab-pane name="createCombo">
        <span slot="label"><i class="el-icon-view"></i> 活动详情</span>
        <el-card class="box-card">
          <el-row>
            <!--步骤条-->
            <el-col :span="7">
              <el-steps :space="250" direction="vertical" :active="step" style="margin-top: 45%">
                <el-step title="选择活动范围" icon="el-icon-info"></el-step>
                <el-step title="填写活动信息" icon="el-icon-edit"></el-step>
              </el-steps>
            </el-col>
            <!--活动范围-->
            <el-col :span="10" class="combo-tree" v-show="step === 1">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">活动范围</h3>
                </div>
                <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
                </el-input>
                <el-tree class="filter-tree"
                         :data="machines"
                         :props="treeProps"
                         show-checkbox
                         node-key="id"
                         :default-expanded-keys="['1']"
                         :default-checked-keys="defaultCheckedMachine"
                         :highlight-current="true"
                         v-loading="treeLoading"
                         element-loading-text="拼命加载中..."
                         ref="machines"
                         :filter-node-method="filterNode">
                </el-tree>
                <el-button style="margin-top: 10px; margin-left: 40%" round icon="el-icon-caret-bottom"
                           @click="next">下一步
                </el-button>
              </el-card>
            </el-col>
            <!--活动信息-->
            <el-col :span="15" class="combo-tree" v-show="step === 2">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">其他条件</h3>
                </div>
                <el-form :model="comboForm" label-position="left" ref="comboForm"
                         label-width="80px"
                         :rules="comboFormRules">
                  <el-form-item label="活动名称" prop="comboProductName" label-width="82px" style="margin-top: 20px;margin-left: 5%">
                    <el-input
                              placeholder="请输入套餐活动名称"
                              v-model.number="comboForm.comboProductName"
                              style="width: 90%"></el-input>
                  </el-form-item>
                  <el-form-item label=" 套  餐 " prop="combo" style="margin-top: 20px;margin-left: 5%">
                    <el-select v-model="comboForm.combo" placeholder="请选择套餐商品">
                      <el-option
                        v-for="item in combo"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label=" 进  价 " prop="purchasePrice" style="margin-top: 50px;margin-left: 5%">
                    <el-input-number v-model="comboForm.purchasePrice"
                                     :min="0"
                                     size="medium"
                                     :step="1"
                                     placeholder="请输入套餐商品售价"></el-input-number>
                  </el-form-item>
                  <el-form-item label=" 售  价 " prop="salePrice" style="margin-top: 50px;margin-left: 5%">
                    <el-input-number v-model="comboForm.salePrice"
                                     :min="0"
                                     size="medium"
                                     :step="1"
                                     placeholder="请输入套餐商品售价"></el-input-number>
                  </el-form-item>
                  <el-form-item label="商品状态" prop="productStatus" label-width="17%"
                                style="margin-top: 50px;margin-left: 5%">
                    <el-select v-model="comboForm.productStatus" placeholder="请选择套餐商品状态">
                      <el-option
                        v-for="item in productStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label=" 来  源 " prop="productSource" style="margin-top: 50px;margin-left: 5%">
                    <el-input v-model="comboForm.productSource"
                              style="width: 90%"
                              placeholder="请输入套餐商品来源"></el-input>
                  </el-form-item>
                  <el-form-item label=" 时  间 " prop="dateTime" style="margin-top: 50px;margin-left: 5%">
                    <div class="block">
                      <el-date-picker
                        v-model="comboForm.dateTime"
                        type="datetimerange"
                        :picker-options="pickerOption"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        style="width: 90%;">
                      </el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item label=" 限  购 " prop="timeIntervalNumber" style="margin-top: 50px;margin-left: 5%">
                    <el-input placeholder="请输入限购时间间隔" v-model="comboForm.timeIntervalNumber" :disabled="!(comboForm.timeIntervalType)" :maxlength="3" class="input-with-select">
                      <el-select v-model="comboForm.timeIntervalType"
                                 slot="prepend"
                                 placeholder="限购时间单位"
                                 @change="selectChange"
                                 style="width: 130px;">
                        <el-option label="不限购" :value="0"></el-option>
                        <el-option label="日" :value="1"></el-option>
                        <el-option label="周" :value="2"></el-option>
                        <el-option label="月" :value="3"></el-option>
                        <el-option label="年" :value="4"></el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="限购数" prop="timeIntervalCount" style="margin-top: 50px;margin-left: 5%">
                    <el-input type="number" pattern="[0-9]*"
                              :disabled="!(comboForm.timeIntervalType)"
                              v-model.number="comboForm.timeIntervalCount" placeholder="商品每人限购数"></el-input>
                  </el-form-item>
                  <el-form-item style="margin-top: 50px;">
                    <el-button style="margin-left: 13%" round icon="el-icon-caret-top" @click="pre">上一步</el-button>
                    <el-button type="primary" round icon="el-icon-plus" :loading="createLoading" @click="create">保存</el-button>
                    <el-button icon="el-icon-delete" round @click="resetForm('comboForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="dialogTitle" :visible.sync="productShow" v-on:close="resetForm('operatorProduct')">
      <div style="overflow:scroll;height:450px">
        <el-form :model="operatorProduct" label-position="left" ref="operatorProduct" class="product-form"
                 :rules="productFormRules" label-width="100px" style="margin: 0 3%">
          <el-form-item label="商品ID" v-show="false" prop="id">
            <el-input v-model="operatorProduct.id" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="productName">
            <el-input v-model="operatorProduct.productName" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="包含商品" prop="component" style="width: 1000px">
            <el-transfer
              v-model="operatorProduct.component"
              :data="allProducts"
              :disabled="true"
              :props="{key: 'id',label: 'productName'}"
              :button-texts="['移除', '添加']"
              :titles="['非套餐商品', '套餐组成部分']"
              filterable
              filter-placeholder="请输入商品名称">
            </el-transfer>
          </el-form-item>
          <el-form-item label="商品分类" prop="goodsCategoryIdList">
            <el-cascader
              :options="goodsCategories"
              v-model="operatorProduct.goodsCategoryIdList"
              :props="cProps"
              clearable
              @change="handleCategoryChange"
              placeholder="选择商品所属分类"
              style="width:100%">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品比例" prop="scale">
            <el-input v-model="operatorProduct.scale"
                      placeholder="请输入该套餐中各商品比例。如A商品2个,B商品3个则输入2:3(:为英文的冒号)。若只有A商品3个则输入3">
            </el-input>
          </el-form-item>
          <el-form-item label="展示类别" prop="categoryId">
            <el-select v-model="operatorProduct.categoryId" filterable clearable placeholder="选择展示类别"
                       style="width:100%">
              <el-option v-for="category in categories" :key="category.id" :label="category.categoryName"
                         :value="parseInt(category.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品标签" prop="labelIdSelected">
            <el-select v-model="operatorProduct.labelIdSelected" multiple placeholder="选择标签"
                       style="width:100%">
              <el-option v-for="brandLabel in brandLabels" :key="brandLabel.id" :label="brandLabel.labelName"
                         :value="parseInt(brandLabel.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售类型" prop="saleType" label-width="100px">
            <el-select v-model="operatorProduct.saleType" filterable clearable placeholder="请选择销售类型" style="width:100%">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格" prop="spec">
            <el-input v-model="operatorProduct.spec" placeholder="规格"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="operatorProduct.unit" placeholder="单位"></el-input>
          </el-form-item>
          <el-form-item label="保质期" prop="shelfLife">
            <el-input v-model="operatorProduct.shelfLife" placeholder="保质期"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input type="textarea" v-model="operatorProduct.description" placeholder="商品描述"></el-input>
          </el-form-item>
          <!--<el-form-item label="条形码" prop="barCode">
            <el-input pattern="[0-9]*"
                      v-model="operatorProduct.barCode" placeholder="商品条形码"></el-input>
          </el-form-item>-->
          <!--<el-form-item label="重量" prop="weight">
            <el-input type="number" v-model="operatorProduct.weight" placeholder="重量（单位：克）"></el-input>
          </el-form-item>-->
          <el-form-item label="备注" prop="note">
            <el-input type="textarea" v-model="operatorProduct.note" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" :loading="saveLoading">确定</el-button>
        <el-button @click="resetForm('operatorProduct')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import { fetchCategoryList } from '../../api/category';
  import { fetchBrandLabelList } from '../../api/brandLabel';
  import {
    deleteComboProduct,
    fetchComboList,
    fetchComboProduct, fetchComboProductDetail,
    fetchProductDetail,
    fetchProductForTransfer,
    fetchProductList,
    fetchSaveProduct, saveComboActivity, updateComboStatus
  } from '../../api/comboProduct';
  import { fetchGoodsCategory } from '../../utils/goodsCategory';
  import { fetchGoodsCategoryTree } from '../../api/goodsCategory';
  import { getToken } from '../../utils/auth';
  import { dealDateTime, fetchMachineTree } from '../../api/discount';
  import { fetchOffices } from '../../api/office';

  export default {
    created() {
      this.search();
    },
    data() {
      return {
        /* 套餐商品 */
        productSearchForm: {
          productName: ''
        },
        operatorProduct: {
          id: '',
          productName: '',
          categoryId: '',
          component: [],
          scale: '',
          categoryName: '',
          spec: '',
          unit: '',
          shelfLife: '',
          description: '',
          note: '',
          labelIds: '',
          labelIdSelected: [],
          saleType: '',
          labelName: '',
          bigCategoryId: '',
          middleCategoryId: '',
          littleCategoryId: '',
         /* bigCategoryName: '',
          middleCategoryName: '',
          littleCategoryName: '',*/
          goodsCategoryIdList: []
        },
        currentProductId: '',
        categories: [],
        allProducts: [],
        brandLabels: [],
        productList: [],
        cProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        options1: [{
          value: 1,
          label: '自助机销售'
        }],
        page: 1,
        sizes: [10, 20, 50, 100, 300, 500],
        size: 10,
        total: 0,
        goodsCategories: [],
        uploadImgUrl: process.env.BASE_API + '/api/private/product/image',
        uploadImgHeaders: {
          'X-AUTH-TOKEN': getToken()
        },
        uploadImgData: {
          id: ''
        },
        productShow: false,
        saveLoading: false,
        uploadDialogShow: false,
        productListLoading: false,
        dialogTitle: '新增套餐商品',
        productFormRules: {
          productName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          categoryId: [
            { type: 'number', required: true, message: '请选择商品展示类别', trigger: 'change' }
          ],
          goodsCategoryIdList: [{
            type: 'array', required: true, message: '请选择商品分类', trigger: 'change'
          }],
          labelIdSelected: [
            { type: 'array', required: true, message: '请选择商品标签', trigger: 'change' }
          ],
          saleType: [{
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请选择销售类型'));
              } else {
                callback();
              }
            }, trigger: 'change'
          }],
          salePrice: [
            {
              validator: (rule, value, callback) => {
                if ((/(^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$)/.test(value) === false) && (/(^[1-9]\d*$)/.test(value) === false)) {
                  callback(new Error('请规范输入商品售价'));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
          ],
          purchasePrice: [
            {
              validator: (rule, value, callback) => {
                if ((/(^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$)/.test(value) === false) && (/(^[1-9]\d*$)/.test(value) === false)) {
                  callback(new Error('请规范输入商品进价'));
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
          ],
          component: [
            { type: 'array', required: true, message: '请选择套餐包含商品', trigger: 'blur, change' }
          ],
          scale: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请规范输入套餐中各商品比例'));
                  return;
                }
                if (this.operatorProduct.component) {
                  const aN = value.split(':');
                  for (let i = 0; i < aN.length; i++) {
                    if (parseInt(aN[i])) {
                      aN[i] = parseInt(aN[i]);
                    } else {
                      callback(new Error('输入套餐中各商品比例不规范'));
                      return;
                    }
                  }
                  if (aN.length === this.operatorProduct.component.length) {
                    callback();
                  } else {
                    callback(new Error('输入比例与商品数不匹配'));
                  }
                } else {
                  callback();
                }
              }, trigger: 'change'
            }
          ],
          shelfLife: [
            { required: true, message: '请输入商品保质期', trigger: 'blur' }
          ]
        },
        /* 查询套餐活动 */
        comboListSearchForm: {
          comboProductName: '',
          dateTime: '',
          status: '',
          companyId: ''
        },
        comboListPage: 1,
        comboListSizes: [10, 20, 50, 100, 300, 500],
        comboListSize: 10,
        comboListTotal: 0,
        offices: [],
        comboListLoading: false,
        comboList: [],
        options: [{
          value: '2',
          label: '全部'
        }, {
          value: '1',
          label: '进行中'
        }, {
          value: '0',
          label: '已结束'
        }],
        /* 新建套餐活动 */
        machines: [],
        comboForm: {
          id: '',
          combo: '',
          oldCombo: '',
          salePrice: '',
          purchasePrice: '',
          productStatus: '',
          comboProductName: '',
          productSource: '',
          companyId: '',
          dateTime: '',
          beginDate: '',
          endDate: '',
          machineList: [],
          timeIntervalType: '',
          timeIntervalCount: '',
          timeIntervalNumber: '',
          timeIntervalNumberDisabled: true
        },
        comboFormRules: {
          combo: [{
            type: 'number', required: true, message: '请选择套餐商品', trigger: 'blur, change'
          }],
          comboProductName: [{
            type: 'string', required: true, message: '请输入套餐活动名', trigger: 'blur, change'
          }],
          salePrice: [{
            required: true,
            validator: (rule, value, callback) => {
              if (value === undefined || value <= 0) {
                callback(new Error('售价必须大于0'));
              } else {
                callback();
              }
            }, trigger: 'blur, change'
          }],
          purchasePrice: [{
            required: true,
            validator: (rule, value, callback) => {
              if (value === undefined || value <= 0) {
                callback(new Error('进价必须大于0'));
              } else {
                callback();
              }
            }, trigger: 'blur, change'
          }],
          productStatus: [{
            type: 'number', required: true, message: '请选择套餐商品状态', trigger: 'blur, change'
          }],
          productSource: [{
            type: 'string', required: true, message: '请选择套餐商品来源', trigger: 'blur, change'
          }],
          dateTime: [{
            validator: (rule, value, callback) => {
              if (value == undefined || value == '') {
                callback(new Error('请选择套餐商品活动时间'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }],
          timeIntervalNumber: [
            {
              validator: (rule, value, callback) => {
                if (this.comboForm.timeIntervalType && this.comboForm.timeIntervalType !== '0') {
                  if (/(^[1-9]\d*$)/.test(value) === false) {
                    callback(new Error('请规范输入限购日期'));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }, trigger: 'change, blur'
            }
          ],

          timeIntervalCount: [
            {
              validator: (rule, value, callback) => {
                if (this.comboForm.timeIntervalType && this.comboForm.timeIntervalType !== '0') {
                  if (/(^[1-9]\d*$)/.test(value) === false) {
                    callback(new Error('请规范输入限购数量'));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }, trigger: 'change, blur'
            }
          ]
        },
        combo: [],
        productStatus: [{
          value: 1,
          label: '新品'
        }, {
          value: 2,
          label: '正常'
        }, {
          value: 3,
          label: '热卖'
        }],
        treeProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        step: 1,
        filterText: '',
        type: 'create',
        defaultCheckedMachine: ['-1'],
        createLoading: false,
        treeLoading: false,
        /* 通用 */
        activeName: 'product',
        // 初始化时间快捷选项
        pickerOption: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '一周',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '一个月',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '半年',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 182);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    methods: {
      /* 套餐商品 */
      search() {
        this.productListLoading = true;
        fetchProductList(this.productSearchForm, this.page, this.size).then(response => {
          this.productListLoading = false;
          if (response.code === 0) {
            this.productList = response.response;
            this.total = response.total;
          }
        })
      },
      clearOperatorProduct() {
        this.operatorProduct.id = '';
        this.operatorProduct.productName = '';
        this.operatorProduct.categoryId = '';
        this.operatorProduct.component = [];
        this.operatorProduct.scale = '';
        this.operatorProduct.categoryName = '';
        this.operatorProduct.spec = '';
        this.operatorProduct.unit = '';
        this.operatorProduct.shelfLife = '';
        this.operatorProduct.description = '';
        this.operatorProduct.note = '';
        this.operatorProduct.labelIds = '';
        this.operatorProduct.labelIdSelected = [];
        this.operatorProduct.saleType = '';
        this.operatorProduct.labelName = '';
        this.operatorProduct.bigCategoryId = '';
        this.operatorProduct.middleCategoryId = '';
        this.operatorProduct.littleCategoryId = '';
        /* this.operatorProduct.bigCategoryName = '';
        this.operatorProduct.middleCategoryName = '';
        this.operatorProduct.littleCategoryName = ''; */
        this.operatorProduct.goodsCategoryIdList = []
      },
      save() {
        this.$refs.operatorProduct.validate(valid => {
          if (valid) {
            this.saveLoading = true;
            if (this.operatorProduct.categoryId) {
              this.operatorProduct.categoryName = this.categories.find(item => {
                return item.id === this.operatorProduct.categoryId
              }).categoryName
            }
            if (this.operatorProduct.labelIdSelected.length > 0) {
              this.operatorProduct.labelIds = this.operatorProduct.labelIdSelected.join(',')
            } else {
              this.operatorProduct.labelName = '';
              this.operatorProduct.labelIds = '';
            }
            fetchSaveProduct(this.operatorProduct).then(response => {
              this.saveLoading = false;
              if (response.code === 0) {
                this.$message('操作成功');
                this.productShow = false;
                this.search();
                this.clearOperatorProduct();
              } else {
                this.$message('操作失败');
              }
            })
          }
        });
        setTimeout(function () {
          if (this.saveLoading === true) {
            this.saveLoading = false;
          }
        }, 18000);
      },
      uploadImg(productId) {
        this.uploadImgData.id = productId;
        this.uploadDialogShow = true;
        if (this.$refs.uploadImg) {
          this.$refs.uploadImg.clearFiles();
        }
      },
      getProductForTransfer() {
        fetchProductForTransfer().then(response => {
          if (response.code === 0) {
            this.allProducts = response.response;
          } else {
            this.allProducts = [];
          }
        })
      },
      addProduct() {
        this.productShow = true;
        this.dialogTitle = '新增套餐商品';
        this.getBrandLabel();
        this.getProductForTransfer();
        this.getCategory();
        this.getGoodsCategoryTree();
      },
      getDetail(pId) {
        fetchProductDetail(pId).then(response => {
          if (response.code === 0) {
            this.resetForm('operatorProduct');
            this.operatorProduct = response.response;
            if (response.response.labelIdSelected) {
              for (let i = 0; i < response.response.labelIdSelected.length; i++) {
                response.response.labelIdSelected[i] = parseInt(response.response.labelIdSelected[i])
              }
            }
          }
        });
        this.productShow = true;
      },
      productEdit(index, row) {
        this.productShow = true;
        this.dialogTitle = '修改套餐商品';
        this.getBrandLabel();
        this.getCategory();
        this.getGoodsCategoryTree();
        this.getProductForTransfer();
        this.getDetail(row.id);
      },
      productDelete(index, row) {
        this.$confirm('您正在删除套餐商品，删除之后将无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 开始删除
          deleteComboProduct(row.id).then(response => {
            if (response.code === 0) {
              this.$message(response.desc);
              this.search();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSuccess(response, file, fileList) {
        if (response.code === 0) {
          this.$message.success('上传成功');
          if (fileList.length > 1) {
            fileList.shift()
          }
          this.productList = [];
          this.total = 0;
          this.search();
        } else {
          this.$refs.uploadImg.clearFiles();
          this.$message.error(response.desc)
        }
      },
      handleCategoryChange(value) {
        if (value[0]) {
          this.operatorProduct.bigCategoryId = value[0]
        } else {
          this.operatorProduct.bigCategoryId = ''
        }
        if (value[1]) {
          this.operatorProduct.middleCategoryId = value[1]
        } else {
          this.operatorProduct.middleCategoryId = ''
        }
        if (value[2]) {
          this.operatorProduct.littleCategoryId = value[2]
        } else {
          this.operatorProduct.littleCategoryId = ''
        }
        if (value && value.length === 3) {
          fetchGoodsCategory(this.goodsCategories, this.operatorProduct, value);
        }
      },
      getGoodsCategoryTree() {
        fetchGoodsCategoryTree().then(response => {
          if (response.response) {
            this.goodsCategories = response.response[0].children
          }
        })
      },
      getBrandLabel() {
        fetchBrandLabelList({}, 1, 100000).then(response => {
          this.brandLabels = response.response
        })
      },
      getCategory() {
        fetchCategoryList({}, 1, 100000).then(response => {
          this.categories = response.response
        })
      },
      handleSizeChange(val) {
        this.size = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      /* 查询套餐 */
      searchComboList() {
        this.comboListLoading = true;
        fetchComboList(this.comboListSearchForm, this.comboListSize, this.comboListPage).then(response => {
          this.comboListLoading = true;
          if (response.code === 0) {
            this.comboList = response.response;
            this.comboListTotal = response.total;
          }
        });
      },
      writeData(response) {
        this.type = 'edit';
        this.activeName = 'createCombo';
        this.step = 1;
        this.comboForm.id = response.id;
        this.comboForm.comboProductName = response.comboProductName;
        this.comboForm.combo = response.combo;
        this.comboForm.salePrice = response.salePrice;
        this.comboForm.purchasePrice = response.purchasePrice;
        this.comboForm.oldCombo = response.oldCombo;
        this.comboForm.productStatus = response.productStatus;
        this.comboForm.productSource = response.productSource;
        this.comboForm.comboProductName = response.comboProductName;
        this.comboForm.companyId = response.companyId;
        this.comboForm.machineList = response.machineList;
        this.comboForm.timeIntervalType = response.timeIntervalType;
        this.comboForm.timeIntervalNumber = response.timeIntervalNumber;
        this.comboForm.timeIntervalCount = response.timeIntervalCount;
        this.comboForm.timeIntervalNumberDisabled = true;
        this.getMachineTree();
        let beginDate = new Date();
        if (response.beginDate) {
          beginDate = new Date(response.beginDate);
        }
        let endDate = new Date();
        if (response.endDate) {
          endDate = new Date(response.endDate);
        }
        this.comboForm.dateTime = [
          beginDate, endDate
        ];
      },
      showComboProductDetail(row) {
        fetchComboProductDetail(row.id).then(response => {
          if (response.code === 0) {
            const _this = this;
            this.$nextTick(() => {
              _this.writeData(response.response);
            })
          }
        })
      },
      switchChange(row) {
        updateComboStatus(row.status, row.id).then(response => {
          if (response.code !== 0) {
            this.$message({
              message: '修改' + row.productName + '套餐失败',
              duration: 2000,
              type: 'error',
              showClose: true
            });
          } else {
            // 成功
            this.$message({
              message: '修改' + row.productName + '套餐成功',
              duration: 1000,
              type: 'success',
              showClose: true
            });
          }
        });
        this.searchComboList();
      },
      getOffices() {
        fetchOffices().then(response => {
          if (response.code === 0) {
            this.offices = response.response;
          }
        });
      },
      handleComboListSizeChange(val) {
        this.comboListSize = val;
        this.searchComboList();
      },
      handleComboListCurrentChange(val) {
        this.comboListPage = val;
        this.searchComboList();
      },
      /* 创建套餐商品 */
      dealData() {
        this.comboForm.machineList = this.dealCheckNodeToMachineArray();
        if (this.comboForm.machineList <= 0) {
          this.$message({
            message: '请选择设备',
            duration: 2000,
            type: 'error',
            showClose: true
          });
          this.pre();
          return null;
        }
        this.comboForm.beginDate = dealDateTime(this.comboForm.dateTime[0]);
        this.comboForm.endDate = dealDateTime(this.comboForm.dateTime[1]);
        return 1;
      },
      create() {
        this.$refs.comboForm.validate(valid => {
          if (valid && this.dealData()) {
            this.createLoading = true;
            saveComboActivity(this.comboForm).then(response => {
              this.createLoading = false;
              if (response.code === 0) {
                this.resetForm('comboForm');
                this.pre();
                this.$message({
                  message: '保存套餐成功',
                  duration: 2000,
                  type: 'success',
                  showClose: true
                });
                this.clear();
              } else {
                this.$message({
                  message: response.desc,
                  duration: 2000,
                  type: 'error',
                  showClose: true
                });
              }
            });
            const _this = this;
            setTimeout(function() {
              if (_this.createLoading === true) {
                _this.createLoading = false;
              }
            }, 18000);
          }
        });
      },
      dealCheckNodeToMachineArray() {
        const checkNodes = this.$refs.machines.getCheckedNodes();
        const machineList = [];
        if (checkNodes.length === 0) {
          return null;
        } else {
          for (let i = 0; i < checkNodes.length; i++) {
            if (checkNodes[i].attributes.isMachine !== undefined) {
              machineList.push(checkNodes[i].id);
            }
          }
          return machineList;
        }
      },
      next() {
        const machineList = this.dealCheckNodeToMachineArray();
        if (machineList !== null) {
          this.step = 2;
          this.getComboProductForSelect();
        } else {
          this.$message({
            message: '请先选择设备',
            duration: 2000,
            type: 'error',
            showClose: true,
          });
        }
      },
      pre() {
        this.step = 1;
      },
      getComboProductForSelect() {
        this.combo = [];
        fetchComboProduct().then(response => {
          if (response.code === 0) {
            this.combo = response.response;
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getMachineTree() {
        this.treeLoading = true;
        fetchMachineTree().then(response => {
          this.machines = response.response;
          this.treeLoading = false;
          if (this.type !== 'create') {
            if (this.comboForm.machineList) {
              this.$refs.machines.setCheckedKeys(this.comboForm.machineList);
            }
          }
        });
      },
      /* 通用 */
      changeTab(tab) {
        if (tab.name === 'comboList') {
          this.searchComboList();
          this.getOffices();
          this.resetForm('comboForm');
          this.clear();
        } else if (tab.name === 'createCombo') {
          this.step = 1;
          this.getMachineTree();
        } else {
          this.resetForm('comboForm');
          this.clear();
        }
      },
      clear() {
        this.$refs.machines.setCheckedKeys([]);
        this.comboForm.beginDate = '';
        this.comboForm.combo = '';
        this.comboForm.oldCombo = '';
        this.comboForm.machineList = [];
        this.comboForm.dateTime = '';
        this.comboForm.endDate = '';
        this.comboForm.companyId = '';
        this.comboForm.timeIntervalNumber = '';
        this.comboForm.timeIntervalType = '';
        this.comboForm.timeIntervalCount = '';
        this.comboForm.timeIntervalNumberDisabled = true;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 3)
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
      selectChange(v) {
        if (v === 0) {
          this.comboForm.timeIntervalNumber = '';
          this.comboForm.timeIntervalCount = '';
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.machines.filter(val);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .combo-tree, .combo-form {
    transition: .2s;
    .filter-tree {
      margin-top: 20px;
    }
  }
</style>
