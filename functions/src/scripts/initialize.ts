import * as firebase from 'firebase-admin';

type ENVS = 'dev' | 'prod';

const DATABASES = {
  dev: 'https://dev-wellemental.firebaseio.com',
  prod: `https://prod-wellemental.firebaseio.com`,
};

export const initializeFirebase = (): firebase.app.App | undefined => {
  const env = process.env.FIREBASE as ENVS;
  if (!env) {
    console.log('Missing en variable: FIREBASE');
    return;
  }
  const serviceAccountCertPath = `./serviceAccount.${env}.json`;

  try {
    return firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccountCertPath),
      databaseURL: DATABASES[env],
    });
  } catch (err) {
    console.log(`Failed to initialize Firebase App for env: ${env}`, err);
    console.log(
      `Make sure that "${serviceAccountCertPath}" is present in the same directory as this script. For more information follow: https://firebase.google.com/docs/admin/setup?authuser=1`,
    );
    return;
  }
};
