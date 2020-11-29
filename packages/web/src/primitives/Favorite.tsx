import React, { useEffect, useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { UpdateUserService } from '../services';
import { useMutation } from '../hooks/useMutation';
import IconButton from '@material-ui/core/IconButton';
import {
  Favorite as FavIcon,
  FavoriteBorder as FavBorder,
} from '@material-ui/icons';

interface Props {
  contentId: string;
  onProfile?: boolean;
}

const Favorite: React.FC<Props> = ({ contentId, onProfile }) => {
  const { auth, user } = useCurrentUser();
  const [isFav, toggleFav] = useState(
    user &&
      user.favorites &&
      user.favorites[contentId] &&
      user.favorites[contentId].favorited,
  );
  const Icon = isFav ? FavIcon : FavBorder;

  const [error, setError] = useState('');

  const service = new UpdateUserService();
  const { loading, mutate } = useMutation(() =>
    service.favorite(auth.uid, contentId, !isFav),
  );

  const handleFavorite = () => {
    try {
      mutate();
      // toggleFav(!isFav);
    } catch (err) {
      setError('Error');
    }
  };

  useEffect(() => {
    toggleFav(
      user &&
        user.favorites &&
        user.favorites[contentId] &&
        user.favorites[contentId].favorited,
    );
  }, [user, contentId]);

  return (
    <IconButton
      disabled={loading}
      style={{
        paddingRight: '0px',
        paddingBottom: '0px',
        marginTop: onProfile ? '-14px' : '0px',
      }}
      onClick={handleFavorite}>
      <Icon
        style={{
          marginTop: 0,
          paddingTop: 0,
          //   color: variables.brandLight,
          marginRight: 0,
          fontSize: onProfile ? 36 : 30,
          lineHeight: 40,
        }}
        name={isFav ? 'heart' : 'heart-outline'}
      />
    </IconButton>
  );
};

export default Favorite;
