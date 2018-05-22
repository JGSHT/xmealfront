import fetch from '../utils/fetch';
import { dealDateTime } from './discount';

// 套餐商品
export function fetchProductForTransfer() {
  return fetch({
    url: '/api/private/product/transfer',
    method: 'GET'
  });
}

export function fetchSaveProduct(data) {
  return fetch({
    url: '/api/private/comboProduct/save',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchProductList(data, page, size) {
  return fetch({
    url: '/api/private/comboProduct/productList',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchProductDetail(pId) {
  return fetch({
    url: '/api/private/comboProduct/detail',
    method: 'POST',
    data: {
      request: pId
    }
  });
}

export function deleteComboProduct(data) {
  return fetch({
    url: '/api/private/comboProduct/delete',
    method: 'DELETE',
    data: {
      request: data
    }
  })
}

// 新建套餐活动
export function fetchComboProduct() {
  return fetch({
    url: '/api/private/comboProduct/comboProductForSelect',
    method: 'GET'
  });
}

export function saveComboActivity(data) {
  return fetch({
    url: '/api/private/comboProduct/comboActivity',
    method: 'POST',
    data: {
      request: data
    }
  })
}

// 查询套餐活动
export function fetchComboList(data, size, page) {
  data.beginDate = null;
  data.endDate = null;
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  }
  return fetch({
    url: '/api/private/comboProduct/comboList',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  })
}

export function fetchComboProductDetail(id) {
  return fetch({
    url: '/api/private/comboProduct/comboProductDetail',
    method: 'POST',
    data: {
      request: { id }
    }
  });
}

export function updateComboStatus(status, id) {
  return fetch({
    url: '/api/private/comboProduct/updateComboStatus',
    method: 'POST',
    data: {
      request: {
        id,
        status
      }
    }
  });
}
