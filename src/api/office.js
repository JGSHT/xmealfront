import fetch from 'utils/fetch';

export function fetchOfficeTree() {
  return fetch({
    url: '/api/private/office/tree',
    method: 'GET'
  });
}

export function fetchOfficeSave(data) {
  return fetch({
    url: '/api/private/office',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchOfficeNode(id) {
  return fetch({
    url: '/api/private/office/' + id,
    method: 'GET'
  });
}

export function fetchOfficeArae(id) {
  return fetch({
    url: '/api/private/office/area?parentId=' + id,
    method: 'GET'
  });
}

export function fetchOfficeDelete(data) {
  return fetch({
    url: '/api/private/office',
    method: 'DELETE',
    data: {
      request: data
    }
  });
}

export function fetchOffices() {
  return fetch({
    url: '/api/private/office/officeForSelect',
    method: 'GET'
  });
}
