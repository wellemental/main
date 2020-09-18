import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Paragraph from './Paragraph';
import { MenuItem } from '../types';
import variables from '../assets/native-base-theme/variables/wellemental';

type Props = {
  tabs: MenuItem[];
  active: MenuItem;
  setTab: React.Dispatch<MenuItem>;
  // filters: string[];
};

const Tabs: React.FC<Props> = ({ tabs, active, setTab }) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={tabs}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            minWidth: 60,
            borderBottomColor:
              active.label === item.label
                ? variables.brandPrimary
                : 'rgba(0,0,0,0)',
            borderBottomWidth: 4,
            height: 40,
            justifyContent: 'center',
            alignContent: 'center',
          }}
          onPress={() => setTab(item)}
          key={item.label}>
          <Paragraph
            style={{
              fontSize: 20,
              fontFamily: 'Inter',
              marginLeft: 7,
              marginRight: 7,
              fontWeight: active.label === item.label ? '600' : '400',
              color:
                active.label === item.label
                  ? variables.brandPrimary
                  : variables.lightTextColor,
            }}
            key={item.label}>
            {item.label}
          </Paragraph>
        </TouchableOpacity>
      )}
    />
  );
};

export default Tabs;
