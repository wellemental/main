// @flow
import color from 'color';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import { colors } from 'common';

export const brandColors = colors;

import { PLATFORM } from './commonColor';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = PLATFORM.MATERIAL;
const isIphoneX =
  platform === PLATFORM.IOS &&
  (deviceHeight === 812 ||
    deviceWidth === 812 ||
    deviceHeight === 896 ||
    deviceWidth === 896);

export default {
  platformStyle,
  platform,

  // Accordion
  headerStyle: '#edebed',
  iconStyle: '#000',
  contentStyle: '#f5f4f5',
  expandedIconStyle: '#000',
  accordionBorderColor: '#d3d3d3',

  // ActionSheet
  elevation: 4,
  containerTouchableBackgroundColor: 'rgba(0,0,0,0.4)',
  innerTouchableBackgroundColor: '#fff',
  listItemHeight: 50,
  listItemBorderColor: 'transparent',
  marginHorizontal: -15,
  marginLeft: 14,
  marginTop: 15,
  minHeight: 56,
  padding: 15,
  touchableTextColor: '#757575',

  // Android
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',
  buttonUppercaseAndroidText: true,

  // Badge
  badgeBg: colors.brandInfo,
  badgeColor: '#fff',
  badgePadding: 0,

  // Button
  buttonFontFamily: platform === PLATFORM.IOS ? 'Inter' : 'Inter',
  buttonDisabledBg: colors.textColor,
  buttonPadding: 6,
  get buttonPrimaryBg() {
    return this.brandPrimary;
  },
  get buttonPrimaryColor() {
    return this.inverseTextColor;
  },
  get buttonInfoBg() {
    return this.brandInfo;
  },
  get buttonInfoColor() {
    return this.inverseTextColor;
  },
  get buttonSuccessBg() {
    return this.brandSuccess;
  },
  get buttonSuccessColor() {
    return this.inverseTextColor;
  },
  get buttonDangerBg() {
    return this.brandDanger;
  },
  get buttonDangerColor() {
    return this.inverseTextColor;
  },
  get buttonWarningBg() {
    return this.brandWarning;
  },
  get buttonWarningColor() {
    return this.inverseTextColor;
  },
  get buttonTextSize() {
    return this.fontSizeBase;
  },
  get buttonTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get buttonTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: '#fff',
  cardBorderColor: '#ccc',
  cardBorderRadius: 10,
  cardItemPadding: platform === PLATFORM.IOS ? 15 : 20,

  // CheckBox
  CheckboxRadius: 0,
  CheckboxBorderWidth: 2,
  CheckboxPaddingLeft: 2,
  CheckboxPaddingBottom: 5,
  CheckboxIconSize: 16,
  CheckboxIconMarginTop: 1,
  CheckboxFontSize: 17,
  checkboxBgColor: '#039BE5',
  checkboxSize: 20,
  checkboxTickColor: '#fff',

  // Color
  ...colors,
  brandPrimary: colors.primary,
  brandSecondary: colors.secondary,
  brandDark: colors.secondary,
  brandWarning: colors.warning,
  brandInfo: colors.info,
  brandSuccess: colors.success,
  brandDanger: colors.danger,
  brandLight: colors.light,
  textColor: colors.text,
  lightTextColor: colors.lightText,
  darkTextColor: colors.darkText,
  inverseTextColor: colors.inverse,

  // Content
  contentBgColor: colors.white,

  // Container
  containerBgColor: colors.white,
  inverseContainerBgColor: colors.brandPrimary,

  // Date Picker
  datePickerTextColor: colors.textColor,
  datePickerBg: '#222', //'transparent',

  // FAB
  fabWidth: 56,

  // Font
  DefaultFontSize: 16,
  fontFamily: platform === PLATFORM.IOS ? 'Inter' : 'Inter',
  fontSizeBase: 16,
  get fontSizeH1() {
    return this.fontSizeBase * 2;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.5;
  },

  // Footer
  footerHeight: 50,
  footerDefaultBg: '#E7E9EC',
  footerPaddingTop: isIphoneX ? 20 : 0,
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: '#bfc6ea',
  tabBarTextSize: 11,
  activeTab: '#fff',
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: '#fff',
  tabActiveBgColor: '#3F51B5',

  // Header
  toolbarBtnColor: '#fff',
  toolbarDefaultBg: colors.brandPrimary,
  toolbarHeight: platform === PLATFORM.IOS ? 64 : 56,
  headerHeight: platform === PLATFORM.IOS ? 64 : 56,
  toolbarSearchIconSize: 23,
  toolbarInputColor: '#fff',
  searchBarHeight: platform === PLATFORM.IOS ? 30 : 40,
  searchBarInputHeight: platform === PLATFORM.IOS ? 40 : 50,
  toolbarBtnTextColor: '#fff',
  toolbarDefaultBorder: colors.textColor,
  iosStatusbar: 'light-content',
  get statusBarColor() {
    return color(this.toolbarDefaultBg).darken(0.2).hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor).darken(0.03).hex();
  },

  // Icon
  iconFamily: 'Ionicons',
  iconFontSize: 28,
  iconHeaderSize: 24,

  // InputGroup
  inputFontSize: 18,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',
  inputHeightBase: 50,
  inputColor: colors.textColor,
  get inputColorPlaceholder() {
    return this.textColor;
  },

  // Line Height
  buttonLineHeight: 19,
  lineHeightH1: 38,
  lineHeightH2: 37,
  lineHeightH3: 28,
  lineHeight: 24,

  // List
  listBg: 'transparent',
  listBorderColor: '#c9c9c9',
  listDividerBg: '#f4f4f4',
  listBtnUnderlayColor: '#DDD',
  listItemPadding: 12,
  listNoteColor: '#808080',
  listNoteSize: 13,
  listItemSelected: colors.lightTextColor,

  // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',

  // Radio Button
  radioBtnSize: 23,
  radioSelectedColorAndroid: '#3F51B5',
  radioBtnLineHeight: 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: 'rgba(0,0,0,0)',
  segmentActiveBackgroundColor: colors.brandPrimary,
  segmentTextColor: colors.brandPrimary,
  segmentActiveTextColor: colors.white,
  segmentBorderColor: colors.brandPrimary,
  segmentBorderColorMain: 'rgba(0,0,0,0)',

  // Spinner
  get defaultSpinnerColor() {
    return this.lightTextColor;
  },
  inverseSpinnerColor: 'white',

  // Tab
  tabDefaultBg: 'rgba(0,0,0,0)',
  topTabBarTextColor: colors.lightTextColor,
  topTabBarActiveTextColor: colors.brandPrimary,
  topTabBarBorderColor: 'rgba(0,0,0,0)',
  topTabBarActiveBorderColor: colors.brandPrimary,

  // Tabs
  tabBgColor: 'rgba(0,0,0,0)',
  tabActiveColor: 'rgba(255, 255, 255, 1)',
  tabInactiveColor: 'rgba(0,0,0,0)',
  tabFontSize: 20,

  // Text
  lightTextColor: colors.lightTextColor,
  textColor: colors.textColor,
  darkTextColor: colors.darkTextColor,
  inverseTextColor: '#fff',
  noteFontSize: 12,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily:
    platform === PLATFORM.IOS ? 'RecoletaAlt-Medium' : 'RecoletaAlt-Medium',
  titleFontSize: 28,
  subTitleFontSize: 20,
  subtitleColor: '#FFF',
  titleFontColor: '#FFF',

  // Other
  borderRadiusBase: 10,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,
  mainContentPaddingHorizontal: 15,
  mainContentPaddingVertical: 15,
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: 30,
  defaultShadow: {
    shadowColor: colors.lightGray,
    borderTopWidth: 0,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.35,
    shadowRadius: 13.84,
    elevation: 5,
  },

  // iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      bottomInset: 34,
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 21,
    },
  },
};
