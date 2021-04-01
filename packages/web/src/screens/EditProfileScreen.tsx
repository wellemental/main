import React, { useState } from 'react';
import { Error, Box, PageHeading, Button, ToggleButtons } from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { UpdateUserService } from '../services';
import { UserProfile, Languages } from 'common';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditProfileScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const [language, setLanguage] = useState(
    user && user.language ? user.language : Languages.En,
  );

  // Snackbar alert
  const [snack, setSnack] = React.useState<'success' | 'error' | undefined>();
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack(undefined);
    // setOpen(false);
  };

  // Only submit what's changed upon saving
  const newProfile: UserProfile = {};

  if (user && language !== user.language) {
    newProfile.language = language;
  }

  const service = new UpdateUserService(); //container.getInstance<ProfileService>('profileService');

  const { loading, error: mutateError, mutate } = useMutation(() =>
    service.updateProfile(user.id, newProfile),
  );

  const handleUpdate = async () => {
    mutate(
      () => setSnack('success'),
      () => setSnack('error'),
    );
  };

  return (
    <>
      <PageHeading title={translation['Select language']} />
      <Box>
        <ToggleButtons
          buttons={[Languages.En, Languages.Es]}
          state={language && language}
          setState={setLanguage}
        />

        <Box mt={2}>
          <Button
            fullWidth
            onClick={handleUpdate}
            loading={loading}
            disabled={!language}
            text={translation['Save Changes']}
          />
        </Box>
        <Error error={mutateError} />

        <Snackbar open={!!snack} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={!!snack ? snack : 'success'}>
            {snack === 'success'
              ? translation['Changes saved']
              : translation['Error. Please try again.']}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default EditProfileScreen;
