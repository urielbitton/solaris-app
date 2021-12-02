export const menuLinks = [
  {name: 'Home', icon: 'fal fa-home', url: '/', exact: true},
  {
    name: 'Courses', 
    icon: 'fal fa-book-open', 
    url: '/courses',
    sublinks: [
      {name: 'Video Courses', icon: 'fal fa-chalkboard', url: '/courses/video-courses'},
      {name: 'Text Courses', icon: 'fal fa-book-reader', url: '/courses/text-courses'},
      {name: 'Tutorials', icon: 'fab fa-youtube', url: '/courses/tutorials'},
    ]
  },
  {name: 'Instructors', icon: 'fal fa-chalkboard-teacher', url: '/instructors'},
  {name: 'My Library', icon: 'fal fa-books', url: '/my-library'},
  {name: 'Reports', icon: 'fal fa-analytics', url: '/reports'},
  {name: 'Settings', icon: 'fal fa-cog', url: '/settings'}
]