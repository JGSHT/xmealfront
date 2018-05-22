import fetch from 'utils/fetch';

export function fetchSavePayCheck(data) {
  return fetch({
    url: '/api/private/payCheck', // 保存充值配置信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}


export function fetchPayCheckList(data, page, size){
  return fetch({
    url: '/api/private/payCheck/list', // 获取充值配置信息
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchDeletePayCheck(id){
  return fetch({
    url: '/api/private/payCheck/'+id, // 删除充值配置信息
    method: 'DELETE'
  });
}


export function fetchUpdatePayCheck(id){
  return fetch({
    url: '/api/private/payCheck/'+id, // 修改充值配置信息
    method: 'GET'
  });
}
