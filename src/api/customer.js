import fetch from 'utils/fetch';

export function fetchCustomerList(data, page, size) {
  var beginDate, endDate;
  if (data.dateTime === '') {
    beginDate = null;
    endDate = null;
  } else {
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }
  return fetch({
    url: '/api/private/userInfo/list',
    method: 'POST',
    data: {
      'request': {
        'mobile': data.mobile,
        'beginDate': beginDate,
        'endDate': endDate,
        'machineId': data.machineId
      },
      'page': page,
      'size': size
    }
  });
}

export function fetchCustomerOrders(id, page, size) {
  return fetch({
    url: '/api/private/userInfo/uoList',
    method: 'GET',
    data: {
      'request': {
        'id':id
      },
      'page': page,
      'size': size
    }
  });
}

export function fetchExportCustomerInfo(data) {
  return fetch({
    url: '/api/private/userInfo/exportExcelCustomerInfo',
    method: 'POST',
    data : {
      'request': data
    }
  });
}
//处理时间
function dealDateTime(date) {
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
