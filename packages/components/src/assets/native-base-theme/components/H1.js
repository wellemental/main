// @flow

import variable from '../variables/platform';

export default (variables /* : * */ = variable) => {
  const h1Theme = {
    color: variables.brandPrimary,
    fontSize: variables.fontSizeH1,
    lineHeight: variables.lineHeightH1,
    fontFamily: variables.titleFontfamily,
  };

  return h1Theme;
};
