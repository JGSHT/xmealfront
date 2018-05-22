import fetch from 'utils/fetch';

export function fetchSaveImageTemplate(data) {
  return fetch({
    url: '/api/private/imageTemplate', // 保存充值配置信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}


export function fetchImageTemplateList(data, page, size){
  return fetch({
    url: '/api/private/imageTemplate/list', // 获取充值配置信息
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchDeleteImageTemplate(id){
  return fetch({
    url: '/api/private/imageTemplate/'+id, // 删除充值配置信息
    method: 'DELETE'
  });
}


export function fetchUpdateImageTemplate(id){
  return fetch({
    url: '/api/private/imageTemplate/'+id, // 修改充值配置信息
    method: 'GET'
  });
}
