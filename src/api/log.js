import fetch from "../utils/fetch";

export function fetchLogList(data, page, size) {
  if (data.dateTime) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1])
  }
  return fetch({
    url: '/api/private/log',
    method: 'POST',
    data: {
      'request': {
        'userName': data.userName,
        'title':data.title,
        'method':data.method,
        'beginDate':data.beginDate,
        'endDate':data.endDate
      },
      'page': page,
      'size': size
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
