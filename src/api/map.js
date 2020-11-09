import request from '@/utils/request'

export function getAlarmData(data) {
  return request({
    url: '/toiletdeviceoperation/list',
    method: 'post',
    data
  })
}

export function deleteAlarm(data) {
  return request({
    url: '/toiletdeviceoperation/delete',
    method: 'post',
    data
  })
}

export function addToilet(data) {
  return request({
    url: '/toilet/save',
    method: 'post',
    data
  })
}

export function getToiletDetails(data) {
  return request({
    url: '/toiletreport/getreport',
    method: 'post',
    data
  })
}
