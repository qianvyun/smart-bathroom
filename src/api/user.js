import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/infoByToken',
    method: 'post'
  })
}

export function logout(data) {
  return request({
    url: '/sys/logout',
    method: 'post',
    data
  })
}
