function formatTimestamp (timestamp) {
  let date = new Date(timestamp * 1000)
  return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay() + ' ' + toBit(date.getHours()) + ':' + toBit(date.getMinutes())
}
function toBit (num) {
  return ('' + num).padStart(2, '0')
}
export default {
  formatTimestamp
}
