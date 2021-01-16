import request from '@/utils/request'

export function getLiveList(data) {
  return request({
    url: '/toilet/liveList',
    method: 'post',
    data
  })
}

export function updateLives(data) {
  return request({
    url: '/toilet/updateLivesUrl',
    method: 'post',
    data
  })
}

export function delLives(data) {
  return request({
    url: '/toilet/delLivesUrl',
    method: 'post',
    data
  })
}
