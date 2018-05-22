import fetch from 'utils/fetch';

export function fetchRecordProductList(data, page, size) {
  var beginDate, endDate, machineName, productName, categoryId,officeId,regionId,companyId,barCode;

  if(data.dateTime === ''){
    beginDate = null;
    endDate = null;
  }else{
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }

  if(data.machineName === ''){
    machineName = null;
  }else{
    machineName = data.machineName
  }

  if(data.productName === ''){
    productName = null;
  }else{
    productName = data.productName
  }

  if(data.officeId === ''){
    officeId = null;
  }else{
    officeId = data.officeId;
  }

  if(data.regionId === ''){
    regionId = null;
  }else{
    regionId = data.regionId;
  }

  if(data.companyId === ''){
    companyId = null;
  }else{
    companyId = data.companyId;
  }

  if(data.categoryId === ''){
    categoryId = null;
  }else{
    categoryId = data.categoryId;
  }

  if(data.barCode ===''){
    barCode = null;
  }else{
    barCode = data.barCode;
  }

  return fetch({
    url: '/api/private/recordRest/list_product', // 商品信息
    method: 'POST',
    data: {
      'request': {
        'beginTime':beginDate,
        'endTime':endDate,
        'machineName':machineName,
        'productName':productName,
        'categoryId':categoryId,
        'officeId':officeId,
        'regionId':regionId,
        'companyId':companyId,
        'barCode':barCode
      },
      'page': page,
      'size': size
    }
  });
}

export function fetchProductList(data,page,size){
  var beginDate, endDate, machineName, productName, categoryId,officeId,regionId,companyId,barCode,pid;
  if(data.dateTime === ''){
    beginDate = null;
    endDate = null;
  }else{
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }

  if(data.machineName === ''){
    machineName = null;
  }else{
    machineName = data.machineName
  }

  if(data.productName === ''){
    productName = null;
  }else{
    productName = data.productName
  }

  if(data.officeId === ''){
    officeId = null;
  }else{
    officeId = data.officeId;
  }

  if(data.regionId === ''){
    regionId = null;
  }else{
    regionId = data.regionId;
  }

  if(data.companyId === ''){
    companyId = null;
  }else{
    companyId = data.companyId;
  }

  if(data.categoryId === ''){
    categoryId = null;
  }else{
    categoryId = data.categoryId;
  }

  if(data.barCode ===''){
    barCode = null;
  }else{
    barCode = data.barCode;
  }
  if(data.pid ===''){
    pid = null;
  }else{
    pid = data.pid;
  }

  return fetch({
    url: '/api/private/recordRest/list_product_detail',
    method: 'POST',
    data: {
      'request': {
        'pid': pid,
        'beginTime':beginDate,
        'endTime':endDate,
        'machineName':machineName,
        'productName':productName,
        'categoryId':categoryId,
        'officeId':officeId,
        'regionId':regionId,
        'companyId':companyId,
        'barCode':barCode
      },
      'page': page,
      'size': size
    }
  });
}

//根据条件导出
export function fetchRecordProduct(data) {
  var beginDate, endDate, productName,machineId,categoryId,officeId,regionId,companyId,barCode;

  if(data.dateTime === ''){
    beginDate = null;
    endDate = null;
  }else{
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }
  if(data.productName === ''){
    productName = null;
  }else{
    productName = data.productName
  }

  if(data.machineId === ''){
    machineId = null;
  }else{
    machineId = data.machineId
  }

  if(data.officeId === ''){
    officeId = null;
  }else{
    officeId = data.officeId;
  }

  if(data.regionId === ''){
    regionId = null;
  }else{
    regionId = data.regionId;
  }

  if(data.companyId === ''){
    companyId = null;
  }else{
    companyId = data.companyId;
  }

  if(data.categoryId === ''){
    categoryId = null;
  }else{
    categoryId = data.categoryId;
  }

  if(data.barCode ===''){
    barCode = null;
  }else{
    barCode = data.barCode;
  }
  return fetch({
    url: '/api/private/recordRest/exportExcelProductInCome',
    method: 'POST',
    data: {
      'request': {
        'beginTime': beginDate,
        'endTime': endDate,
        'productName': productName,
        'categoryId': categoryId,
        'machineId':machineId,
        'productName':productName,
        'categoryId':categoryId,
        'officeId':officeId,
        'regionId':regionId,
        'companyId':companyId,
        'barCode':barCode
      }
    },
  });
}

//处理时间
function dealDateTime(date) {
  if(date == null || date == undefined || date == "") {
    return null;
  } else {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }
}
