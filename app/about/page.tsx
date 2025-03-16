import React from 'react';
import AsciiArt from './ascii';

const About = () => {
  return (
    <div>
      <p>
        I havent written an about me yet 😅 but{' '}
        <a
          href='https://twitter.com/anononchain'
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500'
        >
          you can find me on twitter
        </a>
      </p>
      <AsciiArt />
    </div>
  );
};

export default About;
