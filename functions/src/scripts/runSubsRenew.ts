import { initializeFirebase } from './initialize';
import { renewOrCancelSubscriptions } from '../subscriptions/renewOrCancel';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  try {
    await renewOrCancelSubscriptions();

    return Promise.resolve();
  } catch (err) {
    console.log('ERROR', err);
    return Promise.reject();
  }
};

run().catch(err => {
  console.log(err);
});
