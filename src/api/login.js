import fetch from 'utils/fetch';
import md5 from 'crypto-js/md5';

export function loginByEmail(email, passWord) {
  const params = {
    request : {
      loginName : email,
      passWord  : md5(passWord).toString()
    }
  };
  return fetch({
    url: '/api/public/login',
    method: 'POST',
    data: params
  });
}

export function logout() {
  return fetch({
    url: '/api/private/user/logout',
    method: 'delete'
  });
}

export function getInfo() {
  return fetch({
    url: '/api/private/user',
    method: 'GET'
  });
}
