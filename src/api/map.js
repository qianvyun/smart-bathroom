import request from '@/utils/request'

// 告警信息
export function getAlarmData(data) {
  return request({
    // url: '/toiletdeviceoperation/list',
    url: '/toiletdeviceoperation/page',
    method: 'post',
    data
  })
}

// 删除告警
export function deleteAlarm(data) {
  return request({
    url: '/toiletdeviceoperation/delete',
    method: 'post',
    data
  })
}

// 添加厕所
export function addToilet(data) {
  return request({
    url: '/toilet/save',
    method: 'post',
    data
  })
}

// 删除厕所
export function deleteToilet(data) {
  return request({
    url: '/toilet/del',
    method: 'post',
    data
  })
}

// 获取厕所详情
export function getToiletDetails(data) {
  return request({
    url: '/toiletreport/getreport',
    method: 'post',
    data
  })
}

// 厕所主体详情
export function getToiletInfo(data) {
  return request({
    url: '/toilet/info',
    method: 'post',
    data
  })
}
// 获取本月和上个月厕所报表的人流数据
export function getPersonDataByMonth(data) {
  return request({
    url: '/toiletreport/getPersonDataByMonth',
    method: 'post',
    data
  })
}

// 入厕总人数
export function getPersonSumByToiletId(data) {
  return request({
    url: '/toiletreport/getPersonSumByToiletId',
    method: 'post',
    data
  })
}

// 清洁员信息
export function getCleanerIsOnline(data) {
  return request({
    url: '/toilet/cleanerIsOnline',
    method: 'post',
    data
  })
}

// 厕所评价
export function getToiletEvaluateByToiletId(data) {
  return request({
    url: '/toiletdeviceoperation/evaluateByToiletId',
    method: 'post',
    data
  })
}

// 厕所评价排行
export function getToiletEvaluateByProjectId(data) {
  return request({
    url: '/toiletdeviceoperation/evaluateByProjectId',
    method: 'post',
    data
  })
}
