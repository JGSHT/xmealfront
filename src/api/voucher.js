import fetch from '../utils/fetch';
import { dealDateTime } from './discount';

// 获取兑换券列表
export function fetchVoucher(data, page, size) {
  return fetch({
    url: '/api/private/voucher/list',
    method: 'POST',
    data: {
      request: {
        companyId: data.companyId,
        regionId: data.regionId,
        officeId: data.officeId
      },
      page,
      size
    }
  })
}

// 生成兑换券
export function fetchCreatedVoucher(data) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: 'api/private/voucher/create',
    method: 'POST',
    data: {
      request: {
        officeId: data.officeForCreated,
        money: data.money,
        count: data.count,
        beginDate: data.beginDate,
        endDate: data.endDate
      }
    }
  })
}

// 获取详情
export function getDetailVoucher(beginDate, endDate, searchType, officeId) {
  return fetch({
    url: 'api/private/voucher/detail',
    method: 'POST',
    data: {
      request: {
        beginDate,
        endDate,
        searchType,
        officeId
      }
    }
  });
}

// 根据条件导出
export function fetchExcel(data, searchType) {
  if (searchType === '' || searchType === undefined) {
    searchType = 0;
  }
  return fetch({
    url: '/api/private/voucher/exportExcelTwo',
    method: 'POST',
    data: {
      request: {
        searchType,
        beginDate: data.beginDate,
        endDate: data.endDate,
        officeId: data.officeId
      }
    }
  });
}

