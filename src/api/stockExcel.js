import fetch from 'utils/fetch';
import { dealDateTime } from './discount';

export function fetchSaveStockInfo(data) {
  return fetch({
    url: '/api/private/importStockExcel', // 保存仓库信息
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchStockExcelList(data, page, size){
  let beginDate, endDate, userName;
  if (data.dateTime) {
    beginDate = null;
    endDate = null;
  } else {
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }

  if (data.userName === '') {
    userName = null;
  } else {
    userName = data.userName;
  }
  return fetch({
    url: '/api/private/stockExcel/list', // 获取导入商品信息
    method: 'POST',
    data: {
      request: {
        userName,
        beginDate,
        endDate
      },
      page,
      size
    }
  });
}

export function fetchStockExcelDetailList(data, page, size){
  return fetch({
    url: '/api/private/stockExcel/detail', // 获取导入商品详细信息
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchUpdateStockProduct(stockInfoId, uuid) {
  return fetch({
    url: '/api/private/stockExcel/updateStockProduct',
    method: 'PUT',
    data: {
      request: {
        stockInfoId,
        uuid
      }
    }
  });
}

export function fetchDownloadStockProduct(stockInfoId) {
  return fetch({
    url: '/api/private/stockExcel/exportStockProduct',
    method: 'POST',
    data: {
      request: {
        stockInfoId
      }
    }
  });
}
