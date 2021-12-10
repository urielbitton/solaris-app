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

export const truncateText = (text, charsNum) => {
  return text.length > charsNum ? (text.slice(0,charsNum) + "...") : text
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
  if(file.size <= 31_457_280) {  
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