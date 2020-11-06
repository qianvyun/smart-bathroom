import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getUsers(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/user/update`,
    method: 'post',
    data
  })
}

/*export function deleteUser(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}*/
