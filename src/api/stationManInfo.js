import fetch from 'utils/fetch';

export function fetchStationManList(data, page, size) {
  return fetch({
    url: '/api/private/stationMan/list',
    method: 'POST',
    data: {
      request: data,
      page,
      size
    }
  });
}
