import grammarVideo from '../resources/tutorials/six_grammar_tips.mp4';
import grammarCaptions from '../resources/captions/six_grammar_tips_captions.txt';

const H5P_CONFIG = {
  page1: {
    type: 'h5p',
    url: 'https://h5p.example.com/h5p/embed/1',
    maxScore: 10
  },
  page2: {
    type: 'video',
    url: grammarVideo,
    maxScore: 6,
    title: '6 Essential Grammar Tips',
    transcript: grammarCaptions
  },
  page3: {
    type: 'h5p',
    url: 'https://h5p.example.com/h5p/embed/3',
    maxScore: 5
  }
};

export default H5P_CONFIG;
