import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Paragraph from '../typography/Paragraph';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { MenuItem } from 'common';
import variables from '../../assets/native-base-theme/variables/wellemental';

type Props = {
  tabs: MenuItem[];
  active: MenuItem;
  setTab: React.Dispatch<MenuItem>;
};

const Tabs: React.FC<Props> = ({ tabs, active, setTab }) => {
  const { translation } = useCurrentUser();
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={tabs}
      keyExtractor={item => item.label}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            marginLeft: 0, //index === 0 ? 15 : 0,
            marginBottom: 15,
            paddingHorizontal: 15,
            minWidth: 50,
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
            {translation[item.label] ? translation[item.label] : item.label}
          </Paragraph>
        </TouchableOpacity>
      )}
    />
  );
};

export default Tabs;
