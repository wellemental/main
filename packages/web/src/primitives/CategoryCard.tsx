import React from 'react';
// import { Card, CardItem, Right, Body, H3 } from 'native-base';
import Image from './Image';
import { useHistory } from '../hooks';
import Paragraph from './Paragraph';
import { Category } from '../types';

type Props = {
  category: Category;
};

const CategoryCard: React.FC<Props> = ({ category }) => {
  const history = useHistory();

  return (
    <Paragraph>Card will go here</Paragraph>
    // <Card>
    //   <CardItem
    //     cardBody
    //     button
    //     onPress={() => navigation.navigate('Category', { category: category })}>
    //     <Body
    //       style={{
    //         flex: 2,
    //         justifyContent: 'space-around',
    //         padding: 15,
    //         paddingBottom: 15,
    //       }}>
    //       <H3>{category.title}</H3>
    //       {category.description && (
    //         <Paragraph>{category.description}</Paragraph>
    //       )}
    //     </Body>
    //     <Right style={{ flex: 1, marginLeft: 10 }}>
    //       <Image
    //         source={
    //           typeof category.image === 'string'
    //             ? {
    //                 uri: category.image,
    //               }
    //             : category.image
    //         }
    //         style={{
    //           height: 120,
    //           width: 120,
    //           borderRadius: 20,
    //         }}
    //       />
    //     </Right>
    //   </CardItem>
    // </Card>
  );
};

export default CategoryCard;
