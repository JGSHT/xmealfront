import fetch from 'utils/fetch';

export function fetchRecordLabelList(data, page, size) {
  return fetch({
    url: '/api/private/labelCount/machineList', // 同一标签所有设备喜好人数
    method: 'POST',
    data: {
      'request': data,
      'page': page,
      'size': size
    }
  });
}

export function fetchMachineLabelList(id, page ,size){
  return fetch({
    url: '/api/private/labelCount/labelList',
    method: 'POST',
    data: {
      'request': {
        machineId: id
      },
      'page': page,
      'size': size
    }
  });
}

//根据条件导出
export function fetchRecordLabel(data) {
  return fetch({
    url: '/api/private/labelCount/exportExcelLabelrecord',
    method: 'POST',
    data: {
      'request': data
    }
  });
}

