import * as firebase from 'firebase-admin';

import { Collection, Migration } from '../base';

class UpgradeUsersToPro implements Migration {
  public id = '20201007120000_upgrade_testflight_users_to_pro';

  public collection(): Collection {
    return firebase.firestore().collection('users');
  }

  public up = async (
    userDocument: FirebaseFirestore.DocumentSnapshot,
  ): Promise<FirebaseFirestore.UpdateData | null> => {
    const userData = userDocument.data();
    if (
      userData &&
      userData.email !== undefined &&
      userData.plan !== undefined
    ) {
      return null;
    }

    const updates = {
      plan: {
        code: 'TESTING',
        status: 'active',
        type: 'promoCode',
      },
    };

    return updates;
  };

  public down = async (
    userDocument: FirebaseFirestore.DocumentSnapshot,
  ): Promise<FirebaseFirestore.UpdateData | null> => {
    const userData = userDocument.data();
    if (userData && userData.email === undefined) {
      return null;
    }

    const updates = {
      email: firebase.firestore.FieldValue.delete(),
    };

    return updates;
  };
}

export default UpgradeUsersToPro;
