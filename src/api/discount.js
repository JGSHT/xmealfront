import fetch from '../utils/fetch';

// 处理时间
export function dealDateTime(date) {
  if (date == null || date == undefined || date == '') {
    return null;
  } else {
    let month = date.getMonth() + 1;
    if ((date.getMonth() + 1) < 10) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours;
    }
    let min = date.getMinutes();
    if (min < 10) {
      min = '0' + min;
    }
    let sec = date.getMinutes();
    if (sec < 10) {
      sec = '0' + sec;
    }
    return date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;
  }
}

export function fetchMachineTree() {
  return fetch({
    url: '/api/private/machine/machineTree',
    method: 'GET'
  });
}

export function createdDiscount(data) {
  return fetch({
    url: '/api/private/discount/save',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function updateDiscount(data) {
  return fetch({
    url: '/api/private/discount/update',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function getDiscountList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/discount/list',
    method: 'POST',
    data: {
      request: {
        companyId: data.companyId,
        officeId: data.officeId,
        regionId: data.regionId,
        saleName: data.discountName,
        discountOver: data.discountOver,
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
    url: '/api/private/discount/detail',
    method: 'POST',
    data: {
      request: id
    }
  });
}

export function updateDiscountStatus(discountOver, id) {
  return fetch({
    url: '/api/private/discount/updateStatus',
    method: 'POST',
    data: {
      request: {
        id,
        discountOver
      }
    }
  });
}

// 获取选中设备上的商品
export function getProductsByMachineList(machineList) {
  return fetch({
    url: '/api/private/discount/products',
    method: 'POST',
    data: {
      request: { machineList }
    }
  })
}
