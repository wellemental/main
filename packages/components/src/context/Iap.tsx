import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
// import { setActivePlan } from '../actions';
import functions from '@react-native-firebase/functions';
import { LocalStateService, logger } from 'services';
import { useCurrentUser } from '../hooks';
import { PlanId } from '../screens/PlansScreen';

export const IAPContext: React.Context<any> = React.createContext({
  processing: false,
  setProcessing: () => {},
  activePlan: 'free',
  error: '',
});

const localStateService = new LocalStateService();

const storePlanAsync = async (planData: any) => {
  await localStateService.setStorage('wmPlan', planData);
};

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export const IAPProvider = ({ children }: any) => {
  const { user, updateUser } = useCurrentUser();
  const [processing, setProcessing] = useState(false);
  const [activePlan, setActivePlan] = useState('free');
  const [statuses, setStatus] = useState([]);
  const [error, setError] = useState<PurchaseError | string>('');

  // const purchaseUpdateSubscription = useRef(null);
  // const purchaseErrorSubscription = useRef(null);

  const processNewPurchase = async (
    purchase: InAppPurchase | SubscriptionPurchase,
  ) => {
    const { productId, transactionReceipt } = purchase;

    if (transactionReceipt) {
      try {
        if (Platform.OS === 'ios') {
          await functions().httpsCallable('onValidateIap')({
            // data: {
            receipt: transactionReceipt,
            productId: productId,
            // },
          });
        } else if (Platform.OS === 'android') {
          await functions().httpsCallable('onValidateAndroid')({
            // data: {
            sku_id: productId, //purchase.skuId,
            purchase_token: purchase.purchaseToken,
            package_name: 'com.wellemental.wellemental',
            // },
          });
        }

        // Pretty sure this whole thing is useless, but don't want to risk breaking anything so leaving it for now
        try {
          await updateUser({ plan: { status: 'active', planId: productId } });
        } catch (err) {
          logger.error('Error updating user state in local storage');
        }

        // storePlanAsync({ planId: productId });

        setActivePlan(productId);
        setProcessing(false);
      } catch (err) {
        logger.error(
          `Error Validating or updating - ${err.code} - ${err.message}`,
        );
        setProcessing(false);
      }
    } else {
      setStatus((status) => [...status, `ERROR - NO TRANSACTION RECEIPT`]);
      setProcessing(false);
    }
  };

  useEffect(() => {
    const initConnection = async () => {
      try {
        await RNIap.initConnection();
        // we make sure that "ghost" pending payment are removed
        // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      } catch (err) {
        console.warn(err.code, err.message);
      }
    };

    initConnection().then(() => {
      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: InAppPurchase | SubscriptionPurchase) => {
          const receipt = purchase.transactionReceipt;

          if (receipt) {
            try {
              await processNewPurchase(purchase);

              if (Platform.OS === 'ios') {
                finishTransactionIOS(purchase.transactionId);
              } else if (Platform.OS === 'android') {
                // If not consumable
                await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
              }

              // If not consumable
              await finishTransaction(purchase, false);
            } catch (err) {
              logger.error(
                `Error Finishing or Processing Iap - ${
                  err && err.message ? err.message : err
                }`,
              );
            }
          } else {
            // Retry / conclude the purchase is fraudulent, etc...
            setProcessing(false);
          }
        },
      );

      purchaseErrorSubscription = purchaseErrorListener(
        (err: PurchaseError) => {
          logger.error(`purchaseErrorListener - ${error}`);
          setError(err);
          // Alert.alert('purchase error', JSON.stringify(error));
        },
      );
    });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap.endConnection();
    };
  }, []);

  return (
    <IAPContext.Provider
      value={{
        processing: processing,
        setProcessing: setProcessing,
        activePlan: activePlan,
        status: statuses,
        error: error,
      }}>
      {children}
    </IAPContext.Provider>
  );
};

export default IAPProvider;
