import fetch from "../utils/fetch";

export function fetchStockCountList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1])
  }else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/stockCount',
    method: 'POST',
    data: {
      'request': {
        'machineId': data.machineId,
        'companyId': data.companyId,
        'isMachine': data.isMachine,
        'isCompany':data.isCompany,
        'beginDate':data.beginDate,
        'endDate':data.endDate
      },
      'page': page,
      'size': size
    }
  });
}

export function fetchStockCountProductList(data,stockCountProductForm,page, size) {
  return fetch({
    url: '/api/private/stockCount/stockCountProduct',
    method: 'POST',
    data: {
      'request': {
        'id':data.id,
        'machine':data.machine,
        'productName':stockCountProductForm.productName,
      },
      'page': page,
      'size': size
    }
  });
}
export function fetchMachineList(date) {
  return fetch({
    url: '/api/private/stockCount/getMachineList',
    method: 'POST',
    data: {
      'request':{
        'companyId':date.companyId
      }
    }
  });
}
export function fetchCompanyList(date) {
  return fetch({
    url: '/api/private/stockCount/getCompanyList',
    method: 'POST',
    data: {
    }
  });
}



//处理时间
export function dealDateTime(date) {
  if (date == null || date == undefined || date == "") {
    return null;
  } else {
    var month = (date.getMonth() + 1);
    if((date.getMonth() + 1) < 10) {
      month = '0' + month;
    }
    var day = date.getDate();
    if(day < 10) {
      day = '0' + day;
    }
    var hours = date.getHours();
    if(hours < 10) {
      hours = '0' + hours;
    }
    var min = date.getMinutes();
    if(min < 10) {
      min = '0' + min;
    }
    var sec = date.getMinutes();
    if(sec < 10) {
      sec = '0' + sec;
    }
    return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + min + ":" + sec;
  }
}
