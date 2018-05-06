function formatTimestamp (timestamp) {
  if (timestamp) {
    let date = new Date(timestamp * 1000)
    return date.getFullYear() + '/' + padStart(date.getMonth() + 1) + '/' + padStart(date.getDate()) + ' ' +
      padStart(date.getHours()) + ':' + padStart(date.getMinutes())
  }
  return ''
}
function padStart (num, length = 2) {
  return ('' + num).padStart(length, '0')
}

function problemTypeToTagContent (type) {
  switch (type) {
    case 'JAVA':
      return 'Java'
    case 'JAVA_COVERAGE':
      return 'Java覆盖测试'
    case 'PYTHON':
      return 'Python'
    case 'PYTHON_COVERAGE':
      return 'Python覆盖测试'
  }
  return type
}

function examStatusToTagType (status) {
  switch (status) {
    case 'READY':
      return ''
    case 'AVAILABLE':
      return 'success'
    case 'FINISHED':
      return 'warning'
    case 'UNAVAILABLE':
      return 'danger'
  }
  return 'info'
}

function examStatusToTagContent (status) {
  switch (status) {
    case 'PREPARING':
      return '准备中'
    case 'UNAVAILABLE':
      return '初始化失败'
    case 'READY':
      return '尚未开始'
    case 'AVAILABLE':
      return '正在进行'
    case 'FINISHED':
      return '已结束'
    case 'CLOSED':
      return '已关闭'
  }
  return '未知状态'
}

function buildStatusToTagType (status) {
  switch (status) {
    case 'RUNNING':
      return ''
    case 'SUCCESS':
      return 'success'
    case 'UNSTABLE':
      return 'warning'
    case 'FAILURE':
    case 'TIMEOUT':
      return 'danger'
  }
  return 'info'
}

function buildStatusToTagContent (status) {
  switch (status) {
    case 'SUCCESS':
      return '所有用例通过'
    case 'UNSTABLE':
      return '有用例未通过'
    case 'FAILURE':
      return '编译或运行失败'
    case 'TIMEOUT':
      return '运行超时'
    case 'WAITING':
      return '等待运行'
    case 'RUNNING':
      return '正在运行'
  }
  return '未知状态'
}

function errorMessage (response) {
  if (response.body.err) {
    return response.body.err + '：' + response.body.msg
  }
  return response.status + '：' + response.statusText
}

export default {
  formatTimestamp,
  problemTypeToTagContent,
  examStatusToTagType,
  examStatusToTagContent,
  buildStatusToTagType,
  buildStatusToTagContent,
  errorMessage
}
