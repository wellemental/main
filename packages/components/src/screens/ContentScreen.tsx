import React, { useRef, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { H1 } from 'native-base';
import {
  Container,
  Button,
  Paragraph,
  AvyName,
  Favorite,
  Box,
} from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const onBuffer = () => {
    setLoading(true);
  };

  return (
    <Container>
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
      <Image
        source={{ uri: content.thumbnail }}
        style={{ height: 200, width: null, flex: 1 }}
      />
      <Box row justifyContent="space-between" gt={2} gb={1}>
        {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}> */}
        <H1>{content.title}</H1>
        <Favorite onProfile contentId={content.id} />
        {/* </View> */}
      </Box>

      <Paragraph gb>
        {content.type.toUpperCase()} | {content.length}
      </Paragraph>

      <Paragraph gb>{content.description}</Paragraph>

      <Button
        transparent
        onPress={() =>
          navigation.navigate('Teacher', {
            teacher,
          })
        }>
        <AvyName source={teacher.photo} name={content.teacher} onProfile />
      </Button>
    </Container>
  );
};

export default ContentScreen;
