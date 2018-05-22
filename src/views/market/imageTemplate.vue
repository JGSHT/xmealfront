<template>
  <div style="margin: 1% 2%;">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="imageTemplateList">
        <span slot="label"><i class="el-icon-document"></i> 图片模板</span>
        <el-form :inline="true" :model="imageTemplateSearch" class="demo-form-inline">
          <el-form-item label="图片名称">
            <el-input v-model="imageTemplateSearch.imageName" placeholder="图片名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" round @click="getImageTemplateList">查询</el-button>
            <el-button icon="el-icon-plus" round @click="addImageTemplate">新增</el-button>
          </el-form-item>
        </el-form>

        <el-table
          ref="multipleTable"
          v-loading="imageTemplateListLoading"
          :data="imageTemplateList"
          border
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="imageName"
            label="图片名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="images"
            label="轮播图片"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-popover
                ref="images"
                placement="right"
                trigger="hover">
                <img :src="scope.row.images" style="width:120px;height:120px;"/>
              </el-popover>
              <el-button v-popover:images type="text" v-if="scope.row.images">查看</el-button>
              <el-button type="text" v-text="scope.row.images ? '修改':'上传'" @click="uploadImg(scope.row.id)"></el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            label="图片链接"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="imageTemplateEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="imageTemplateDelete(scope.$index, scope.row)">删除
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
            <el-form :inline="true" :model="imageTemplates" label-position="left" ref="imageTemplateForm"
                     :rules="imageTemplateFormRules" v-loading="formLoading" label-width="125px"
                     style="margin: 0 3%">

              <el-form-item label="图片名称" prop="imageName">
                <el-input style="width: 480px;" v-model="imageTemplates.imageName"></el-input>
              </el-form-item>

              <el-form-item label="图片链接" prop="imageUrl">
                <el-input style="width: 480px;" v-model="imageTemplates.imageUrl"></el-input>
              </el-form-item>

              <el-form-item prop="id">
                <el-input :hidden="true" v-model="imageTemplates.id"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveImageTemplate" :loading="saveLoading">确定</el-button>
            <el-button @click="dialogShow = false">取消</el-button>
          </div>
        </el-dialog>
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
          <p>
            <el-button size="small" type="primary" @click="uploadDialogShow = false">确定</el-button>
          </p>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="carouselMapList">
        <span slot="label"><svg class="icon"
                                style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2806"><path
          d="M978.5856 281.7024H906.752c-21.5552 0-35.9424 14.3872-35.9424 35.9424 0 21.5552 14.3872 35.9424 35.9424 35.9424h35.9424v287.488h-35.9424c-21.5552 0-35.9424 14.3872-35.9424 35.9424 0 21.5552 14.3872 35.9424 35.9424 35.9424h71.8848c21.5552 0 35.9424-14.3872 35.9424-35.9424v-359.424c-0.0512-21.5552-14.4384-35.8912-35.9936-35.8912zM116.1728 353.536c21.5552 0 35.9424-14.3872 35.9424-35.9424 0-21.5552-14.3872-35.9424-35.9424-35.9424H44.3392c-21.5552 0-35.9424 14.3872-35.9424 35.9424v359.3216c0 21.5552 14.3872 35.9424 35.9424 35.9424H116.224c21.5552 0 35.9424-14.3872 35.9424-35.9424 0-21.5552-14.3872-35.9424-35.9424-35.9424h-35.9936V353.536h35.9424z m431.2064 143.7696c61.0816 0 107.8272-46.6944 107.8272-107.776s-46.6944-107.8272-107.8272-107.8272c-61.0816 0-107.776 46.6944-107.776 107.8272s46.6944 107.776 107.776 107.776z m0-143.7696c21.5552 0 35.9424 14.3872 35.9424 35.9424 0 21.5552-14.3872 35.9424-35.9424 35.9424-21.5552 0-35.9424-14.3872-35.9424-35.9424 0-21.5552 14.3872-35.9424 35.9424-35.9424z m251.5456-215.6032H224c-21.5552 0-35.9424 14.3872-35.9424 35.9424v646.8096c0 21.5552 14.3872 35.9424 35.9424 35.9424h574.9248c21.5552 0 35.9424-14.3872 35.9424-35.9424V173.8752c0-21.5552-14.3872-35.9424-35.9424-35.9424z m-35.9424 646.8096H259.9424v-97.024l107.776-107.776 118.5792 122.1632c7.168 7.168 14.3872 10.8032 25.1392 10.8032 7.168 0 17.9712-3.584 25.1392-10.8032l82.6368-86.2208 143.7184 143.7184v25.1392z m0-118.5792l-122.1632-122.1632c-7.168-7.168-14.3872-10.8032-21.5552-10.8032-7.168 0-17.9712 3.584-25.1392 10.8032L511.488 630.2208 392.8576 508.0576c-10.8032-7.168-17.9712-10.8032-25.1392-10.8032s-17.9712 3.584-25.1392 10.8032l-82.6368 82.6368V209.8176h503.0912v456.3456z m0 0"
          p-id="2372"></path></svg> 轮播图列表</span>
        <el-form :model="carouselMapSearch" class="demo-form-inline">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label="机构" prop="parentIdList">
                <el-cascader
                  :options="offices"
                  v-model="carouselMapSearch.parentIdList"
                  :props="cascaderProps"
                  change-on-select
                  clearable
                  @change="handleChange"
                  style="width: 80%;">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="轮播图名称" label-width="25%">
                <el-input v-model="carouselMapSearch.carouselMapName" placeholder="轮播图名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="时间" prop="dateTime" label-width="16%">
                <div class="block">
                  <el-date-picker
                    v-model="carouselMapSearch.dateTime"
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
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="状态" prop="status">
                <el-select v-model="carouselMapSearch.status" clearable placeholder="请选择状态">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :push="2">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" round @click="getCarouselMapList">查询</el-button>
                <!--<el-button icon="el-icon-plus" round @click="">新增</el-button>-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          ref="multipleTable"
          v-loading="carouselMapListLoading"
          :data="carouselMapList"
          border
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="id"
                           label="轮播图编号"
                           align="center">
          </el-table-column>
          <el-table-column
            prop="carouselMapName"
            label="轮播图名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column
            prop="images"
            label="轮播图片"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button v-popover:images type="text" @click="imageTemplateShow(scope.$index, scope.row)">点击预览
              </el-button>
            </template>
          </el-table-column>-->
          <el-table-column
            prop="companyName"
            align="center"
            label="公司名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="contentLED"
            align="center"
            label="LED内容"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="beginDate"
            align="center"
            label="开始时间"
            :formatter="formatterDateTime"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="endDate"
            align="center"
            label="结束时间"
            :formatter="formatterDateTime"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope" align="center">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                inactive-text="结束"
                active-text="进行"
                :active-value="1"
                :inactive-value="0"
                @change="switchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <!--<el-table-column
            prop="officeName"
            label="机构名称"
            show-overflow-tooltip>
          </el-table-column>-->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="carouselMapEdit(scope.$index, scope.row)">编辑
              </el-button>
              <!--<el-button
                size="small"
                type="danger"
                @click="carouselMapDelete(scope.$index, scope.row)">删除
              </el-button>-->
              <el-button
                size="small"
                @click="carouselMapSend(scope.$index, scope.row)">同步
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="block" style="float:right">
          <el-pagination
            @size-change="carouselMapHandleSizeChange"
            @current-change="carouselMapHandleCurrentChange"
            :current-page="carouselMapPage"
            :page-sizes="carouselMapSizes"
            :page-size="carouselMapSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="carouselMapTotal">
          </el-pagination>
        </p>

        <el-dialog title="图片模板预览" :visible.sync="imageTemplateDialogShow">
          <el-form ref="imageTemplateForm">
            <div align="center" style="width: 650px;height: 350px">
              <!--<template>
                <el-carousel indicator-position="outside">
                  <el-carousel-item v-for="imageTemplate in imageTemplates" :key="imageTemplate.images">
                    <img :src="imageTemplate.images"  style="width: 850px;height: 350px"/>
                  </el-carousel-item>
                </el-carousel>
              </template>-->
              <template>
                <el-carousel :interval="4000" type="card" height="350px" width="650px">
                  <el-carousel-item v-for="imageTemplate in imageTemplateLists" :key="imageTemplate.images">
                    <h3><img :src="imageTemplate.images" style="width: 850px;height: 350px"/></h3>
                  </el-carousel-item>
                </el-carousel>
              </template>
            </div>
          </el-form>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane name="createCarouseMap">
        <span slot="label"><i class="el-icon-plus"></i> 轮播图详情</span>

        <el-card class="box-card">
          <el-row>
            <!--步骤条-->
            <el-col :span="7">
              <el-steps :space="250" direction="vertical" :active="step" style="margin-top: 45%">
                <el-step title="选择展示设备" icon="el-icon-info"></el-step>
                <el-step title="填写轮播图信息" icon="el-icon-edit"></el-step>
              </el-steps>
            </el-col>
            <!--选择设备-->
            <el-col :span="10" class="combo-tree" v-show="step === 1">
              <el-card>
                <div slot="header" class="clearfix" style="height: 12px;">
                  <h3 style="line-height: 12px; display: inline">展示轮播图的设备</h3>
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

                <el-form :model="carouselMaps"
                         label-position="left"
                         ref="carouselMaps"
                         :rules="carouselMapFormRules"
                         label-width="125px">
                  <el-form-item label="轮播图名称" prop="carouselMapName">
                    <el-input style="width: 90%" v-model="carouselMaps.carouselMapName"
                              placeholder="请输入轮播图名称"></el-input>
                  </el-form-item>

                  <el-form-item label="选择图片模板" prop="imageTemplateIds">
                    <el-transfer
                      v-model="carouselMaps.imageTemplateIds"
                      :data="carouselMapImageTemplates"
                      filterable
                      filter-placeholder="请输入图片名称"
                      :titles="['可选图片模板', '已有图片模板']"
                      :props="{key: 'id',label: 'imageName'}">
                    </el-transfer>
                  </el-form-item>

                  <el-form-item label=" 时 间 " prop="dateTime" style="margin-top: 50px">
                    <div class="block">
                      <el-date-picker
                        v-model="carouselMaps.dateTime"
                        type="datetimerange"
                        :picker-options="pickerOption"
                        range-separator="至"
                        start-placeholder="生效日期"
                        end-placeholder="截止日期"
                        align="right"
                        style="width: 90%;">
                      </el-date-picker>
                    </div>
                  </el-form-item>

                  <el-form-item label="LED内容" prop="contentLED">
                    <el-input style="width: 90%" v-model="carouselMaps.contentLED" placeholder="请输入LED显示内容"></el-input>
                  </el-form-item>

                  <el-form-item prop="id">
                    <el-input :hidden="true" v-model="carouselMaps.id"></el-input>
                  </el-form-item>

                  <el-form-item style="margin-top: 50px;">
                    <el-button style="margin-left: 30%" round icon="el-icon-caret-top" @click="pre">上一步</el-button>
                    <el-button type="primary" round icon="el-icon-plus" @click="create">创建</el-button>
                    <el-button icon="el-icon-delete" round @click="restForm('carouselMaps')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {
    fetchImageTemplateList,
    fetchDeleteImageTemplate,
    fetchSaveImageTemplate,
    fetchUpdateImageTemplate
  } from 'api/imageTemplate';
  import { getToken } from 'utils/auth';
  import { fetchOfficeTree } from 'api/office';
  import { fetchMachineTree} from '../../api/discount';
  import {
    fetchCarouselMapAllInfo,
    fetchCarouselMapList,
    fetchImageTemplate,
    fetchSaveCarouselMap, fetchUpdateCarouselMap,
    updateCarouselMapStatus
  } from '../../api/carouselMap';

  export default {
    created() {
      this.getImageTemplateList()
    },
    data() {
      return {
        activeName: 'imageTemplateList',
        imageTemplateSearch: {
          imageName: ''
        },
        imageTemplateList: [],
        imageTemplateListLoading: false,
        page: 1,
        size: 10,
        total: 0,
        sizes: [10, 20, 50, 100],

        dialogTitle: '新增',
        dialogShow: false,
        formLoading: false,
        treeLoading: false,
        saveLoading: false,
        uploadImgUrl: process.env.BASE_API + '/api/private/imageTemplate/image',
        uploadImgHeaders: {
          'X-AUTH-TOKEN': getToken()
        },
        uploadImgData: {
          id: ''
        },
        imageTemplates: {
          id: '',
          imageName: '',
          imageUrl: '',
          images: ''
        },
        imageTemplateFormRules: {
          imageName: [
            { required: true, message: '请输入图片名称', trigger: 'blur' }
          ]
          /* ,imageUrl: [
            { required: true, message: '请输入图片链接', trigger: 'blur'}
          ], */
        },
        options: [{
          value: '2',
          label: '全部'
        }, {
          value: '1',
          label: '显示'
        }, {
          value: '0',
          label: '停止'
        }],
        carouselMapSearch: {
          carouselMapName: '',
          parentIdList: [],
          dateTime: '',
          status: ''
        },
        officeList: {
          id: '',
          pid: '',
          name: '',
          attributes: [],
          children: []
        },
        carouselMapList: [],
        carouselMapListLoading: false,
        cascaderProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        offices: [],
        carouselMapPage: 1,
        carouselMapSize: 10,
        carouselMapTotal: 0,
        carouselMapSizes: [10, 20, 50, 100],

        carouselMapTreeLoading: false,
        imageTemplateDialogShow: false,
        carouselMapFilterText: '',
        uploadDialogShow: false,
        menus: [],
        imageName: '',
        carouselMapImageTemplates: [],
        imageTemplateLists: [],
        carouselMaps: {
          id: '',
          carouselMapName: '',
          imageTemplateIds: [],
          dateTime: [],
          machineIdList: [],
          contentLED: ''
        },
        carouselMapFormRules: {
          carouselMapName: [{
            required: true, message: '请输入轮播图名称', trigger: 'blur, change'
          }],
          imageTemplateIds: [{
            type: 'array', required: true, message: '请选择图片模板', trigger: 'blur, change'
          }],
          dateTime: [{
            type: 'array', required: true, message: '请选择图片模板', trigger: 'blur, change'
          }],
          contentLED: [{
            required: true, message: '请选择LED内容', trigger: 'blur, change'
          }]
        },
        step: 1,
        filterText: '',
        defaultCheckedMachine: ['-1'],
        machines: [],
        type: 'create',
        treeProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
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
      getImageTemplateList() {
        this.imageTemplateListLoading = true;
        fetchImageTemplateList(this.imageTemplateSearch, this.page, this.size).then(response => {
          this.imageTemplateListLoading = false;
          this.imageTemplateList = response.response;
          this.total = response.total;
        })
      },

      imageTemplateEdit(index, row) {
        this.dialogShow = true;
        this.dialogTitle = '编辑'
        this.formLoading = true;
        fetchUpdateImageTemplate(row.id).then(response => {
          this.formLoading = false
          this.imageTemplates = response.response
        })
      },
      imageTemplateDelete(index, row) {
        this.$confirm('此操作将永久删除该图片模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.imageTemplateListLoading = true
          fetchDeleteImageTemplate(row.id).then(response => {
            this.getImageTemplateList();
            this.$message.success('删除成功')
          })
        })
      },
      carouselMapSend(index, row) {
        this.$message.success('尚无此功能');
        // this.$confirm('此操作将同步设备对应的LED显示内容, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.imageTemplateListLoading = true;
        //   fetchSendImageTemplate(row).then(response => {
        //     if (response.code === 0) {
        //       this.getImageTemplateList();
        //       this.$message.success('同步成功');
        //     } else {
        //       this.$message.success('同步失败');
        //     }
        //   })
        // })
      },
      addImageTemplate() {
        this.dialogTitle = '新增';
        this.dialogShow = true;
        this.resetForm()
      },
      saveImageTemplate() {
        this.$refs.imageTemplateForm.validate((valid) => {
          if (valid) {
            this.saveLoading = true;
            fetchSaveImageTemplate(this.imageTemplates).then(response => {
              this.getImageTemplateList();
              this.saveLoading = false;
              this.$message.success('保存成功');
              this.dialogShow = false
            })
          } else {
            return false;
          }
        })
      },
      resetForm() {
        if (this.$refs.imageTemplateForm) {
          this.$refs.imageTemplateForm.resetFields();
        }
        this.saveLoading = false
      },
      handleSizeChange(val) {
        this.size = val;
        this.getImageTemplateList()
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getImageTemplateList()
      },
      uploadImg(id) {
        this.uploadImgData.id = id
        this.uploadDialogShow = true
        if (this.$refs.uploadImg) {
          this.$refs.uploadImg.clearFiles()
        }
      },
      handleSuccess(response, file, fileList) {
        if (response.code === 0) {
          this.$message.success('上传成功')
          if (fileList.length > 1) {
            fileList.shift()
          }
          this.getImageTemplateList()
        } else {
          this.$refs.uploadImg.clearFiles()
          this.$message.error(response.desc)
        }
      },

      getImageTemplateLists() {
        fetchImageTemplateList({}, 1, 100000).then(response => {
          this.carouselMapImageTemplates = response.response
        })
      },

      getImageTemplateListById(id) {
        fetchImageTemplate(id).then(response => {
          this.imageTemplateLists = response.response
        })
      },
      // 查询轮播图列表
      getCarouselMapList() {
        this.carouselMapListLoading = true;
        fetchCarouselMapList(this.carouselMapSearch, this.page, this.size).then(response => {
          this.carouselMapListLoading = false;
          if (response.code === 0) {
            this.carouselMapList = response.response;
            this.carouselMapTotal = response.total;
          }
        })
      },
      getOffices() {
        fetchOfficeTree().then(response => {
          if (response.code === 0 && response.response) {
            this.offices = response.response[0].children;
          }
        })
      },
      clear() {
        this.$refs.carouselMaps.resetFields();
        this.carouselMaps.id = '';
        this.step = 1;
        this.$refs.machines.setCheckedKeys([]);
        this.carouselMaps.machineIdList = [];
      },
      writeDate(response) {
        this.clear();
        this.carouselMaps.machineIdList = response.machineIdList;
        this.carouselMaps.imageTemplateIds = response.imageTemplateIds;
        this.carouselMaps.id = response.id;
        this.carouselMaps.status = response.status;
        this.carouselMaps.carouselMapName = response.carouselMapName;
        this.carouselMaps.contentLED = response.contentLED;
        this.carouselMaps.companyId = response.companyId;
        this.carouselMaps.companyName = response.companyName;
        this.getMachineTree();
        this.activeName = 'createCarouseMap';
        this.type = 'edit';
        let beginDate = new Date();
        if (response.beginDate) {
          beginDate = new Date(response.beginDate);
        }
        let endDate = new Date();
        if (response.endDate) {
          endDate = new Date(response.endDate);
        }
        this.carouselMaps.dateTime = [
          beginDate, endDate
        ];
      },
      // 编辑轮播图
      carouselMapEdit(index, row) {
        // this.getImageTemplateLists()
        fetchCarouselMapAllInfo(row.id).then(response => {
          if (response.code === 0) {
            this.writeDate(response.response);
          }
          /* this.carouselMaps.officeIdList = [];
          this.carouselMaps.officeIdList.push(response.response.companyId.toString())
          this.carouselMaps.officeIdList.push(response.response.regionId.toString())
          this.carouselMaps.officeIdList.push(response.response.officeId.toString()) */
        })
      },
      // 删除轮播图
      // carouselMapDelete(index, row) {
      //   this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.carouselMapListLoading = true;
      //     fetchDeleteCarouselMap(row.id).then(response => {
      //       this.getCarouselMapList();
      //       this.$message.success('删除成功')
      //     })
      //   })
      // },

      imageTemplateShow(index, row) {
        this.resetFormImageTemplate();
        this.imageTemplateDialogShow = true;
        this.getImageTemplateListById(row.id);
      },

      resetFormImageTemplate() {
        if (this.$refs.imageTemplateForm) {
          this.$refs.imageTemplateForm.resetFields();
        }
      },
      restForm(formName) {
        this.$refs[formName].resetFields();
      },
      carouselMapHandleSizeChange(val) {
        this.carouselMapSize = val;
        this.getCarouselMapList();
      },
      carouselMapHandleCurrentChange(val) {
        this.carouselMapPage = val;
        this.getCarouselMapList();
      },
      handleChange(value) {
        if (value[0]) {
          this.carouselMapSearch.companyId = value[0]
        } else {
          this.carouselMapSearch.companyId = ''
        }
        if (value[1]) {
          this.carouselMapSearch.regionId = value[1]
        } else {
          this.carouselMapSearch.regionId = ''
        }
        if (value[2]) {
          this.carouselMapSearch.officeId = value[2]
        } else {
          this.carouselMapSearch.officeId = ''
        }
      },

      tabClick(tab, event) {
        if (tab.name === 'imageTemplateList') {
          if (this.imageTemplateList.length < 1) {
            this.getImageTemplateList()
          }
        } else if (tab.name === 'carouselMapList') {
          this.getCarouselMapList();
          if (this.carouselMapList.length < 1) {
            this.getCarouselMapList();
            this.getImageTemplateLists();
            this.getOffices()
          }
        } else {
          this.getMachineTree();
        }
        if (tab.name !== 'createCarouseMap') {
          this.clear();
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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
      getMachineTree() {
        this.treeLoading = true;
        fetchMachineTree().then(response => {
          this.machines = response.response;
          this.treeLoading = false;
          if (this.type !== 'create') {
            if (this.carouselMaps.machineIdList) {
              this.$refs.machines.setCheckedKeys(this.carouselMaps.machineIdList);
            }
          }
        });
      },
      next() {
        const machineList = this.dealCheckNodeToMachineArray();
        if (machineList !== null) {
          this.carouselMaps.machineIdList = machineList;
          this.step = 2;
          this.getImageTemplateLists();
        } else {
          this.$message({
            message: '请先选择设备',
            duration: 2000,
            type: 'error',
            showClose: true
          });
        }
      },
      pre() {
        this.step = 1;
      },
      create() {
        this.$refs.carouselMaps.validate(valid => {
          if (valid) {
            if (this.type === 'create') {
              fetchSaveCarouselMap(this.carouselMaps).then(response => {
                if (response.code === 0) {
                  this.$message({
                    message: '新建轮播图成功',
                    duration: 2000,
                    type: 'success',
                    showClose: true
                  });
                  this.step = 1;
                  this.type = 'create';
                  this.resetForm('carouselMaps');
                  this.carouselMaps.machineList = [];
                  this.$refs.machines.setCheckedKeys([]);
                } else {
                  this.$message({
                    message: '新建轮播图失败',
                    duration: 2000,
                    type: 'error',
                    showClose: true
                  });
                }
              })
            } else {
              fetchUpdateCarouselMap(this.carouselMaps).then(response => {
                if (response.code === 0) {
                  this.$message({
                    message: '修改轮播图成功',
                    duration: 2000,
                    type: 'success',
                    showClose: true
                  });
                  this.step = 1;
                  this.type = 'create';
                  this.resetForm('carouselMaps');
                  this.carouselMaps.machineList = [];
                  this.$refs.machines.setCheckedKeys([]);
                } else {
                  this.$message({
                    message: '修改轮播图失败',
                    duration: 2000,
                    type: 'error',
                    showClose: true
                  });
                }
              })
            }
          }
        })
      },
      switchChange(val) {
        updateCarouselMapStatus(val.status, val.id).then(response => {
          if (response == undefined || response.code !== 0) {
            // 回退
            if (val.status == 0) {
              val.status = 1;
            } else {
              val.status = 0;
            }
            this.$message({
              message: '修改轮播图开关失败',
              duration: 2000,
              type: 'error',
              showClose: true
            });
          } else {
            // 成功
            this.$message({
              message: '修改轮播图开关活动成功',
              duration: 1000,
              type: 'success',
              showClose: true
            });
          }
          this.getCarouselMapList();
        })
      },
      formatterDateTime(row, column, cellValue) {
        if (cellValue) {
          return cellValue.substring(0, cellValue.length - 2)
        } else {
          return cellValue;
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

<style rel="stylesheet/scss" lang="scss">
  .el-transfer-panel__body {
    height: 300px;
  }

  .combo-tree, .combo-form {
    transition: .2s;
    .filter-tree {
      margin-top: 20px;
    }
  }
</style>
