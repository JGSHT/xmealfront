import fetch from 'utils/fetch';

export function fetchCustomerAddressList(data, page, size) {
  console.log(JSON.stringify(data))
  return fetch({
    url: '/api/private/customerAddress/list',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}
