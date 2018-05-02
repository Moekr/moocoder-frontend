function formatTimestamp (timestamp) {
  if (timestamp) {
    let date = new Date(timestamp * 1000)
    return date.getFullYear() + '/' + padStart(date.getMonth() + 1) + '/' + padStart(date.getDate()) + ' ' +
      padStart(date.getHours()) + ':' + padStart(date.getMinutes())
  }
}
function padStart (num, length = 2) {
  return ('' + num).padStart(length, '0')
}

export default {
  formatTimestamp
}
