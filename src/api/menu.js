import fetch from 'utils/fetch';

export function fetchMenuTree() {
  return fetch({
    url: '/api/private/menu/tree',
    method: 'GET'
  });
}

export function fetchMenuSave(data) {
  return fetch({
    url: '/api/private/menu',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchMenuNode(id) {
  return fetch({
    url: '/api/private/menu/' + id,
    method: 'GET'
  });
}

export function fetchMenuDelete(data) {
  return fetch({
    url: '/api/private/menu',
    method: 'DELETE',
    data: {
      request: data
    }
  });
}
