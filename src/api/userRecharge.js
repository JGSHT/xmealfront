import fetch from 'utils/fetch';

export function fetchUserRechargeList(data, page, size) {
  var beginDate, endDate, machineName,mobile;
  if(data.dateTime === ''){
    beginDate = null;
    endDate = null;
  }else{
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }
  //console.log("beginDate======"+beginDate)
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
  return fetch({
    url: '/api/private/userRecharge/list', // 保存设备信息
    method: 'POST',
    data: {
      'request': {
        'beginDate':beginDate,
        'endDate':endDate,
        'machineName':machineName,
        'mobile':mobile
      },
      'page': page,
      'size': size
    }
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
