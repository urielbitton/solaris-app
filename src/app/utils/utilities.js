export const convertFireDateToString = (date) => {
  return `${date?.toDate().toString().split(' ')[1]} ${date?.toDate().toString().split(' ')[2]} ${date?.toDate().toString().split(' ')[3]}`
}

export const msToDays = (ms) => {
  return (ms / (60*60*24*1000))
}

export const getDaysAgo = (date) => {
  return Math.round(msToDays(Date.now()) - msToDays(date))
}

export const getTextInBetweenTwoChars = (string, start, end) => {
  return string.substring(string.indexOf(start)+1, string.lastIndexOf(end))
}

export const addLeadingZeros = (number) => {
  return number < 10 ? "0"+number : number
}

export const convertYoutubeDuration = (string) => {
  let hours = ''
  let minutes = ''
  let seconds = ''
  if(string.includes('H')) {
    hours = getTextInBetweenTwoChars(string, 'T', 'H')
    minutes = getTextInBetweenTwoChars(string, 'H', 'M')
    seconds = getTextInBetweenTwoChars(string, 'M', 'S')
  }
  else {
    hours = '0'
    minutes = getTextInBetweenTwoChars(string, 'T', 'M')
    seconds = getTextInBetweenTwoChars(string, 'M', 'S')
  }
  return `${addLeadingZeros(+hours)}:${addLeadingZeros(+minutes)}:${addLeadingZeros(+seconds)}`
}