import { dealDateTime } from './discount';
import fetch from '../utils/fetch';


/* 通用 */
function getFirstDayOfWeek(date) {
  if (date == null || date === undefined || date === '') {
    return null;
  } else {
    if (new Date('2017/08/02 00:00:00').getTime() > new Date(date).getTime()) {
      return '2017-08-03 00:00:00'
    }
    let month = date.getMonth() + 1;
    if ((date.getMonth() + 1) < 10) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return date.getFullYear() + '-' + month + '-' + day;
  }
}

export function getMachineListForSelect(cId, rId, oId) {
  return fetch({
    url: '/api/private/machine/machineForSelect',
    method: 'POST',
    data: {
      request: {
        officeId: oId,
        regionId: rId,
        companyId: cId
      }
    }
  })
}

/* 销售金额报表 */
export function fetchSaleData(data) {
  if (data.dateTime === null) {
    data.beginDate = null;
    data.endDate = null;
  } else {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  }
  return fetch({
    url: '/api/private/statistics/money',
    method: 'POST',
    data: {
      request: data
    }
  })
}

/* 成交笔数 */
export function fetchSaleCountData(data) {
  if (data.dateTime === null) {
    data.beginDate = null;
    data.endDate = null;
  } else {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  }
  return fetch({
    url: '/api/private/statistics/count',
    method: 'POST',
    data: {
      request: data
    }
  })
}

/* 人数 */
export function fetchPersonCountData(data) {
  if (data.dateTime === null) {
    data.beginDate = null;
    data.endDate = null;
  } else {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  }
  return fetch({
    url: '/api/private/statistics/person',
    method: 'POST',
    data: {
      request: data
    }
  })
}

/* 充值 */
export function fetchRechargeCountData(data) {
  if (data.dateTime === null) {
    data.beginDate = null;
    data.endDate = null;
  } else {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  }
  return fetch({
    url: '/api/private/statistics/recharge',
    method: 'POST',
    data: {
      request: data
    }
  })
}

/* 日销售报表 */
export function fetchTimeSaleData(data) {
  data.firstDate = getFirstDayOfWeek(data.dateTime);
  return fetch({
    url: '/api/private/statistics/timeSale',
    method: 'POST',
    data: {
      request: data
    }
  })
}

/* 交易笔数 */
export function fetchTimeCountData(data) {
  data.firstDate = getFirstDayOfWeek(data.dateTime);
  return fetch({
    url: '/api/private/statistics/timeCount',
    method: 'POST',
    data: {
      request: data
    }
  })
}

/* 笔单价 */
export function fetchPerBalanceCount(data) {
  data.firstDate = getFirstDayOfWeek(data.dateTime);
  return fetch({
    url: '/api/private/statistics/perBalance',
    method: 'POST',
    data: {
      request: data
    }
  })
}
