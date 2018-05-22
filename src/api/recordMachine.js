import fetch from 'utils/fetch';
import { dealDateTime } from './discount';

export function fetchRecordMachineList(data, page, size) {
  let beginDate, endDate, machineName, mobile, officeId, regionId, companyId, machineStatus;

  if (data.dateTime === '') {
    beginDate = null;
    endDate = null;
  } else {
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }
  if (data.machineName === '') {
    machineName = null;
  } else {
    machineName = data.machineName
  }

  if (data.mobile === '') {
    mobile = null;
  } else {
    mobile = data.mobile;
  }

  if (data.officeId === '') {
    officeId = null;
  } else {
    officeId = data.officeId;
  }

  if (data.regionId === '') {
    regionId = null;
  } else {
    regionId = data.regionId;
  }

  if (data.companyId === ''){
    companyId = null;
  } else {
    companyId = data.companyId;
  }

  if (data.machineStatus === '') {
    machineStatus = null;
  } else {
    machineStatus = data.machineStatus
  }

  return fetch({
    url: '/api/private/recordRest/list', // 设备金额
    method: 'POST',
    data: {
      request: {
        beginTime: beginDate,
        endTime: endDate,
        machineName,
        mobile,
        officeId,
        regionId,
        companyId,
        machineStatus
      },
      page,
      size
    }
  });
}

export function fetchOrderList(data, page, size) {
  let beginDate, endDate, machineName, mobile, officeId, regionId, companyId, machineStatus, id;
  if (data.dateTime === '') {
    beginDate = null;
    endDate = null;
  } else {
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }
  if (data.machineName === '') {
    machineName = null;
  } else {
    machineName = data.machineName
  }

  if (data.mobile === '') {
    mobile = null;
  } else {
    mobile = data.mobile;
  }

  if (data.officeId === '') {
    officeId = null;
  } else {
    officeId = data.officeId;
  }

  if (data.regionId === '') {
    regionId = null;
  } else {
    regionId = data.regionId;
  }

  if (data.companyId === '') {
    companyId = null;
  } else {
    companyId = data.companyId;
  }

  if (data.machineStatus === '') {
    machineStatus = null;
  } else {
    machineStatus = data.machineStatus
  }

  if (data.id === '') {
    id = null;
  } else {
    id = data.id;
  }
  return fetch({
    url: '/api/private/recordRest/list_order',
    method: 'POST',
    data: {
      request: {
        id,
        beginTime: beginDate,
        endTime: endDate,
        machineName,
        mobile,
        officeId,
        regionId,
        companyId,
        machineStatus
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

// 根据条件导出
export function fetchRecordMachine(data) {
  let beginDate, endDate, machineName, mobile, officeId, regionId, companyId, machineStatus;

  if (data.dateTime === '') {
    beginDate = null;
    endDate = null;
  } else {
    beginDate = dealDateTime(data.dateTime[0]);
    endDate = dealDateTime(data.dateTime[1]);
  }
  // console.log("beginDate======"+beginDate)
  if (data.machineName === '') {
    machineName = null;
  } else {
    machineName = data.machineName
  }

  if (data.mobile === '') {
    mobile = null;
  } else {
    mobile = data.mobile;
  }

  if (data.officeId === '') {
    officeId = null;
  } else {
    officeId = data.officeId;
  }

  if (data.regionId === '') {
    regionId = null;
  } else {
    regionId = data.regionId;
  }

  if (data.companyId === '') {
    companyId = null;
  } else {
    companyId = data.companyId;
  }

  if (data.machineStatus === '') {
    machineStatus = null;
  } else {
    machineStatus = data.machineStatus
  }
  return fetch({
    url: '/api/private/recordRest/exportExcelMachineInCome',
    method: 'POST',
    data: {
      request: {
        beginTime: beginDate,
        endTime: endDate,
        machineName,
        mobile,
        officeId,
        regionId,
        companyId,
        machineStatus
      }
    }
  });
}
