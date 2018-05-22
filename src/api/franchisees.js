import fetch from 'utils/fetch';
import {dealDateTime} from "./discount";

/* 加盟商等级 */
export function saveFranchiseesLevel(data) {
  return fetch({
    url: '/api/private/franchisee/addLevel',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

export function getLevelList(data, page, size) {
  return fetch({
    url: '/api/private/franchisee/levelList',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  })
}

export function deleteFranchiseeLevel(id) {
  return fetch({
    url: '/api/private/franchisee/level/' + id,
    method: 'DELETE'
  });
}

/* 加盟商管理 */
export function getFranchiseesList(data, page, size) {
  return fetch({
    url: '/api/private/franchisee/list',
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function getFrachisees() {
  return fetch({
    url: '/api/private/franchisee/selectList',
    method: 'GET'
  })
}

export function getFranchiseesAdmin() {
  return fetch({
    url: '/api/private/user/franchisee',
    method: 'GET'
  })
}

export function saveFranchisees(data) {
  data.joinDate = dealDateTime(data.join);
  data.endDate = dealDateTime(data.end);
  return fetch({
    url:'/api/private/franchisee/save',
    method: 'POST',
    data: {
      'request': data
    }
  })
}

export function getFranchiseesAdminId(id) {
  return fetch({
      url: '/api/private/franchisee/franchiseeIds',
      method: 'POST',
      data: {
        'request': id
      }
  })
}

export function getFranchiseesSelect() {
  return fetch({
    url: '/api/private/franchisee/levelSelect',
    method: 'GET'
  });
}

export function fetchFranchiseeRoleLevel() {
  return fetch({
    url: '/api/private/franchisee/getFranchiseeRoleLevel',
    method: 'GET'
  })
}

export function fetchChangeBalance(data) {
  return fetch({
    url: '/api/private/franchisee/balance',
    method: 'POST',
    data: {
      'request': data
    }
  })
}

//加盟商流水
export function getFranchiseesSelectList() {
  return fetch({
    url: '/api/private/franchisee/franchiseeSelectList',
    method: 'GET'
  })
}

export function getAccountList(data, page, size) {
  data.beginDate = dealDateTime(data.dateTime[0]);
  data.endDate = dealDateTime(data.dateTime[1]);
  data.id = data.franchiseesId;
  return fetch({
    url: '/api/private/franchisee/getAccountList',
    method: 'POST',
    data: {
      'request': data,
      'size': size,
      'page':page
    }
  })
}

export function getFranchiseesAccountList(data, page, size) {
  data.beginDate = dealDateTime(data.dateTime[0]);
  data.endDate = dealDateTime(data.dateTime[1]);
  data.id = data.franchiseesId;
  return fetch({
    url: '/api/private/franchisee/getProfit',
    method: 'POST',
    data: {
      'request': data,
      'size': size,
      'page': page
    }
  })
}

//加盟商结算详情
export function getFranchiseesAccountDetailList(data, page, size) {
  data.beginDate = dealDateTime(data.dateTime[0]);
  data.endDate = dealDateTime(data.dateTime[1]);
  return fetch({
    url: '/api/private/franchisee/getProfitDetail',
    method: 'POST',
    data: {
      'request': data,
      'size': size,
      'page': page
    }
  })
}

export function exportOneFranchiseeAccountExcel(data) {
  data.beginDate = dealDateTime(data.dateTime[0]);
  data.endDate = dealDateTime(data.dateTime[1]);
  return fetch({
    url: '/api/private/franchisee/exportOneFranchisee',
    method: 'POST',
    data: {
      'request': data
    }
  })
}

export function getFranchiseesDetailBySettlementDate(data) {
  return fetch({
    url: '/api/private/franchisee/getFranchiseesDetailBySettlementDate',
    method: 'POST',
    data: {
      'request': data
    }
  })
}
