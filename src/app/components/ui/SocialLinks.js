import React from 'react'
import './styles/SocialLinks.css'

export default function SocialLinks(props) {

  const {facebook, twitter, instagram, linkedin, youtube, github,
    facebookUrl, twitterUrl, instagramUrl, linkedinUrl, youtubeUrl, githubUrl} = props

  const SocialCircle = ({link, icon}) => {
    return <a href={link} target="_blank" rel="noreferrer">
      <div className="social-circle">
        <i className={icon}></i>
      </div>
    </a>
  }

  return (
    <div className="social-links-section">
      {facebook && <SocialCircle link={`https://www.facebook.com/${facebookUrl}`} icon="fab fa-facebook-f"/>}
      {twitter && <SocialCircle link={`https://www.twitter.com/${twitterUrl}`} icon="fab fa-twitter"/>}
      {instagram && <SocialCircle link={`https://www.instagram.com/${instagramUrl}`} icon="fab fa-instagram"/>}
      {linkedin && <SocialCircle link={`https://www.linkedin.com/in/${linkedinUrl}`} icon="fab fa-linkedin-in"/>}
      {youtube && <SocialCircle link={`https://www.youtube.com/channel/${youtubeUrl}`} icon="fab fa-youtube"/>}
      {github && <SocialCircle link={`https://www.github.com/${githubUrl}`} icon="fab fa-github"/>}
    </div>
  )
}
