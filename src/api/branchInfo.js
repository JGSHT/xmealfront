import fetch from 'utils/fetch';

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

export function fetchSaveBranch(data) {
  return fetch({
    url: '/api/private/branchInfo', // 保存网点信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function fetchUpdateBranch(data) {
  return fetch({
    url: '/api/private/branchInfo/getBranch', // 获取网点信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function fetchBranchList(data, page, size) {
  if (data.dataTime) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/branchInfo/list', // 获取网点信息列表列表
    method: 'POST',
    data: {
      'request': {
        'companyName': data.companyName,
        'userName': data.userName,
        'beginDate':data.beginDate,
        'endDate':data.endDate,
        'status': data.status
      },
      'page': page,
      'size': size
    }
  });
}

export function fetchUadate(data) {
  return fetch({
    url: '/api/private/branchInfo/update', // 驳回处理
    method: 'POST',
    data: {
      'request': data
    }
  });
}

