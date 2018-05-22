function examStatusOptions (role) {
  let options = [{label: '所有考试', value: ''}]
  if (role === 'STUDENT') {
    options.push({label: '已参加的', value: 'JOINED'})
  } else {
    options.push(
      {label: '初始化中', value: 'PREPARING'},
      {label: '初始化失败', value: 'UNAVAILABLE'}
    )
  }
  options.push(
    {label: '尚未开始', value: 'READY'},
    {label: '正在进行', value: 'AVAILABLE'},
    {label: '已结束', value: 'FINISHED'},
    {label: '已关闭', value: 'CLOSED'}
  )
  return options
}

function problemTypeOptions (containAll = false) {
  let options = containAll ? [{label: '所有题目', value: ''}] : []
  options.push(
    {label: 'Java', value: 'JAVA'},
    {label: 'Java覆盖测试', value: 'JAVA_COVERAGE'},
    {label: 'Python', value: 'PYTHON'},
    {label: 'Python覆盖测试', value: 'PYTHON_COVERAGE'},
    {label: 'Java变异覆盖测试', value: 'JAVA_MUTATION'}
  )
  return options
}

export default {
  examStatusOptions,
  problemTypeOptions
}
