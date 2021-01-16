import request from '@/utils/request'

export function uploadImgAndVideo(data) {
  return request({
    url: '/toilet/uploadImgAndVideo',
    method: 'post',
    data
  })
}

export function AddToImg(data) {
  return request({
    url: '/toilet/addToImg',
    method: 'post',
    data
  })
}
export function uploadTxt(data) {
  return request({
    url: '/toilet/update',
    method: 'post',
    data
  })
}
