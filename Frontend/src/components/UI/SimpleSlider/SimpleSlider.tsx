import React, { PropsWithChildren } from 'react';
import Slider from 'react-slick';

const SimpleSlider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1000,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    fade: true,
  };

  return <Slider {...settings}>{children}</Slider>;
};

export default SimpleSlider;
