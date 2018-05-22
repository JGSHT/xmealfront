import fetch from '../utils/fetch';
import { dealDateTime } from './discount';

export function fetchRefundList(data, page, size) {
  let status = null;
  if (data.status == true) {
    status = 2;
  } else {
    status = 1;
  }
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/refund/list',
    method: 'POST',
    data: {
      request: {
        beginDate: data.beginDate,
        endDate: data.endDate,
        reason: data.reason,
        mobile: data.mobile,
        orderId: data.primaryOrderId,
        status,
        officeId: data.officeId,
        companyId: data.companyId,
        regionId: data.regionId
      },
      page,
      size
    }
  });
}

export function getExcel(data) {
  let status = null;
  if (data.status == true) {
    status = 2;
  } else {
    status = 1;
  }
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/refund/export',
    method: 'POST',
    data: {
      request: {
        beginDate: data.beginDate,
        endDate: data.endDate,
        reason: data.reason,
        mobile: data.mobile,
        orderId: data.primaryOrderId,
        status,
        officeId: data.officeId,
        companyId: data.companyId,
        regionId: data.regionId
      }
    }
  });
}
