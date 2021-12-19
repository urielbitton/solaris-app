import React from 'react'
import './styles/Loader.css'

export default function Loader(props) {

  const { width="70px", height="70px", containerWidth="100%", containerHeight="100%" } = props

  return (
    <div 
      className='app-loader'
      style={{width: containerWidth, height: containerHeight}}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 100 100">
        <g transform="translate(20 20)">
          <rect x="-15" y="-15" width="30" height="30" fill="#2f86ff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.4s"></animateTransform>
          </rect></g>
        <g transform="translate(50 20)">
          <rect x="-15" y="-15" width="30" height="30" fill="#599eff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.3s"></animateTransform>
          </rect></g>
        <g transform="translate(80 20)">
          <rect x="-15" y="-15" width="30" height="30" fill="#82b6ff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.2s"></animateTransform>
          </rect></g>
        <g transform="translate(20 50)">
          <rect x="-15" y="-15" width="30" height="30" fill="#599eff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.3s"></animateTransform>
          </rect></g>
        <g transform="translate(50 50)">
          <rect x="-15" y="-15" width="30" height="30" fill="#82b6ff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.2s"></animateTransform>
          </rect></g>
        <g transform="translate(80 50)">
          <rect x="-15" y="-15" width="30" height="30" fill="#accfff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.1s"></animateTransform>
          </rect></g>
        <g transform="translate(20 80)">
          <rect x="-15" y="-15" width="30" height="30" fill="#82b6ff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.2s"></animateTransform>
          </rect></g>
        <g transform="translate(50 80)">
          <rect x="-15" y="-15" width="30" height="30" fill="#accfff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="-0.1s"></animateTransform>
          </rect></g>
        <g transform="translate(80 80)">
          <rect x="-15" y="-15" width="30" height="30" fill="#d5e7ff">
            <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" calcMode="spline" dur="1s" values="1;1;0.2;1;1" keyTimes="0;0.2;0.5;0.8;1" keySplines="0.5 0.5 0.5 0.5;0 0.1 0.9 1;0.1 0 1 0.9;0.5 0.5 0.5 0.5" begin="0s"></animateTransform>
          </rect></g>
        </svg>
    </div>
  )
}
