import fetch from '../utils/fetch';
import { dealDateTime } from './discount';

// 获取设备列表信息
export function fetchReplenishment(data, page, size) {
  return fetch({
    url: '/api/private/replenishment/list',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

// 获取设备上的商品
export function getMachineProduct(machineId) {
  return fetch({
    url: '/api/private/machine/product',
    method: 'POST',
    data: {
      request: { id: machineId }
    }
  });
}

// 获取销售情况详情
export function fetchSaleCondition(machineId) {
  return fetch({
    url: '/api/private/replenishment/' + machineId,
    method: 'GET'
  });
}

// 修改确认补货量
export function fetchUpdateConfirmAddCount(machineId, confirmAddCount, productId, tasteId) {
  return fetch({
    url: '/api/private/replenishment/add',
    method: 'POST',
    data: {
      request: {
        machineId,
        confirmAddCount,
        productId,
        tasteId
      }
    }
  });
}

// 批量修改确认补货量
export function fetchUpdateConfirmAddCountByMachineIds(machineIds, confirmAddCount, productId, tasteId) {
  return fetch({
    url: '/api/private/replenishment/add',
    method: 'POST',
    data: {
      request: {
        machineIds,
        confirmAddCount,
        productId,
        tasteId
      }
    }
  });
}

// 批量修改确认补货量
export function fetchUpdateConfirmAddCountByProducts(machineId, confirmAddCount, product) {
  return fetch({
    url: '/api/private/replenishment/add',
    method: 'POST',
    data: {
      request: {
        machineId,
        confirmAddCount,
        productTastes: product
      }
    }
  });
}

// 确认补货并导出excel
export function fetchReplenishmentAndExportExcel(machineList, stock, showSummary, showAddress, ignoreStock) {
  if (ignoreStock) {
    ignoreStock = true
  } else {
    ignoreStock = false
  }
  return fetch({
    url: '/api/private/replenishment',
    method: 'POST',
    data: {
      request: {
        machineIds: machineList,
        stockId: stock,
        ignoreStock,
        showBarcode: false,
        showQRecord: false,
        showSummary,
        showAddress
      }
    }
  });
}

// 获取某个设备的配货情况
export function showReplenishmentCondition(machineId) {
  return fetch({
    url: '/api/private/replenishment/machineReplenishment',
    method: 'POST',
    data: {
      request: machineId
    }
  });
}

// 二次导出excel
export function exportExcelTwice(data) {
  return fetch({
    url: '/api/private/replenishment/exportExcelTwice',
    method: 'POST',
    data: {
      request: data
    }
  });
}

// 导出补货单配货单差异表
export function fetchExportDifference(data) {
  return fetch({
    url: '/api/private/replenishment/exportDifference',
    method: 'POST',
    data: {
      request: data
    }
  });
}

// 确认收货
export function confirmProduct(data) {
  return fetch({
    url: '/api/private/replenishment/confirm',
    method: 'POST',
    data: {
      request: data
    }
  });
}

// 获取站点信息
export function fetchStockInfo() {
  return fetch({
    url: '/api/private/stockInfo/getStockByUser',
    method: 'GET'
  });
}

// 获取设备列表
export function getMachineListForSelect() {
  return fetch({
    url: '/api/private/machine/machineList',
    method: 'GET'
  });
}

// 获取补货单历史列表
export function getReplenishmentHistoryList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/replenishment/getHistory',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  })
}

// 获取某张配送单历史详情
export function getReplenishmentHistoryDetail(id) {
  return fetch({
    url: '/api/private/replenishment/getReplenishmentHistoryDetail',
    method: 'POST',
    data: {
      request: id
    }
  });
}

// 获取所选设备上所有商品
export function getAllProductInMachine(machineIds) {
  return fetch({
    url: '/api/private/replenishment/getAllProductInMachine',
    method: 'POST',
    data: {
      request: machineIds
    }
  });
}

// 获取某一商品在勾选的设备上的需求
export function getChangeReplenishmentCount(productId, machineIds, tasteId) {
  return fetch({
    url: '/api/private/replenishment/getChangeReplenishmentCount',
    method: 'POST',
    data: {
      request: {
        machineIds,
        productId,
        tasteId
      }
    }
  });
}

// 商品配货统计
export function fetchReplenishmentStatisticsList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/replenishment/statistics',
    method: 'POST',
    data: {
      request: data,
      size,
      page
    }
  });
}

export function exportReplenishmentStatistics(data) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/replenishment/exportStatistics',
    method: 'POST',
    data: {
      request: data
    }
  })
}

export function fetchStatisticsProductInMachine(productId, tasteId, page, size) {
  return fetch({
    url: '/api/private/replenishment/statisticsProductInMachine',
    method: 'POST',
    data: {
      request: {
        productId,
        tasteId
      },
      page,
      size
    }
  });
}

// 查询带审核补货单
export function fetchReplenishmentAuditingList(data, page, size) {
  if (data.dateTime && data.dateTime.length === 2) {
    data.beginDate = dealDateTime(data.dateTime[0]);
    data.endDate = dealDateTime(data.dateTime[1]);
  } else {
    data.beginDate = null;
    data.endDate = null;
  }
  return fetch({
    url: '/api/private/replenishment/replenishmentAuditingList',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  })
}

export function getDataForAuditing(id) {
  return fetch({
    url: '/api/private/replenishment/dataForAuditing/' + id,
    method: 'GET'
  })
}

export function fetchChangeReplenishment(id, value, productId, tasteId) {
  return fetch({
    url: '/api/private/replenishment/changeReplenishment',
    method: 'POST',
    data: {
      request: {
        id,
        confirmCount: value,
        productId: (productId) ? productId : null,
        tasteId: (tasteId) ? tasteId : null
      }
    }
  })
}

export function fetchPass(ids) {
  return fetch({
    url: '/api/private/replenishment/pass',
    method: 'POST',
    data: {
      request: ids
    }
  })
}

export function fetchAddReplenishment(data) {
  return fetch({
    url: '/api/private/replenishment/addRecord',
    method: 'POST',
    data: {
      request: data
    }
  })
}

export function deleteReplenishmentRecord(id) {
  return fetch({
    url: '/api/private/replenishment/deleteRecord',
    method: 'DELETE',
    data: {
      request: id
    }
  })
}
