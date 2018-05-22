<template>
  <div style="width: 100%; height: 100% !important;position: relative">
    <div class="nav" align="left">
      <a class="back" @click="back" style="color:gray;">﹤返回</a>
      <h4 align="right" style="margin-right: 20px">🙈{{this.name}}</h4>
    </div>
    <div class="city">
      <h4 style="margin-left: 20px">当前区域：{{this.cName}}</h4>
    </div>
      <group :title="stockTitle" style="size: A3">
        <div v-if="showMachine" v-for=" v in machineProductsResult">
          <!--<template slot-scope="scope">-->
              <cell
                is-link
                value-align="left"
                :border-intent="v.showProducts"
                :arrow-direction="v.showProducts ? 'up' : 'down'"
                @click.native="getMachineProductlist(v)">
                 设备名： {{v.machineName}}  机构： {{v.officeName}}  地址： {{v.address}}
              </cell>
          <!--</template>-->
        </div>
        <div>
          <alert v-model="showMsg" title="警告！！" >输入的数量不在正确范围内！！！</alert>
        </div>
        <div v-if="showProduct"  v-for=" v in productsResult">
          <cell-box :border-intent="false" class="sub-item"
                    :is-link=false
                    value-align="right">
            <div style="padding-left: 0px;">
              <div>商品Id：<span>{{v.productId}}</span></div>
            </div>
            <div style="padding-left: 10px;">
              <div>商品名称：<span>{{v.productName}}</span></div>
            </div>
            <div style="padding-left: 10px;">
              <div>口味：<span>{{v.tasteName}}</span></div>
            </div>
            <div style="padding-left: 10px;">
              <div>库存：<span v-show="!v.edit">{{ v.stock }}</span>
                <input style="width: 30px;" type="number" pattern="[0-9]*" :min="1" :max="10"
                       v-model.number="v.newStock"  v-show="v.edit"></input>
                <a v-show="!v.edit" type="text" class="btn-charge" @click="toEdit(v)">修改</a>
                <a v-show="v.edit" type="text" class="btn-charge" @click="saveStock(v)">提交</a>
              </div>
            </div>
          </cell-box>
        </div>
        <div>
          <x-dialog v-model="showBuildMsg" class="dialog-demo">
            <div style="padding:15px;">
              <x-button @click.native="buildStockCountRecord" type="primary">点击确认录入</x-button>
            </div>
            <div @click="showBuildMsg=false">
              <span class="vux-close"></span>
            </div>
          </x-dialog>
        </div>
        <div>
          <alert v-model="showSuccessfulMsg" title="恭喜！！" >录入盘库清单成功！！！</alert>
        </div>
        <div>
          <alert v-model="showCountMsg" title="警告！！" >商品库存均无更新，不需要录入！！！</alert>
        </div>
        <x-button @click.native="buildMsg" :gradients="['#1D62F0', '#19D5FD']" type="primary" v-if="showProduct"  style="margin-bottom: 40px">生成设备盘库清单</x-button>
      </group>
    <div class="foot">
      <div>福州鲜喵网络科技有限公司</div>
    </div>
  </div>
</template>

