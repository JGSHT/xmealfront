import fetch from 'utils/fetch';

export function fetchRoleList(data, page, size) {
  return fetch({
    url: '/api/private/role/list',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchRoleUser() {
  return fetch({
    url: '/api/private/role/user',
    method: 'GET'
  });
}

export function fetchRoleSave(data) {
  return fetch({
    url: '/api/private/role',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function fetchRoleNode(id) {
  return fetch({
    url: '/api/private/role/' + id,
    method: 'GET'
  });
}

export function fetchRoleDelete(id) {
  return fetch({
    url: '/api/private/role/' + id,
    method: 'DELETE'
  });
}

export function fetchRoleListForTransfer() {
  return fetch({
    url: '/api/private/role/transfer',
    method: 'GET'
  });
}
