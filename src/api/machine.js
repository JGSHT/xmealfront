import fetch from 'utils/fetch';

export function fetchSaveMachine(data) {
  let installDate;
  if (data.installDate === '') {
    installDate = null
  } else {
    installDate = dealDateTime(data.installDate)
    data.installDate = installDate
  }
  return fetch({
    url: '/api/private/machine', // 保存设备信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}


export function fetchMachineList(data, page, size){
  return fetch({
    url: '/api/private/machine/list', // 获取设备信息
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchDeleteMachine(id){
  return fetch({
    url: '/api/private/machine/'+id, // 删除设备信息
    method: 'DELETE'
  });
}


export function fetchUpdateMachine(id){
  return fetch({
    url: '/api/private/machine/'+id, // 修改设备信息
    method: 'GET'
  });
}


export function fetchMachinesProduct(data){
  return fetch({
    url: '/api/private/machine/product', // 设备在售商品信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}


export function fetchUpdateMachineStatus(id){
  return fetch({
    url: '/api/private/machine//update/'+id, // 设备同步到阿里云
    method: 'PUT',
  });
}

export function offProduct(machineProducts) {
  return fetch({
    url: '/api/private/machine/offProduct',
    method: 'DELETE',
    data : {
      'request': machineProducts
    }
  });
}


export function addProduct(products) {
  return fetch({
    url: '/api/private/machine/addProduct',
    method: 'PUT',
    data : {
      'request': products
    }
  });
}

export function fetchDownLoad(id){
  return fetch({
    url: '/api/private/machine/download/'+id, // 修改设备信息
    method: 'GET'
  });
}

export function addProductView(machineId, productIds) {
  return fetch({
    url: '/api/private/machine/product/list',
    method: 'DELETE',
    data : {
      'request': {
        'id': machineId,
        'products': productIds
      }
    }
  });
}

export function initByTemplate(machineId, templateId) {
  return fetch({
    url: '/api/private/machine/initByTemplate',
    method: 'PUT',
    data : {
      'request': {
        'id': machineId,
        'templateId': templateId
      }
    }
  });
}

export function updateSalePrice(data) {
  return fetch({
    url: '/api/private/machine/updateProductSalePrice',
    method: 'PUT',
    data: {
      'request': data
    }
  });
}

export function fetchUadateMachineStatus(data) {
  return fetch({
    url: '/api/private/machine/updateMachineStatus',
    method: 'PUT',
    data: {
      'request': data
    }
  });
}

export function fetchBranchList() {
  return fetch({
    url: '/api/private/branchInfo/findListStatus1',
    method: 'GET'
  });
}

export function fetchProductList(machineId) {
  return fetch({
    url: '/api/private/machine/getProducts/'+ machineId,
    method: 'GET'
  });
}

export function fetchVersionChange(data) {
  return fetch({
    url: '/api/private/machine/versionChange',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

// 处理时间
export function dealDateTime(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

