// @flow

import variable from '../variables/platform';
import { PLATFORM } from '../variables/commonColor';

export default (variables /* : * */ = variable) => {
  const platform = variables.platform;

  const segmentTheme = {
    height: 60,
    borderColor: variables.segmentBorderColorMain,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: variables.segmentBackgroundColor,
    'NativeBase.Button': {
      alignSelf: 'center',
      borderRadius: 0,
      paddingTop: 10,
      paddingBottom: 10,
      height: 50,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderColor: variables.segmentBorderColor,
      elevation: 0,
      '.active': {
        backgroundColor: variables.segmentActiveBackgroundColor,
        'NativeBase.Text': {
          color: variables.segmentActiveTextColor,
        },
        'NativeBase.Icon': {
          color: variables.segmentActiveTextColor,
        },
      },
      '.first': {
        borderTopLeftRadius: platform === PLATFORM.IOS ? 5 : undefined,
        borderBottomLeftRadius: platform === PLATFORM.IOS ? 5 : undefined,
        borderLeftWidth: 1,
      },
      '.last': {
        borderTopRightRadius: platform === PLATFORM.IOS ? 5 : undefined,
        borderBottomRightRadius: platform === PLATFORM.IOS ? 5 : undefined,
      },
      'NativeBase.Text': {
        color: variables.segmentTextColor,
        fontSize: 20,
      },
      'NativeBase.Icon': {
        fontSize: 22,
        paddingTop: 0,
        color: variables.segmentTextColor,
      },
    },
  };

  return segmentTheme;
};
