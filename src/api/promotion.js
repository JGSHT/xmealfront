import fetch from '../utils/fetch';
import { dealDateTime } from './discount';

export function fetchMachineTree() {
  return fetch({
    url: '/api/private/machine/machineTree',
    method: 'GET'
  });
}

export function createdPromotion(data) {
  return fetch({
    url: '/api/private/promotion/save',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function updatePromotion(data) {
  return fetch({
    url: '/api/private/promotion/update',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function getPromotionList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/promotion/list',
    method: 'POST',
    data: {
      request: {
        companyId: data.companyId,
        officeId: data.officeId,
        regionId: data.regionId,
        saleName: data.saleName,
        promotionOver: data.promotionOver,
        beginDate: data.beginDate,
        endDate: data.endDate
      },
      page,
      size
    }
  });
}

export function getDetail(id) {
  return fetch({
    url: '/api/private/promotion/detail',
    method: 'POST',
    data: {
      request: id
    }
  });
}

export function updatePromotionStatus(discountOver, id) {
  return fetch({
    url: '/api/private/promotion/updateStatus',
    method: 'POST',
    data: {
      request: {
        id,
        promotionOver: discountOver
      }
    }
  });
}
