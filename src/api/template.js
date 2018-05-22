import fetch from 'utils/fetch';

export function fetchTemplateList(data, page, size) {
  return fetch({
    url: '/api/private/template/list',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

/* export function fetchProductList(data, page, size) {
  return fetch({
    url: '/api/private/product/list',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
} */

export function fetchProductList(templateId, companyId) {
  return fetch({
    url: '/api/private/template/getProducts',
    method: 'POST',
    data: {
      request: {
        templateId,
        companyId
      }
    }
  });
}

export function fetchTemplateSave(data) {
  return fetch({
    url: '/api/private/template/save',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchgetTemplate(id) {
  return fetch({
    url: '/api/private/template/' + id,
    method: 'GET'
  });
}

export function fetchTemplateDelete(id) {
  return fetch({
    url: '/api/private/template/delete/' + id,
    method: 'DELETE'
  });
}

export function fetchTemplateProduct(id) {
  return fetch({
    url: '/api/private/template/product/' + id,
    method: 'GET'
  });
}

export function offProduct(data) {
  return fetch({
    url: '/api/private/template/deleteProduct',
    method: 'DELETE',
    data: {
      request: data
    }
  });
}

export function addProduct(data) {
  return fetch({
    url: '/api/private/template/addProduct',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function updateNumber(data) {
  return fetch({
    url: '/api/private/template/updateProductNumber',
    method: 'PUT',
    data: {
      request: data
    }
  });
}

export function updateSalePrice(data) {
  return fetch({
    url: '/api/private/template/updateProductSalePrice',
    method: 'PUT',
    data: {
      request: data
    }
  });
}
