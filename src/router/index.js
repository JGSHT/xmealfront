import Vue from 'vue';
import Router from 'vue-router';


const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('error/404'), hidden: true },
  { path: '/stockCountLogin', component: _import('stockApi/stockCountLogin'), hidden: true },
  { path: '/stockCountMachine',component: _import('stockApi/stockCountMachine'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('charts/sale') }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/admin',
    component: Layout,
    name: '系统管理',
    icon: 'quanxian',
    meta: { menus: ['admin:menu', 'admin:office', 'admin:role', 'admin:user', 'admin:log'] },
    children: [
      { path: 'menu', component: _import('admin/menu'), name: '菜单管理', meta: { menus: ['admin:menu'] } },
      { path: 'office', component: _import('admin/office'), name: '机构管理', meta: { menus: ['admin:office'] } },
      { path: 'role', component: _import('admin/role'), name: '角色管理', meta: { menus: ['admin:role'] } },
      { path: 'user', component: _import('admin/user'), name: '用户管理', meta: { menus: ['admin:user'] } },
      { path: 'log', component: _import('admin/log'), name: '用户日志', meta: { menus: ['admin:log'] } }
    ]
  }, {
    path: '/data',
    component: Layout,
    name: '信息中心',
    icon: 'zonghe',
    meta: { menus: ['data:product', 'data:category', 'data:machine', 'data:branchInfo', 'data:station', 'data:brandLabel', 'data:deviceType', 'data:template', 'data:goodsCategory', 'data:areaProduct'] },
    children: [
      { path: 'product', component: _import('product/index'), name: '商品信息', meta: { menus: ['data:product'] } },
      { path: 'category', component: _import('product/category'), name: '品类信息', meta: { menus: ['data:category'] } },
      { path: 'machine', component: _import('machine/machineInfo'), name: '设备信息', meta: { menus: ['data:machine'] } },
      { path: 'branchInfo', component: _import('machine/branchInfo'), name: '网点信息', meta: { menus: ['data:branchInfo'] } },
      { path: 'station', component: _import('machine/station'), name: '站点信息', meta: { menus: ['data:station'] } },
      { path: 'areaProduct', component: _import('product/areaProduct'), name: '区域商品信息', meta: { menus: ['data:areaProduct'] } },
      { path: 'brandLabel', component: _import('product/brandLabel'), name: '商品标签信息', meta: { menus: ['data:brandLabel'] } },
      { path: 'goodsCategory', component: _import('product/goodsCategory'), name: '商品分类管理', meta: { menus: ['data:goodsCategory'] } },
      { path: 'deviceType', component: _import('machine/deviceType'), name: '设备类型信息', meta: { menus: ['data:deviceType'] } },
      { path: 'template', component: _import('product/template'), name: '商品模板设置', meta: { menus: ['data:template'] } }
    ]
  }, {
    path: '/order',
    component: Layout,
    name: '订单管理',
    icon: 'ziliaoshouce',
    meta: { menus: ['order:info', 'order:refund'] },
    children: [
      { path: 'info', component: _import('order/order'), name: '订单信息', meta: { menus: ['order:info'] } },
      { path: 'orderException', component: _import('order/orderException'), name: '订单异常', meta: { menus: ['order:orderException'] } },
      { path: 'refund', component: _import('order/refund'), name: '订单退款', meta: { menus: ['order:refund'] } }
    ]
  },
  {
    path: '/invoicing',
    component: Layout,
    name: '进销存',
    icon: 'zujian',
    meta: { menus: ['invoicing:replenishment', 'stock:stockExcel', 'stock:stockInfo', 'invoicing:stockCount'] },
    children: [
      {
        path: 'replenishment',
        component: _import('machine/replenishment'),
        name: '补货',
        meta: { menus: ['invoicing:replenishment'] }
      },
      {
        path: 'stockExcel',
        component: _import('stock/stockExcel'),
        name: '商品入库',
        meta: { menus: ['stock:stockExcel'] }
      },
      {
        path: 'stockInfo',
        component: _import('stock/stockInfo'),
        name: '仓库管理',
        meta: { menus: ['stock:stockInfo'] }
      },
      {
        path: 'stockCount',
        component: _import('stock/stockCount'),
        name: '盘库',
        meta: { menus: ['invoicing:stockCount'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: '用户中心',
    icon: 'xinrenzhinan',
    meta: { menus: ['user:customerInfo', 'user:feedbackInfo', 'user:customerAddress'] },
    children: [
      {
        path: 'customerInfo',
        component: _import('customer/customerInfo'),
        name: '顾客信息',
        meta: { menus: ['user:customerInfo'] }
      },
      {
        path: 'feedbackInfo',
        component: _import('customer/feedbackInfo'),
        name: '反馈信息',
        meta: { menus: ['user:feedbackInfo'] }
      },
      {
        path: 'customerAddress',
        component: _import('customer/customerAddress'),
        name: '用户地址',
        meta: { menus: ['user:customerAddress'] }
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    name: '活动营销',
    icon: 'wujiaoxing',
    meta: { menus: ['market:redpack', 'market:voucher', 'market:payCheck', 'market:halfPrice', 'market:discount', 'market:promotion', 'market:imageTemplate', 'market:comboProduct'] },
    children: [
      { path: 'redpack', component: _import('market/redpack'), name: '红包', meta: { menus: ['market:redpack'] } },
      { path: 'imageTemplate', component: _import('market/imageTemplate'), name: '轮播图配置', meta: { menus: ['market:imageTemplate'] } },
      { path: 'voucher', component: _import('market/voucher'), name: '兑换券管理', meta: { menus: ['market:voucher'] } },
      { path: 'payCheck', component: _import('market/payCheck'), name: '充值配置信息', meta: { menus: ['market:payCheck'] } },
      { path: 'discount', component: _import('market/discount'), name: '折扣活动管理', meta: { menus: ['market:discount'] } },
      { path: 'promotion', component: _import('market/promotion'), name: '满减活动管理', meta: { menus: ['market:promotion'] } },
      { path: 'halfPrice', component: _import('market/halfPrice'), name: '半价活动管理', meta: { menus: ['market:halfPrice'] } },
      { path: 'comboProduct', component: _import('market/comboProduct'), name: '套餐活动管理', meta: { menus: ['market:comboProduct'] } }
    ]
  },
  {
    path: '/recordMachine',
    component: Layout,
    name: '数据统计',
    icon: 'tubiaoleixingzhengchang',
    meta: { menus: ['record:machine', 'record:product', 'record:order', 'record:label'] },
    children: [
      {
        path: 'recordMachine',
        component: _import('record/recordMachine'),
        name: '设备数据统计',
        meta: { menus: ['record:machine'] }
      },
      {
        path: 'recordProduct',
        component: _import('record/recordProduct'),
        name: '商品数据统计',
        meta: { menus: ['record:product'] }
      },
      {
        path: 'recordOrder',
        component: _import('record/recordOrder'),
        name: '订单明细统计',
        meta: { menus: ['record:order'] }
      },
      {
        path: 'recordLabel',
        component: _import('record/recordLabel'),
        name: '商品标签统计',
        meta: { menus: ['record:label'] }
      }
    ]
  },
  {
    path: '/fileCenter',
    component: Layout,
    name: '文档中心',
    icon: 'wenjianzhongxin',
    meta: {
      menus:['fileCenter:info'],
    },
    children: [
      {
        path: 'fileList',
        component: _import('fileCenter/fileList'),
        name: '文档信息',
        meta: { menus: ['franchisees:info'] }
      }
    ],
  },
  {
    path: '/franchisees',
    component: Layout,
    name: '加盟商管理',
    icon: 'mobankuangjia',
    meta: { menus: ['franchisees:info', 'franchisees:details'] },
    children: [
      {
        path: 'info',
        component: _import('franchisees/info'),
        name: '加盟商信息',
        meta: { menus: ['franchisees:info'] }
      },
      {
        path: 'details',
        component: _import('franchisees/details'),
        name: '加盟商流水',
        meta: { menus: ['franchisees:details'] }
      }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    name: '数据图表',
    icon: 'b',
    meta: { menus: ['charts:sale', 'charts:timeChart'] },
    children: [
      { path: 'sale', component: _import('charts/sale'), name: '销售报表', meta: { menus: ['charts:sale'] } },
      { path: 'timeChart', component: _import('charts/timeChart'), name: '时段报表', meta: { menus: ['charts:timeChart'] } }
      /* { path: 'index', component: _import('charts/index'), name: '介绍' },
      { path: 'keyboard', component: _import('charts/keyboard'), name: '键盘图表' },
      { path: 'keyboard2', component: _import('charts/keyboard2'), name: '键盘图表2' },
      { path: 'line', component: _import('charts/line'), name: '折线图' },
      { path: 'mixchart', component: _import('charts/mixChart'), name: '混合图表' } */
    ]
  },
  // {
  //   path: '/stockApi',
  //   component: Layout,
  //   name: '盘库移动端',
  //   icon: 'b',
  //   meta: { menus: ['stockApi:login', 'stockApi:machine'] },
  //   children: [
  //     { path: 'sale', component: './components/stockCountLogin', name: '登陆', meta: { menus: ['stockApi:login'] } },
  //     { path: 'timeChart', component: './components/stockCountMachine', name: '设备列表', meta: { menus: ['stockApi:machine'] } }
  //     /* { path: 'index', component: _import('charts/index'), name: '介绍' },
  //     { path: 'keyboard', component: _import('charts/keyboard'), name: '键盘图表' },
  //     { path: 'keyboard2', component: _import('charts/keyboard2'), name: '键盘图表2' },
  //     { path: 'line', component: _import('charts/line'), name: '折线图' },
  //     { path: 'mixchart', component: _import('charts/mixChart'), name: '混合图表' } */
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }

];
