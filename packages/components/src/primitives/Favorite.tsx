import React, { useState } from 'react';
import { Button, Icon } from 'native-base';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { UpdateUserService } from 'services';
import { useMutation } from '../hooks/useMutation';
import Spinner from './Spinner';
import Error from './Error';
import variables from '../assets/native-base-theme/variables/wellemental';

interface Props {
  contentId: string;
}

const Favorite: React.FC<Props> = ({ contentId }) => {
  const { user } = useCurrentUser();
  const [isFav, toggleFav] = useState(
    user &&
      user.actions &&
      user.actions[contentId] &&
      user.actions[contentId].favorited,
  );

  const [error, setError] = useState();
  const service = new UpdateUserService();
  const { loading, mutate } = useMutation(() =>
    service.favorite(user.id, contentId, !isFav),
  );

  const handleFavorite = () => {
    try {
      mutate();
      toggleFav(!isFav);
    } catch (err) {
      setError('Error');
    }
  };

  return (
    <Button iconRight disabled={loading} transparent onPress={handleFavorite}>
      <Icon
        style={{
          marginHorizontal: 0,
          paddingHorizontal: 10,
          color: variables.brandLight,
          fontSize: 30,
          position: 'absolute',
          right: 0,
        }}
        name={isFav ? 'heart' : 'heart-outline'}
      />
    </Button>

    //   {/* <Error error={error} /> */}
  );
};

export default Favorite;
