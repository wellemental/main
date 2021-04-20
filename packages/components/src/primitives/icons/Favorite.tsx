import React, { useEffect, useState, useRef } from 'react';
import { Button, Icon } from 'native-base';
import { useMutation } from '../../hooks/useMutation';
import { useContainer } from '../../hooks/useContainer';
import { useQuery } from '../../hooks/useQuery';
import { FavoritesServiceType } from 'common';
import { colors } from 'common';

interface Props {
  contentId: string;
  onProfile?: boolean;
}

const Favorite: React.FC<Props> = ({ contentId, onProfile }) => {
  const [isFav, toggleFav] = useState(false);

  const container = useContainer();
  const service = container.getInstance<FavoritesServiceType>(
    'favoritesService',
  );

  // Query is content is favorited or not
  const query = useRef(() => service.isFavorited(contentId));
  const { data: initialFavState, loading } = useQuery<boolean>(query.current);

  const { loading: mutating, mutate } = useMutation(() =>
    service.toggle(contentId),
  );

  // Set fav state once pulled from database
  useEffect(() => {
    toggleFav(!!initialFavState);
  }, [initialFavState]);

  // Update favorite doc in database
  const handleFavorite = () => {
    mutate(() => toggleFav(!isFav));
  };

  return (
    <Button
      iconRight
      disabled={loading || mutating}
      style={{
        paddingRight: onProfile ? 8 : 0,
        paddingBottom: 0,
        marginTop: onProfile ? -14 : 0,
      }}
      transparent
      onPress={handleFavorite}>
      <Icon
        style={{
          marginTop: 0,
          paddingTop: 0,
          color: colors.light,
          marginRight: 0,
          fontSize: onProfile ? 36 : 30,
          lineHeight: 40,
        }}
        name={isFav ? 'heart' : 'heart-outline'}
      />
    </Button>
  );
};

export default Favorite;
