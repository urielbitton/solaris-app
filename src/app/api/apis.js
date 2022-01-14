import allCoursesImg from '../assets/imgs/all-courses-free.png'
import freeResources from '../assets/imgs/free-resources.png'
import dedicatedCloud from '../assets/imgs/dedicated-cloud.png'
import discoverPhotography from '../assets/imgs/discover-photography.png'
import discoverArchitecture from '../assets/imgs/discover-architecture.png'
import discoverProgramming from '../assets/imgs/discover-programming.png'
import discoverBusiness from '../assets/imgs/discover-business.png'
import discoverFitness from '../assets/imgs/discover-fitness.png'

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

export const quizTypes = [
  {
    name: 'Multiple Choice',
    subName: '& short answers',
    value: 'multipleChoice',
    icon: 'far fa-list-ol'
  },
  {
    name: 'Written Answers',
    value: 'writtenAnswers',
    subName: '& long texts',
    icon: 'far fa-text-size'
  }
]

export const proFeatures = [
  {
    name: 'Site-wide Courses',
    img: allCoursesImg,
    description: 'Unlock all courses site wide instead of paying per course.'
  },
  {
    name: 'Free Resources',
    img: freeResources,
    description: 'Get access to unlimited free resources ranging from instructor to student needs.'
  },
  {
    name: 'Dedicated Cloud Videos',
    img: dedicatedCloud,
    description: 'You get your own dedicated cloud hosting for video uploads as well as lecture notes & files'
  }
]

export const discoverCourses = [
  {
    title: 'Photography',
    img: discoverPhotography,
    description: 'Learn the skills and techniques behind the camera and much more.',
    coursesCount: 3,
    url: '#'
  },
  {
    title: 'Architecture',
    img: discoverArchitecture,
    description: 'Get hands on knowledge with our architecture courses.',
    coursesCount: 2,
    url: '#'
  },
  {
    title: 'Programming',
    img: discoverProgramming,
    description: 'Gain relevant skills in programming and land your first job within weeks,',
    coursesCount: 11,
    url: '#'
  },
  {
    title: 'Business',
    img: discoverBusiness,
    description: 'Learn the ins and outs of trading, sales and business techniques from professionals.',
    coursesCount: 7,
    url: '#'
  },
  {
    title: 'Fitness',
    img: discoverFitness,
    description: 'Fitness courses on your own time, discover how you can achieve a better lifestyle instantly.',
    coursesCount: 4,
    url: '#'
  },
]