import React, { useRef, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Avatar, Thumbnail } from 'native-base';
import { Container, Button, Paragraph, Spinner } from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from './types';
import Video from 'react-native-video';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const ContentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { content, teacher } = route.params;

  const player = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const onBuffer = () => {
    setLoading(true);
  };

  console.log('TEACH', content.teacher, teacher.photo);
  return (
    <Container>
      <Paragraph>{content.title}</Paragraph>
      <Image
        source={{ uri: content.thumbnail }}
        style={{ height: 200, width: null, flex: 1 }}
      />
      {/* {loading || !content.video ? (
        <Spinner />
      ) : (
        <Video
          source={{
            uri: 'https://media.giphy.com/media/KG4UuQB5yePaHo6OJT/giphy.mp4',
          }} // Can be a URL or a local file.
          ref={(ref) => {
            player.current = ref;
          }} // Store reference
          // onBuffer={onBuffer} // Callback when remote video is buffering
          //onError={this.videoError} // Callback when video cannot be loaded
          style={styles.backgroundVideo}
        />
      )} */}
      <Paragraph>{content.description}</Paragraph>
      <Paragraph>{content.type}</Paragraph>
      <Paragraph>{content.length}</Paragraph>
      <Paragraph>{content.teacher}</Paragraph>
      <Thumbnail
        small
        source={{
          uri: teacher.photo,
        }}
      />

      <Button text="Go Home" onPress={() => navigation.navigate('Home')} />
    </Container>
  );
};

export default ContentScreen;
