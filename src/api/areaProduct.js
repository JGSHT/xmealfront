import fetch from 'utils/fetch';

export function fetchProductList(data) {
  return fetch({
    url: '/api/private/areaProduct/getProducts',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchAddAreaProduct(companyId, products) {
  return fetch({
    url: '/api/private/areaProduct/addAreaProduct',
    method: 'POST',
    data: {
      request: {
        companyId,
        productTasteVOS: products
      }
    }
  });
}

export function fetchAreaProductList(data, page, size) {
  return fetch({
    url: '/api/private/areaProduct/list',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchDeleteAreaProduct(data) {
  return fetch({
    url: '/api/private/areaProduct/deleteAreaProduct',
    method: 'DELETE',
    data: {
      request: data
    }
  });
}

export function fetchAreaProductSave(data) {
  return fetch({
    url: '/api/private/areaProduct/addAreaProduct',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchUpdateProduct(data) {
  return fetch({
    url: '/api/private/areaProduct/updateAreaProduct',
    method: 'PUT',
    data: {
      request: data
    }
  });
}

export function fetchProductMachines(data, page, size) {
  return fetch({
    url: '/api/private/areaProduct/getMachineProduct',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchMachineList(data, page, size) {
  return fetch({
    url: '/api/private/areaProduct/getMachines', // 获取设备信息
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchAddMachine(productId, salePrice, companyId, machineIds, onFloor,tasteId) {
  return fetch({
    url: '/api/private/areaProduct/addMachineProduct',
    method: 'POST',
    data: {
      request: {
        productId,
        salePrice,
        companyId,
        onFloor,
        tasteId,
        machines: machineIds
      }
    }
  });
}

export function fetchOffProduct(machineProducts) {
  return fetch({
    url: '/api/private/areaProduct/offMachineProduct',
    method: 'POST',
    data: {
      request: machineProducts
    }
  });
}

export function fetchProductDetail(productId, companyId, tasteId) {
  return fetch({
    url: '/api/private/areaProduct/getAreaProductByPidAndCid',
    method: 'POST',
    data: {
      request: {
        productId,
        companyId,
        tasteId
      }
    }
  })
}

export function fetchGetProductTaste(productId) {
  return fetch({
    url: '/api/private/areaProduct/getProductTasteByPid',
    method: 'POST',
    data: {
      request: {
        productId
      }
    }
  })
}

export function fetchUpdateMachineProduct(data) {
  return fetch({
    url: '/api/private/areaProduct/updateMachineProduct',
    method: 'POST',
    data: {
      request: data
    }
  })
}

export function fetchGetTotalProductCount(data) {
  return fetch({
    url: '/api/private/areaProduct/getTotalProductCount',
    method: 'POST',
    data: {
      request: data
    }
  })
}

export function fetchRecordProduct(data) {
  return fetch({
    url: '/api/private/areaProduct/exportExcelProductInfo',
    method: 'POST',
    data: {
      request: data
    }
  });
}
export function fetchUpdateFloor(data) {
  return fetch({
    url: '/api/private/areaProduct/updateFloor',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchUpdateMoveFloor(data) {
  return fetch({
    url: '/api/private/areaProduct/updateMoveFloor',
    method: 'POST',
    data: {
      request: data
    }
  });
}



// 处理时间
export function dealDateTime(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}
