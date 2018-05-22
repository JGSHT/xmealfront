import fetch from "../utils/fetch";
import {dealDateTime} from "./discount";

export function fetchMachineTree() {
  return fetch({
    url: '/api/private/machine/machineTree',
    method: 'GET'
  });
}

export function createdHalfPrice(data) {
  return fetch({
    url: '/api/private/halfPrice/save',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function updateHalfPrice(data) {
  return fetch({
    url: '/api/private/halfPrice/update',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function getHalfPriceList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/halfPrice/list',
    method: 'POST',
    data: {
      'request': {
        'companyId': data.companyId,
        'officeId': data.officeId,
        'regionId': data.regionId,
        'saleName': data.saleName,
        'halfPriceOver': data.halfPriceOver,
        'beginDate': data.beginDate,
        'endDate': data.endDate
      },
      'page': page,
      'size': size
    }
  });
}

export function getDetail(id) {
  return fetch({
    url: '/api/private/halfPrice/detail',
    method: 'POST',
    data: {
      'request': id
    }
  });
}

export function updateHalfPriceStatus(discountOver, id) {
  return fetch({
    url: '/api/private/halfPrice/updateStatus',
    method: 'POST',
    data: {
      'request': {
        'id': id,
        'halfPriceOver': discountOver,
      }
    }
  });
}
