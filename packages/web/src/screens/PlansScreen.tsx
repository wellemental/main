import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paragraph,
  Error,
  Input,
  Spinner,
  LegalLinks,
  PageHeading,
} from '../primitives';
import { useCurrentUser } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
import { PromoCodeService, logger } from 'services';
// import styled from 'styled-components';
// import AskParentsScreen from './AskParentsScreen';
import { deviceWidth, deviceHeight } from 'services';
import { brandColors } from '../assets/styles/theme';

// const PlanSelect = styled(TouchableOpacity)`
//   flex: 1;
//   border-color: #999;
//   border-width: 3px;
//   border-radius: 8px;
//   align-items: center;
//   color: #999;
//   padding: 20px 5px;
//   margin-bottom: 20px;
//   background-color: white;
// `;

// const Header2 = styled(H2)`
//   color: ${brandColors.brandPrimary};
// `;

// // defining IAP SKUs by platform in `constants.ts`
// export const IAP_SKUS = Platform.select({
//   ios: ['wellemental_pro', 'wellemental_pro_year'],
// });

// export enum PlanId {
//   Monthly = 'wellemental_pro',
//   Yearly = 'wellemental_pro_year',
//   Free = 'free',
//   Group = 'group',
// }

const PlansScreen: React.FC = () => {
  //
  return <Paragraph>Plans Screen will go here</Paragraph>;
};

export default PlansScreen;
