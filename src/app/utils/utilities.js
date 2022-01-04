export const convertFireDateToString = (date) => {
  return `${date?.toDate().toString().split(' ')[1]} ${date?.toDate().toString().split(' ')[2]} ${date?.toDate().toString().split(' ')[3]}`
}

export const msToDays = (ms) => {
  return (ms / (60*60*24*1000))
}

export const msToTime = (ms) => {
    let seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60),
    hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds
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
  if(string.includes('H') && string.includes('M') && string.includes('S')) { //all 3
    hours = getTextInBetweenTwoChars(string, 'T', 'H')
    minutes = getTextInBetweenTwoChars(string, 'H', 'M')
    seconds = getTextInBetweenTwoChars(string, 'M', 'S')
  }
  if (string.includes('H') && !string.includes('M') && string.includes('S')) { //hours & seconds
    hours = getTextInBetweenTwoChars(string, 'T', 'H')
    minutes = '00'
    seconds = getTextInBetweenTwoChars(string, 'H', 'S')
  }
  if(string.includes('H') && string.includes('M') && !string.includes('S')) { // hours & minutes
    hours = getTextInBetweenTwoChars(string, 'T', 'H')
    minutes = getTextInBetweenTwoChars(string, 'H', 'M')
    seconds = '00'
  }
  if(!string.includes('H') && string.includes('M') && string.includes('S')) { // minutes & seconds
    hours = '00'
    minutes = getTextInBetweenTwoChars(string, 'T', 'M')
    seconds = getTextInBetweenTwoChars(string, 'M', 'S')
  }
  if(string.includes('H') && !string.includes('M') && !string.includes('S')) { //hours only
    hours = getTextInBetweenTwoChars(string, 'T', 'H')
    minutes = '00'
    seconds = '00'
  }
  if(!string.includes('H') && string.includes('M') && !string.includes('S')) { //minutes only
    hours = '00'
    minutes = getTextInBetweenTwoChars(string, 'T', 'M')
    seconds = '00'
  }
  if(!string.includes('H') && !string.includes('M') && string.includes('S')) { //seconds only
    hours = '00'
    minutes = '00'
    seconds = getTextInBetweenTwoChars(string, 'T', 'S')
  }
  return `${addLeadingZeros(+hours)}:${addLeadingZeros(+minutes)}:${addLeadingZeros(+seconds)}`
}

export const truncateText = (text, charsNum) => {
  return text?.length > charsNum ? (text?.slice(0,charsNum) + "...") : text
}

export const fileTypeConverter = (string) => {
  if(string.includes('wordprocessingml')) 
    return {icon:'fas fa-file-word', color: '#2194ff', name: 'Word'}
  else if(string.includes('spreadsheetml')) 
    return {icon: 'fas fa-file-excel', color: '#73d609', name: 'Excel'}
  else if(string.includes('presentationml'))
    return {icon: 'fas fa-file-powerpoint', color: '#ff640a', name: 'PowerPoint'}
  else if(string.includes('pdf'))
    return {icon: 'fas fa-file-pdf', color: '#ff0a37', name: 'PDF'}
  else if(string.includes('audio'))
    return {icon: 'fas fa-file-audio', color: '#a74aff', name: 'Audio'}
  else if(string.includes('image'))
    return {icon: 'fas fa-file-image', color: '#ffc219', name: 'Image'}
  else if(string.includes('zip-compressed'))
    return {icon: 'fas fa-file-archive', color: '#ff8e24', name: 'Zip'}
  else
    return {icon: 'fas fa-file-alt', color: '#0febff', name: 'Other'}
}

export const uploadImgLocal = (inputRef, setImage) => {
  let file = inputRef.current.files[0]
  if(file?.size <= 31_457_280) {  
    let reader = new FileReader()
    reader.onloadend = function(){
      setImage(reader.result)
    } 
    if(file) {
      reader.readAsDataURL(file)
    } 
  }
  else {
    alert('File is too large (maximum size allowed: 30MB)')
  }
} 

export const courseSorting = (a, b, courseSort) => {
  if(courseSort?.includes('dateCreated')) {
    if(a.dateCreated - b.dateCreated && courseSort === 'dateCreatedDesc')
      return (a.dateCreated - b.dateCreated)
    else
      return (b.dateCreated - a.dateCreated)
  }
  if(courseSort?.includes('az')) {
    if(a.title < b.title && courseSort === 'azDesc') 
      return -1
    else 
      return 1
  }
  if(courseSort?.includes('price')) {
    if (a.price - b.price && courseSort === 'priceDesc')
      return b.price - a.price
    else
      return a.price - b.price
  }
}