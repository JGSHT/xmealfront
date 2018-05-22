import fetch from 'utils/fetch';

export function fetchBrandLabelList(data, page, size) {
  return fetch({
    url: '/api/private/brandLabel/list', // 获取商品标签列表
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchSaveBrandLabel(data) {
  return fetch({
    url: '/api/private/brandLabel/save', // 保存商品标签
    method: 'POST',
    data: {
      'request': data
    }
  });
}




export function fetchDeleteBrandLabel(id) {
  return fetch({
    url: '/api/private/brandLabel/delete/' + id, // 删除商品标签
    method: 'DELETE'
  });
}


export function fetchUpdateBrandLabel(id) {
  return fetch({
    url: '/api/private/brandLabel/' + id, // 获取商品标签
    method: 'GET'
  });
}
