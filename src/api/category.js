import fetch from 'utils/fetch';

export function fetchCategoryList(data, page, size) {
  return fetch({
    url: '/api/private/category/list',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchSaveCategory(data) {
  return fetch({
    url: '/api/private/category/save', // 保存充值配置信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}




export function fetchDeleteCategory(id){
  return fetch({
    url: '/api/private/category/delete/'+id, // 删除充值配置信息
    method: 'DELETE'
  });
}


export function fetchUpdateCategory(id){
  return fetch({
    url: '/api/private/category/'+id, // 修改充值配置信息
    method: 'GET'
  });
}
