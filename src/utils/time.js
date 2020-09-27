export const formatChatTime = (timestamp) =>{ // 转换时间
  if (String(timestamp).length === 10) {
    timestamp *= 1000
  }
  const twentyFourHours = 24 * 60 * 60 * 1000
  const weekHours = 24 * 60 * 60 * 1000 * 7
  const todayDate = new Date()
  const todayYear = todayDate.getFullYear()
  const todayyear = todayDate.getFullYear() + '年'
  const todayMonth = todayDate.getMonth() + 1
  const todayDay = todayDate.getDate()
  const today = `${todayYear}/${todayMonth}/${todayDay}`
  const todayTime = new Date(today).getTime() // 今天0：00的时间戳
  const yesterdayTime = new Date(todayTime - twentyFourHours).getTime() // 昨天0：00的时间戳
  const weekTime = new Date(todayTime - weekHours).getTime() // 今天往前推一周0：00的时间戳
  // 获取传入时间的格式
  const date = new Date(timestamp)
  var year = date.getFullYear() + '年'
  var month = date.getMonth() + 1 + '月'
  var day = date.getDate() + '日'
  var week = date.getDay()
  var str = getWeek(week)
  const hour = date.getHours()
  let minute = date.getMinutes()
  if (minute < 10) {
    minute = '0' + minute
  }
  if (timestamp > todayTime) {
    if (hour >= 0 && hour < 6) {
      return '凌晨 ' + hour + ':' + minute
    }
    if (hour >= 6 && hour < 12) {
      return '早上 ' + hour + ':' + minute
    }
    if (hour === 12) {
      return '中午 ' + hour + ':' + minute
    }
    if (hour > 12 && hour < 18) {
      const hours = hour - 12
      return '下午 ' + hours + ':' + minute
    }
    if (hour >= 18 < hour < 24) {
      const hours = hour - 12
      return '晚上 ' + hours + ':' + minute
    }
  } else if (timestamp < todayTime && timestamp > yesterdayTime) {
    if (hour >= 0 && hour < 6) {
      return '昨天凌晨 ' + hour + ':' + minute
    }
    if (hour >= 6 && hour < 12) {
      return '昨天早上 ' + hour + ':' + minute
    }
    if (hour === 12) {
      return '昨天中午 ' + hour + ':' + minute
    }
    if (hour > 12 && hour < 18) {
      const hours = hour - 12
      return '昨天下午 ' + hours + ':' + minute
    }
    if (hour >= 18 < hour < 24) {
      const hours = hour - 12
      return '昨天晚上 ' + hours + ':' + minute
    }
  } else if (timestamp < yesterdayTime && timestamp > weekTime) {
    if (hour >= 0 && hour < 6) {
      return str + '凌晨 ' + hour + ':' + minute
    }
    if (hour >= 6 && hour < 12) {
      return str + '早上 ' + hour + ':' + minute
    }
    if (hour === 12) {
      return str + '中午 ' + hour + ':' + minute
    }
    if (hour > 12 && hour < 18) {
      const hours = hour - 12
      return str + '下午 ' + hours + ':' + minute
    }
    if (hour >= 18 < hour < 24) {
      const hours = hour - 12
      return str + '晚上 ' + hours + ':' + minute
    }
  } else if (todayyear !== year) {
    if (hour >= 0 && hour < 6) {
      return year + month + day + '凌晨 ' + hour + ':' + minute
    }
    if (hour >= 6 && hour < 12) {
      return year + month + day + '早上 ' + hour + ':' + minute
    }
    if (hour === 12) {
      return year + month + day + '中午 ' + hour + ':' + minute
    }
    if (hour > 12 && hour < 18) {
      const hours = hour - 12
      return year + month + day + '下午 ' + hours + ':' + minute
    }
    if (hour >= 18 < hour < 24) {
      const hours = hour - 12
      return year + month + day + '晚上 ' + hours + ':' + minute
    }
  } else {
    if (hour >= 0 && hour < 6) {
      return month + day + '凌晨 ' + hour + ':' + minute
    }
    if (hour >= 6 && hour < 12) {
      return month + day + '早上 ' + hour + ':' + minute
    }
    if (hour === 12) {
      return month + day + '中午 ' + hour + ':' + minute
    }
    if (hour > 12 && hour < 18) {
      const hours = hour - 12
      return month + day + '下午 ' + hours + ':' + minute
    }
    if (hour >= 18 < hour < 24) {
      const hours = hour - 12
      return month + day + '晚上 ' + hours + ':' + minute
    }
  }
}

export const getWeek = (week) => {
  var str = ''
  if (week === 0) {
    str = '周日 '
  } else if (week === 1) {
    str = '周一 '
  } else if (week === 2) {
    str = '周二 '
  } else if (week === 3) {
    str = '周三 '
  } else if (week === 4) {
    str = '周四 '
  } else if (week === 5) {
    str = '周五 '
  } else if (week === 6) {
    str = '周六 '
  }
  return str
}

// 主页格式化时间
export const pageFormatda =(startDate, endDate)=> {
  if (!endDate) {
    startDate = new Date(startDate)
    var year = startDate.getFullYear()
    var month = startDate.getMonth() + 1
    var date = startDate.getDate()
    var dastr = [year, month, date].join('/')
    return `${dastr}`
  } else {
    return Math.floor((endDate - startDate) / 86400000)
  }
}