import fetch from 'utils/fetch';

export function fetchRedpackList(data, page, size) {
  return fetch({
    url: '/api/private/redPacket/list',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchRedpackSave(data) {
  return fetch({
    url: '/api/private/redPacket',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function fetchRedpackNode(id) {
  return fetch({
    url: '/api/private/redPacket/' + id,
    method: 'GET'
  });
}

export function fetchRedpackDelete(id) {
  return fetch({
    url: '/api/private/redPacket/' + id,
    method: 'DELETE'
  });
}

export function updateProbability(data) {
  return fetch({
    url: '/api/private/redPacket/probability',
    method: 'PUT',
    data: {
      'request': data
    }
  });
}

export function fetchRedpackDetailList(data, page, size) {
  var beginDate, endDate, userName,userMobile;
  if(data.dateTime === ''){
    beginDate = null;
    endDate = null;
  }else{
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }

  if(data.userName === ''){
    userName = null;
  }else{
    userName = data.userName;
  }

  if(data.userMobile === ''){
    userMobile = null;
  }else{
    userMobile = data.userMobile;
  }
  return fetch({
    url: '/api/private/redPacketDetail/list',
    method: 'POST',
    data: {
      'request': {
        'beginDate':beginDate,
        'endDate':endDate,
        'userName':userName,
        'userMobile':userMobile
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

