import fetch from 'utils/fetch';

export function fetchSaveDeviceType(data) {
  return fetch({
    url: '/api/private/deviceType/saveDeviceType', // 保存设备类型信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}


export function fetchDeviceTypeList(data, page, size){
  return fetch({
    url: '/api/private/deviceType/list', // 获取设备类型信息
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchDeleteDeviceType(id){
  return fetch({
    url: '/api/private/deviceType/'+id, // 删除设备信息
    method: 'DELETE'
  });
}


export function fetchUpdateDeviceType(id){
  return fetch({
    url: '/api/private/deviceType/getDeviceTypeById/'+id, // 修改设备类型信息
    method: 'GET'
  });
}


export function fetchDeviceTypeProduct(data){
  return fetch({
    url: '/api/private/deviceType/getDtProducts', // 设备类型中售商品信息
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function fetchProductList(data){
  return fetch({
    url: '/api/private/deviceType/products',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function offProduct(deviceTyId, productIds) {
  return fetch({
    url: '/api/private/deviceType/offProduct',
    method: 'DELETE',
    data : {
      'request': {
        'id': deviceTyId,
        'productIds': productIds
      }
    }
  });
}


export function addProduct(deviceTypeId, productIds, tier, errorRange) {
  return fetch({
    url: '/api/private/deviceType/addProduct',
    method: 'PUT',
    data : {
      'request': {
        'id': deviceTypeId,
        'productIds': productIds,
        'errorRange': errorRange,
        'tier': tier
      }
    }
  });
}


/*export function updateSalePrice(data) {
  return fetch({
    url: '/api/private/machine/updateProductSalePrice',
    method: 'PUT',
    data: {
      'request': data
    }
  });
}*/

