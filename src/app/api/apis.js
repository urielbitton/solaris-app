export const menuLinks = [
  {name: 'Home', icon: 'fal fa-home', url: '/', exact: true},
  {
    name: 'Courses', 
    icon: 'fal fa-book-open', 
    url: '/courses',
    sublinks: [
      {name: 'Video Courses', icon: 'fal fa-video', url: '/courses/video-courses'},
      {name: 'Literary Courses', icon: 'fal fa-file-alt', url: '/courses/literary-courses'}
    ]
  },
  {name: 'Instructors', icon: 'fal fa-chalkboard-teacher', url: '/instructors'},
  {name: 'My Library', icon: 'fal fa-books', url: '/my-library'},
  {name: 'Report', icon: 'fal fa-analytics', url: '/reports'},
  {name: 'Settings', icon: 'fal fa-cog', url: '/settings'}
]