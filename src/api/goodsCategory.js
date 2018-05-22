import fetch from 'utils/fetch';

export function fetchGoodsCategoryTree() {
  return fetch({
    url: '/api/private/goodsCategory/tree',
    method: 'GET'
  });
}

export function fetchGoodsCategorySave(data) {
  return fetch({
    url: '/api/private/goodsCategory',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function fetchGoodsCategoryNode(id) {
  return fetch({
    url: '/api/private/goodsCategory/' + id,
    method: 'GET'
  });
}

export function fetchGoodsCategoryDelete(data) {
  return fetch({
    url: '/api/private/goodsCategory',
    method: 'DELETE',
    data: {
      'request': data
    }
  });
}
