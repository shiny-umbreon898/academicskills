const H5P_CONFIG = {
  page1: {
    type: 'h5p',
    url: 'https://h5p.example.com/h5p/embed/1',
    maxScore: 10,
    title: 'Introduction'
  },
  page2: {
    type: 'video',
    url: '/resources/tutorials/six_grammar_tips.mp4',
    maxScore: 5,
    title: '6 Essential Grammar Tips',
    transcript: require('../resources/captions/six_grammar_tips_captions.txt')
  },
  page3: {
    type: 'h5p',
    url: 'https://h5p.example.com/h5p/embed/3',
    maxScore: 5,
    title: 'Expert'
  }
};

export default H5P_CONFIG;
