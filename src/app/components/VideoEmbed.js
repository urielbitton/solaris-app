import React, { useState } from 'react'
import Loader from './Loader'

export default function VideoEmbed(props) {

  const {embedUrl, videoTitle} = props
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="video-embed-container">
      <iframe
        src={embedUrl}
        onLoad={() => setIsLoading(false)}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={videoTitle}
      />
      { 
        isLoading && 
        <Loader containerHeight="450px" /> 
      }
  </div>
  )
}
