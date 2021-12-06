import React from 'react'

export default function VideoEmbed(props) {

  const {embedUrl, videoWidth, videoHeight, videoTitle} = props

  return (
    <div className="video-embed-container">
      <iframe
        width={videoWidth}
        height={videoHeight}
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={videoTitle}
      />
  </div>
  )
}
