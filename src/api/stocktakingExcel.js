import fetch from 'utils/fetch';
import { dealDateTime } from './discount';


export function fetchStocktakingExcelList(data, page, size){
  var beginDate, endDate, userName;
  if (data.dateTime === '') {
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
    url: '/api/private/stocktakingExcel/list', // 获取导入盘库记录
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

export function fetchInitStockProduct(stockInfoId,uuid) {
  return fetch({
    url: '/api/private/stocktakingExcel/initStockProduct',//初始化库存商品
    method: 'PUT',
    data: {
      request: {
        stockInfoId,
        uuid
      }
    }
  });
}

export function fetchStocktakingExcelDetailList(data, page, size){
  return fetch({
    url: '/api/private/stocktakingExcel/detail', // 获取导入盘库详细信息
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}
