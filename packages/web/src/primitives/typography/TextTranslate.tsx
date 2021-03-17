// Base component to handle translations
import React from 'react';
import {
  default as MuiTypography,
  TypographyProps,
} from '@material-ui/core/Typography';
import { getTranslation } from 'common';
import { useCurrentUser } from '../../hooks';

// Super confusing generic prop to resolve issues with component prop on Material-UI
// Details here - https://material-ui.com/guides/typescript/
const TextTranslate = <C extends React.ElementType>(
  props: TypographyProps<C, { component?: C }>,
) => {
  const { translation } = useCurrentUser();
  return (
    <MuiTypography {...props}>
      {typeof props.children === 'string'
        ? getTranslation(props.children, translation)
        : props.children}
    </MuiTypography>
  );
};

export default TextTranslate;
