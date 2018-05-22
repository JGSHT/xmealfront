import fetch from 'utils/fetch';
import { dealDateTime } from './discount';

export function fetchSaveCarouselMap(data) {
  data.beginDate = dealDateTime(data.dateTime[0]);
  data.endDate = dealDateTime(data.dateTime[1]);
  return fetch({
    url: '/api/private/carouselMap', // 保存轮播图配置信息
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchUpdateCarouselMap(data) {
  data.beginDate = dealDateTime(data.dateTime[0]);
  data.endDate = dealDateTime(data.dateTime[1]);
  return fetch({
    url: '/api/private/carouselMap/update', // 保存轮播图配置信息
    method: 'POST',
    data: {
      request: data
    }
  });
}

export function fetchCarouselMapList(data, page, size) {
  return fetch({
    url: '/api/private/carouselMap/list', // 获取轮播图配置信息
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}

export function fetchDeleteCarouselMap(id) {
  return fetch({
    url: '/api/private/carouselMap/' + id, // 删除轮播图配置信息
    method: 'DELETE'
  });
}


export function fetchCarouselMapAllInfo(id) {
  return fetch({
    url: '/api/private/carouselMap/' + id, // 修改轮播图配置信息
    method: 'GET'
  });
}


export function fetchImageTemplate(id) {
  return fetch({
    url: '/api/private/carouselMap/image_template/' + id, // 修改轮播图配置信息
    method: 'GET'
  });
}

/* export function fetchSendImageTemplate(data){
 /!* var regionId,companyId,contentLED;
  if(data.regionId === ''){
    regionId = null;
  }else{
    regionId = data.regionId;
  }

  if(data.companyId === ''){
    companyId = null;
  }else{
    companyId = data.companyId;
  }

  if(data.contentLED ===''){
    contentLED = null;
  }else{
    contentLED = data.contentLED;
  }*!/
  return fetch({
    url: '/api/private/carouselMap/sendLEDContent', // 修改轮播图配置信息
    method: 'PUT',
    data: {
      'request': {
        'id': data.id
      }
    }
  });
} */

export function updateCarouselMapStatus(status, id) {
  return fetch({
    url: '/api/private/carouselMap/updatedStatus',
    method: 'POST',
    data: {
      request: {
        status,
        id
      }
    }
  });
}
