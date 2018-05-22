import fetch from 'utils/fetch';
import { dealDateTime } from './discount';

export function fetchSaveStockInfo(data) {
  return fetch({
    url: '/api/private/stockInfo', // 保存仓库信息
    method: 'POST',
    data: {
      request: data
    }
  });
}


export function fetchStockInfoList(data, page, size) {
  return fetch({
    url: '/api/private/stockInfo/list', // 获取仓库信息
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchDeleteStockInfo(id) {
  return fetch({
    url: '/api/private/stockInfo/' + id, // 删除仓库信息
    method: 'DELETE'
  });
}


export function fetchUpdateStockInfo(id) {
  return fetch({
    url: '/api/private/stockInfo/' + id, // 修改仓库信息
    method: 'GET'
  });
}

export function addProduct(data) {
  return fetch({
    url: '/api/private/stockInfo/addProduct',
    method: 'POST',
    data: {
      request: data
    }
  });
}


export function fetchStockProduct(data, page, size) {
  return fetch({
    url: '/api/private/stockInfo/product', // 获取仓库商品信息
    method: 'POST',
    data: {
      request: {
        stockInfoId: data.id
      },
      page,
      size
    }
  });
}


export function fetchSaveStock(data) {
  return fetch({
    url: '/api/private/stockInfo/updateStock', // 获取仓库商品信息
    method: 'PUT',
    data: {
      request: {
        id: data.id,
        stock: data.stock
      }
    }
  });
}


export function offProduct(ids) {
  return fetch({
    url: '/api/private/stockInfo/offProduct',
    method: 'DELETE',
    data: {
      request: ids
    }
  });
}

export function fetchExportExcel(ids) {
  return fetch({
    url: '/api/private/stockInfo/exportExcelStockProduct',
    method: 'POST',
    data: {
      request: ids
    }
  });
}

export function fetchProductList(stockInfoId) {
  return fetch({
    url: '/api/private/stockInfo/getProducts/' + stockInfoId,
    method: 'GET'
  });
}

export function fetchExportOutStock(companyId, dateTime) {
  let beginDate = null, endDate = null;
  if (dateTime !== null && dateTime !== undefined && dateTime !== '' && dateTime.length === 2) {
    beginDate = dealDateTime(dateTime[0]);
    endDate = dealDateTime(dateTime[1])
  }
  return fetch({
    url: '/api/private/stockInfo/exportOutStockProduct',
    method: 'POST',
    data: {
      request: {
        companyId,
        beginDate,
        endDate
      }
    }
  });
}

export function fetchExportInAndOutStock(companyId, dateTime) {
  let beginDate = null, endDate = null;
  if (dateTime !== null && dateTime !== undefined && dateTime !== '' && dateTime.length === 2) {
    beginDate = dealDateTime(dateTime[0]);
    endDate = dealDateTime(dateTime[1])
  }
  return fetch({
    url: '/api/private/stockInfo/exportInAndOutStockProduct',
    method: 'POST',
    data: {
      request: {
        companyId,
        beginDate,
        endDate
      }
    }
  });
}
