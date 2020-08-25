// @flow

import variable from '../variables/platform';

export default (variables /* : * */ = variable) => {
  const h3Theme = {
    color: variables.brandPrimary,
    fontSize: variables.fontSizeH3,
    lineHeight: variables.lineHeightH3,
    fontFamily: variables.titleFontfamily,
  };

  return h3Theme;
};
