import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'native-base';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { UpdateUserService } from 'services';
import { useMutation } from '../hooks/useMutation';
import variables from '../assets/native-base-theme/variables/wellemental';

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

  const [error, setError] = useState();

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
    <Button
      iconRight
      disabled={loading}
      style={{
        paddingRight: 0,
        paddingBottom: 0,
        marginTop: onProfile ? -14 : 0,
      }}
      transparent
      onPress={handleFavorite}>
      <Icon
        style={{
          marginTop: 0,
          paddingTop: 0,
          color: variables.brandLight,
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
