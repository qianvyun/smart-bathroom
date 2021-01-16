import request from '@/utils/request'

// 人流量日统计
export function getTrafficStatisticsDayData(data) {
  return request({
    url: '/toiletDataReport/personSumByHour',
    method: 'post',
    data
  })
}

// 人流量月统计
export function getTrafficStatisticsMonthData(data) {
  return request({
    url: '/toiletDataReport/personSumByDay',
    method: 'post',
    data
  })
}

// 人流量年统计
export function getTrafficStatisticsYearData(data) {
  return request({
    url: '/toiletDataReport/personSumByMonth',
    method: 'post',
    data
  })
}

// 评价统计 年/月/日
export function getEvaluateStatisticsData(data) {
  return request({
    url: '/toiletdeviceoperation/evaluateScore',
    method: 'post',
    data
  })
}
