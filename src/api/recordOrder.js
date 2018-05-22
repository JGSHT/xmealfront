import fetch from 'utils/fetch';
export function fetchRecordOrderList(data, page, size) {
  var beginDate, endDate, machineName,mobile,officeId,regionId,companyId,productName,categoryId,barCode;

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

  if(data.productName ===''){
    productName = null;
  }else{
    productName = data.productName;
  }

  if(data.categoryId ===''){
    categoryId = null;
  }else{
    categoryId = data.categoryId;
  }

  if(data.barCode ===''){
    barCode = null;
  }else{
    barCode = data.barCode;
  }

  if(data.mobile === ''){
    mobile = null;
  }else{
    mobile = data.mobile;
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

  return fetch({
    url: '/api/private/recordRest/findOrderInCome', // 设备金额
    method: 'POST',
    data: {
      'request': {
        'beginTime':beginDate,
        'endTime':endDate,
        'machineName':machineName,
        'mobile':mobile,
        'officeId':officeId,
        'regionId':regionId,
        'companyId':companyId,
        'productName':productName,
        'categoryId':categoryId,
        'barCode':barCode
      },
      'page': page,
      'size': size
    }
  });
}

//根据条件导出
export function fetchRecordOrder(data) {
  var beginDate, endDate, machineName,mobile,officeId,regionId,companyId,productName,categoryId,barCode;
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

  if(data.mobile === ''){
    mobile = null;
  }else{
    mobile = data.mobile;
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

  if(data.productName ===''){
    productName = null;
  }else{
    productName = data.productName;
  }

  if(data.categoryId ===''){
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
    url: '/api/private/recordRest/exportOrderInCome',
    method: 'POST',
    data: {
      'request': {
        'beginTime': beginDate,
        'endTime': endDate,
        'machineName': machineName,
        'mobile': mobile,
        'officeId': officeId,
        'regionId': regionId,
        'companyId': companyId,
        'productName':productName,
        'categoryId':categoryId,
        'barCode':barCode
      }
    },
  });
}

export function dealDate(beginDate, endDate){
  var day = GetDateDiff(beginDate, endDate)
  if(day>32){
    return false;
  }else{
    return true;
  }
}

//处理时间
export function dealDateTime(date) {
  if(date == null || date == undefined || date == "") {
    return null;
  } else {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }
}

function GetDateDiff(startDate,endDate)
{
  var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
  var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
  var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
  return  dates;
}
