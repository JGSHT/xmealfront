import fetch from 'utils/fetch';

export function fetchUserList(data, page, size) {
  return fetch({
    url: '/api/private/user/list',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchUserSave(data) {
  return fetch({
    url: '/api/private/user',
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchUserNode(id) {
  return fetch({
    url: '/api/private/user/' + id,
    method: 'GET'
  });
}

export function fetchUserDelete(id) {
  return fetch({
    url: '/api/private/user/' + id,
    method: 'DELETE'
  });
}

export function getLeadingOfficial() {
  return fetch({
    url: '/api/private/user/getLeadingOfficial',
    method: 'GET'
  });
}

export function fetchCode(phone, loginName) {
  return fetch({
    url: '/api/public/code',
    method: 'POST',
    data: {
      request: {
        mobile: phone,
        loginName
      }
    }
  });
}

export function fetchSaveNewPW(passWord, id) {
  return fetch({
    url: '/api/private/userInfo/saveNPW',
    method: 'POST',
    data: {
      request: {
        id,
        passWord
      }
    }
  });
}

export function fetchSaveNPW(code, passWord, email) {
  return fetch({
    url: '/api/public/saveNewPW',
    method: 'POST',
    data: {
      request: {
        code,
        loginName: email,
        passWord
      }
    }
  });
}
