import request from '@/utils/request'

export function getDaily(data) {
  return request({
    url: '/user/cleanerlist',
    method: 'post',
    data
  })
}

