export const menuLinks = [
  {name: 'Home', icon: 'fal fa-home', url: '/', exact: true},
  {
    name: 'Courses', 
    icon: 'fal fa-book-open', 
    url: '/courses',
    sublinks: [
      {name: 'All Courses', icon: 'fal fa-book-open', url: '/courses', exact: true},
      {name: 'Video Courses', icon: 'fal fa-chalkboard', url: '/courses/video-courses'},
      {name: 'Text Courses', icon: 'fal fa-book-reader', url: '/courses/text-courses'},
      {name: 'Tutorials', icon: 'fab fa-youtube', url: '/courses/tutorials'},
      {name: 'My Courses', icon: 'fal fa-users-class', url: '/courses/my-courses', requireInstructor: true},
    ]
  },
  {name: 'My Library', icon: 'fal fa-books', url: '/my-library'},
  {name: 'Instructors', icon: 'fal fa-chalkboard-teacher', url: '/instructors'},
  {name: 'Create', icon: 'fal fa-plus-circle', url: '/create', requireInstructor: true},
  {name: 'Reports', icon: 'fal fa-analytics', url: '/reports'},
  {name: 'Settings', icon: 'fal fa-cog', url: '/settings'}
]

export const createCourseArray = [
  {
    title: 'Video Course',
    features: [
      {text: 'Create video content from Vimeo, YouTube or Wistia'},
      {text: 'Create Text-based lessons using our rich text editor'},
      {text: 'Add images and formatted text to your lessons'},
      {text: 'Create quizzes and exams for your lessons'},
      {text: 'Create polls for your students'},
      {text: 'Create subscriptions or pay-per-use courses'},
    ],
    idea: "A multi-media lecture experience grabs the most attention",
    url: '/create/create-course/video'
  },
  {
    title: 'Text Course',
    features: [
      {text: 'Create Text-based lessons using our rich text editor'},
      {text: 'Add images and formatted text to your lessons'},
      {text: 'Create quizzes and exams for your lessons'},
      {text: 'Add files to lessons in word or pdf format'},
      {text: 'Does not support student polls'},
      {text: 'Create subscriptions or pay-per-use courses'},
    ],
    idea: "Concentrate on text based lectures for your students",
    url: '/create/create-course/text'
  },
  {
    title: 'Tutorial',
    features: [
      {text: 'Create video content from Vimeo, YouTube or SproutVideo'},
      {text: 'Best made for short, captivating videos'},
      {text: 'Does not support text or image content'},
      {text: 'Available only as a free video'},
    ],
    idea: "Share a quick and free video tip to students",
    url: '/create/create-course/tutorial'
  }
]

export const videoTypes = [
  {
    name: 'Vimeo',
    value: 'vimeo',
    icon: 'fab fa-vimeo-v'
  },
  {
    name: 'YouTube',
    value: 'youtube',
    icon: 'fab fa-youtube'
  },
  {
    name: 'Wistia',
    value: 'wistia',
    icon: 'fas fa-video'
  }
]