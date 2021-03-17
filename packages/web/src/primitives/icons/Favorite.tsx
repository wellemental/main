import React, { useEffect, useState, useRef } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useMutation } from '../../hooks/useMutation';
import { useQuery } from '../../hooks/useQuery';
import { useContainer } from '../../hooks/useContainer';
import IconButton from '@material-ui/core/IconButton';
import { FavoritesServiceType } from 'common';
import {
  Favorite as FavIcon,
  FavoriteBorder as FavBorder,
} from '@material-ui/icons';
import { brandColors } from '../../assets/styles/theme';
import logger from '../../services/LoggerService';

interface Props {
  contentId: string;
  onProfile?: boolean;
}

const Favorite: React.FC<Props> = ({ contentId, onProfile }) => {
  const { auth, user } = useCurrentUser();
  const [isFav, toggleFav] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const Icon = isFav ? FavIcon : FavBorder;

  // const [error, setError] = useState('');

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
    <IconButton
      disabled={loading}
      style={{
        padding: '5px',
        height: '38px',
        marginTop: onProfile ? '-1px' : '11px',
      }}
      onClick={handleFavorite}>
      <Icon
        style={{
          marginTop: 0,
          paddingTop: 0,
          marginRight: 0,
          fontSize: onProfile ? 36 : 30,
          lineHeight: 40,
          color: brandColors.brandLight,
        }}
        name={isFav ? 'heart' : 'heart-outline'}
      />
    </IconButton>
  );
};

export default Favorite;
