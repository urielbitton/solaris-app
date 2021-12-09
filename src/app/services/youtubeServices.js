import axios from 'axios'

export const getYoutubeVideoDetails = (videoUrlID) => {
  const options = {
    method: 'GET',
    url: 'https://youtube-v31.p.rapidapi.com/videos',
    params: {part: 'contentDetails,snippet', id: videoUrlID},
    headers: {
      'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
      'x-rapidapi-key': '8dfca300dbmshc9db1bd89959686p130e19jsneb01c198116e'
    }
  }
  return axios.request(options)
}