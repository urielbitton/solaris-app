import React from 'react'

export default function PageLoader({loading}) {
  return (
    <div 
      className='page-loader' 
      style={{
        position:'fixed',
        top:'0',left:'0',
        background:'rgba(255,255,255,0.7)',
        backdropFilter:'blur(2px)',
        width:'100%',
        height:'100vh',
        zIndex:'9000',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        visibility: loading ? "visible" : "hidden",
        opacity: loading ? "1" : "0"
      }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="70px" height="70px" viewBox="0 0 100 100">
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
