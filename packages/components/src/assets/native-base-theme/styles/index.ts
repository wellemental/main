import { StyleSheet } from 'react-native';

import variables from '../native-base-theme/variables/platform';

const Text = StyleSheet.create({
  p: {
    marginTop: 10,
    marginBottom: 10,
  },
  note: {
    marginTop: 10,
    marginRight: 20,
    marginBottom: 10,
    marginLeft: 20,
    textAlign: 'center',
  },
  legal: {
    marginTop: 10,
    marginRight: 20,
    marginBottom: 10,
    marginLeft: 20,
    lineHeight: 20,
    textAlign: 'center',
    fontSize: variables.noteFontSize + 2,
  },
  error: {
    marginTop: 10,
    marginBottom: 10,
    color: variables.brandPrimary,
    textAlign: 'center',
  },
  link: {
    color: variables.brandSecondary,
  },
});

export default { Text };
