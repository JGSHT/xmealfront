// 查询订单
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

// 获取订单列表
export function fetchOrderList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/order/list',
    method: 'POST',
    data: {
      request: {
        officeId: data.officeId,
        orderId: data.orderId,
        regionId: data.regionId,
        companyId: data.companyId,
        productName: data.productNameForSearch,
        machineName: data.machineName,
        mobile: data.mobile,
        beginDate: data.beginDate,
        endDate: data.endDate,
        status: data.status,
        orderChannel: 0
      },
      page,
      size
    }
  });
}

// 获取订单详情
export function fetchOrderDetailList(orderId) {
  return fetch({
    url: '/api/private/order/detail',
    method: 'POST',
    data: {
      request: orderId
    }
  });
}

// 导出excel
export function getExcel(data) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/order/excel',
    method: 'POST',
    data: {
      request: data
    }
  });
}

// 获取订单列表
export function fetchUpdateByTotalPrice(data) {
  return fetch({
    url: '/api/private/order',
    method: 'PUT',
    data: {
      request: {
        orderId: data.id,
        totalPrice: data.totalPrice
      }
    }
  });
}

// 获取订单列表
export function fetchSaveRepairOrder(data) {
  return fetch({
    url: '/api/private/order/insertOrderHeadAndOrderDetail',
    method: 'POST',
    data: {
      request: {
        id: data.id,
        count: data.count
      }
    }
  });
}

// 预定
export function fetchReserveList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/order/reserve',
    method: 'POST',
    data: {
      request: {
        officeId: data.officeId,
        orderId: data.orderId,
        regionId: data.regionId,
        companyId: data.companyId,
        productName: data.productNameForSearch,
        machineName: data.machineName,
        phoneNumber: data.mobile,
        beginDate: data.beginDate,
        endDate: data.endDate,
        status: data.status,
        orderChannel: '1',
        address: data.address,
        delivered: data.delivered,
        consignee: data.consignee,
        courierNumber: data.courierNumber
      },
      page,
      size
    }
  })
}

export function fetchSaveChange(data) {
  return fetch({
    url: '/api/private/order/save',
    method: 'POST',
    data: {
      request: data
    }
  })
}

export function fetchSureSend(id) {
  return fetch({
    url: '/api/private/order/sureSend',
    method: 'POST',
    data: {
      request: id
    }
  });
}


export function getReserveExcel(data) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/order/reserveExcel',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchOrderToNormal(id) {
  return fetch({
    url: '/api/private/order/toNormal',
    method: 'POST',
    data: {
      request: id
    }
  });
}

export function fetchVideo(id) {
  return fetch({
    url: '/api/private/order/video/' + id,
    method: 'GET'
  });
}
