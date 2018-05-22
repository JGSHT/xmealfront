import fetch from 'utils/fetch';

// 处理时间
export function dealDateTime(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

export function fetchProductList(data, page, size) {
  return fetch({
    url: '/api/private/product/list',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchProductSave(data) {
  return fetch({
    url: '/api/private/product',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchProductNode(id) {
  return fetch({
    url: '/api/private/product/' + id,
    method: 'GET'
  });
}

export function fetchProductDelete(id) {
  return fetch({
    url: '/api/private/product/' + id,
    method: 'DELETE'
  });
}

export function fetchProductMachines(data, page, size) {
  return fetch({
    url: '/api/private/product/machine',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function offProduct(productId, machineIds) {
  return fetch({
    url: '/api/private/product/machine',
    method: 'DELETE',
    data: {
      request: {
        id: productId,
        machines: machineIds
      }
    }
  });
}

export function addMachine(productId, machineIds) {
  return fetch({
    url: '/api/private/product/machine',
    method: 'PUT',
    data: {
      request: {
        id: productId,
        machines: machineIds
      }
    }
  });
}


export function fetchRecordProduct(data) {
  return fetch({
    url: '/api/private/product/exportExcelProductInfo',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchCreateQrcod(data) {
  let expirationDate;
  if (data.expirationDate === '') {
    expirationDate = null
  } else {
    expirationDate = dealDateTime(data.expirationDate)
  }
  return fetch({
    url: '/api/private/product/createQrcod',
    method: 'POST',
    data: {
      request: {
        id: data.productId,
        tasteIds: data.tasteIds,
        expirationDate
      }
    }
  });
}


export function fetchUpdateStatus(data) {
  return fetch({
    url: '/api/private/product/intelligentize',
    method: 'POST',
    data: {
      request: {
        id: data.id,
        status: data.status
      }
    }
  });
}

export function fetchMachineUnreplenishmentProduct(id, machineId) {
  return fetch({
    url: '/api/private/product/unreplenishmentProduct',
    method: 'POST',
    data: {
      request: {
        id,
        machineId
      }
    }
  })
}
