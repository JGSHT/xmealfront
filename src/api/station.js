import fetch from 'utils/fetch';

export function fetchStationList(data, page, size) {
  return fetch({
    url: '/api/private/station/list',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}
export function fetchStations() {
  return fetch({
    url: '/api/private/station/stations',
    method: 'GET'
  });
}

export function fetchSaveStation(data) {
  return fetch({
    url: '/api/private/station/save', // 保存站点
    method: 'POST',
    data: {
      'request': data
    }
  });
}




export function fetchDeleteStation(id){
  return fetch({
    url: '/api/private/station/delete/'+id, // 删除站点
    method: 'DELETE'
  });
}


export function fetchUpdateStation(id){
  return fetch({
    url: '/api/private/station/'+id, // 修改站点信息
    method: 'GET'
  });
}
