import React from 'react';
import { DatePicker as NBDatePicker, Item, Label } from 'native-base';
import moment from 'moment';
import { Translations } from '../types';
import variables from '../assets/native-base-theme/variables/wellemental';

type Props = {
  date?: Date | string | null;
  translation: Translations;
  onDateChange: React.Dispatch<(prevState: undefined) => undefined>;
  locale?: 'es' | 'en';
};

const DatePicker: React.FC<Props> = ({
  date,
  translation,
  onDateChange,
  locale,
}) => {
  return (
    <>
      <Label style={{ fontSize: 15, color: variables.textColor }}>
        {translation.Birthday}
      </Label>

      <NBDatePicker
        defaultDate={
          typeof date === 'string' // If date is a string, convert to Date
            ? moment(date).toDate()
            : date // If date prop is a Date, keep as-is
            ? date
            : moment().subtract(13, 'years').toDate() // If no date prop, set date to 13yo
        }
        maximumDate={moment().toDate()}
        locale={locale ? locale : 'en'}
        timeZoneOffsetInMinutes={undefined}
        modalTransparent={false}
        animationType={'fade'}
        androidMode={'default'}
        placeHolderText={
          date
            ? moment(date).format('MMM DD, YYYY')
            : translation['Select birthday']
        }
        textStyle={{
          fontSize: 18,
          marginLeft: 0,
          paddingLeft: 0,
        }}
        placeHolderTextStyle={{
          color: variables.textColor,
          paddingLeft: 0,
          fontSize: 18,
        }}
        onDateChange={onDateChange}
        disabled={false}
      />
      <Item style={{ marginLeft: 0, marginBottom: 25, alignSelf: 'stretch' }} />
    </>
  );
};

export default DatePicker;
