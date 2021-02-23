import React, { useRef, useEffect } from 'react';
import { Image as RNImage, ImageProps } from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import ConditionalWrapper from './ConditionalWrapper';

const Image: React.FC<ImageProps> = ({ style, source, ...props }) => {
  // const firstLoad = useRef(true);

  // useEffect(() => {
  //   firstLoad.current = false;
  // }, []);

  // console.log('FIRST LOAD', firstLoad.current);

  return (
    // <ConditionalWrapper
    //   condition={firstLoad.current}
    //   wrapper={(children: React.ReactChildren) => (
    //     <FadeIn style={style}>{children}</FadeIn>
    //   )}>
    <FadeIn style={style}>
      <RNImage source={source} style={style} {...props} />
    </FadeIn>
    // </ConditionalWrapper>
  );
};

export default Image;