<script>
  import {Alert, XDialog,
    XButton, Datetime, Selector, Cell, CellBox, CellFormPreview, Group, Badge} from 'vux'

  export default {
    components: {
      Datetime,
      Alert,
      XDialog,
      XButton,
      Group,
      Cell,
      CellFormPreview,
      CellBox,
      Badge,
      Selector
    },
    data () {
      return {
        format: 'YYYY-MM-DD HH:mm',
        beginDate: '',
        endDate: '',
        newStock: 0,
        showMsg: false,
        showSuccessfulMsg: false,
        showCountMsg: false,
        showBuildMsg: false,
        showProduct: false,
        showMachine: true,
        stockTitle: '区域设备列表',
        machineProductsLoading: false,
        machineId: 0,
        machineName: '',
        companyId: '',
        companyName: '',
        productsResult: [],
        oldProductsResult: [],
        productsSelection: [],
        machineProductsResult: [],
        machineProduct: {},
        id: this.$route.query.id,
        name: this.$route.query.name,
        cId: this.$route.query.companyId,
        cName: this.$route.query.companyName,
        machineList: [],
        count: 0,
        iosMarquee: {
          'white-space': 'nowrap',
          'overflow': 'hidden',
          'text-overflow': 'ellipsis'
        }
      }
    },
    created () {
      this.getMachineList()
      // this.getMachine()
    },
    methods: {
      getMachineProductlist (val) {
        this.machineId = val.id
        this.machineName = val.machineName
        this.companyId = val.companyId
        this.companyName = val.companyName
        var params = {
          request: {
            id: val.id
          }
        }
        this.$http.post('/api/public/stockCountAPI/productList', params).then(res => {
          if (res.body.code === 0) {
            this.productsResult = res.body.response
            this.oldProductsResult = JSON.parse(JSON.stringify(res.body.response))
            // console.log(this.productsResult)
            this.stockTitle = '当前设备商品列表'
            this.showProduct = true
            this.showMachine = false
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: res.body.desc,
              position: 'middle',
              width: '10em'
            })
          }
        })
      },
      getMachineList () {
        var params = {
          request: {
            companyId: this.cId
          }
        }
        console.log(this.cId);
        this.$http.post('/api/public/stockCountAPI/machineList', params).then(res => {
          if (res.body.code === 0) {
            this.machineProductsResult = res.body.response
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: res.body.desc,
              position: 'middle',
              width: '10em'
            })
          }
        })
      },
      buildMsg () {
        this.showBuildMsg = true
      },
      buildStockCountRecord () {
        if (this.count > 0) {
          var params = {
            request: {
              userId: 1,
              machineId: this.machineId,
              machineName: this.machineName,
              companyId: this.companyId,
              companyName: this.companyName,
              productList: this.oldProductsResult
            }
          }
          this.$http.post('/api/public/stockCountAPI/buildStockCountRecord', params).then(res => {
            if (res.body.code === 0) {
              this.showSuccessfulMsg = true
              this.showBuildMsg = false
              this.showProduct = false
              this.showMachine = true
              this.count = 0
            }
          })
        } else {
          this.showCountMsg = true
          this.showBuildMsg = false
        }
      },
      toEdit (product) {
        product.newStock = product.stock
        product.edit = true
      },
      saveStock (product) {
        var params = {
          request: {
            machineId: product.machineId,
            productId: product.productId,
            tasteId: product.tasteId,
            newStock: product.newStock
          }
        }
        if (product.newStock < 0 || product.newStock > 999) {
          this.showMsg = true
          return
        }
        this.$http.post('/api/public/stockCountAPI/updateStock', params).then(res => {
          product.stock = product.newStock
          product.edit = false
          this.count += 1
        })
      },
      back () {
        this.machineId = 0
        this.machineName = ''
        this.companyId = ''
        this.companyName = ''
        this.stockTitle = '区域设备列表'
        this.showMachine = true
        this.showProduct = false
      }
    }
  }
</script>
<style lang="less">
  @import '../../../node_modules/vux/src/styles/1px.less';
  @import '../../../node_modules/vux/src/styles/close.less';
  .sub-item {
    color: #888;
  }
  .slide {
    padding: 0 20px;
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
  .back {
    padding: 0 10px;
    line-height: 30px;
    font-size: 16px;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .nav{
    display: flex;
    position: relative;
  }
  .nav>h4{
    font-size: 18px;
    font-weight:normal;
    color: gray;
    position: absolute;
    top: 2px;
    right: 0;
   }
  .city{
    text-align: right;
    margin-right: 20px;

  }
  .city>h4{
    color: cornflowerblue;

  }
  .foot{
    width: 100%;
    height: 40px;
    position: fixed;
    background-color:lightskyblue;
    bottom: 0px;
    text-align: center;
    border-radius: 6px;
   }
  .foot>div{
    width: 100%;
    position: absolute;
    bottom: 0;
    line-height: 40px;
  }
</style>
