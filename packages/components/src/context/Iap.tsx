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
// import functions from '@react-native-firebase/functions';
import { LocalStateService, logger, functions } from 'services';
import { useCurrentUser } from '../hooks';

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

  const processNewPurchase = async (purchase: any) => {
    const { productId, transactionReceipt } = purchase;

    setStatus((status) => [...status, '^^^Processing New Purcahase^^^']);
    setStatus((status) => [
      ...status,
      `PRODUCT ID ${productId} - RECEIPT ${!!transactionReceipt}`,
    ]);
    if (transactionReceipt) {
      try {
        setStatus((status) => [
          ...status,
          `Has transaction Receipt, Calling iapValidate Function`,
        ]);
        const validateResult = await functions().httpsCallable('onValidateIap')(
          {
            // data: {
            receipt: transactionReceipt,
            productId: productId,
            // },
          },
        );

        setStatus((status) => [
          ...status,
          `iapValidate Succeeded! - Validated Receipt - ${validateResult} `,
        ]);

        try {
          setStatus((status) => [
            ...status,
            `Updating user state in local storage - ${JSON.stringify({
              plan: { status: 'active', planId: productId },
            })} `,
          ]);

          await updateUser({ plan: { status: 'active', planId: productId } });
          setStatus((status) => [...status, `Local storage updated!`]);
        } catch (err) {
          setStatus((status) => [
            ...status,
            `Error updating user state in local storage - ${err} `,
          ]);
        }

        // storePlanAsync({ planId: productId });
        setStatus((status) => [
          ...status,
          `Setting active plan state ${productId}`,
        ]);
        setActivePlan(productId);
        setProcessing(false);
      } catch (err) {
        setStatus((status) => [
          ...status,
          `Error Validating or updating - ${err.code} - ${err.message}`,
        ]);
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
        setStatus((status) => [...status, `Initiating connection?`]);
        const result = await RNIap.initConnection();
        setStatus((status) => [...status, `isIniated? ${result}`]);
        setStatus((status) => [...status, `Starting Android Flush`]);
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        setStatus((status) => [...status, `Starting Android Flush`]);
      } catch (err) {
        console.warn(err.code, err.message);
      }
    };

    initConnection().then(() => {
      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: InAppPurchase | SubscriptionPurchase) => {
          const receipt = purchase.transactionReceipt;
          setStatus((status) => [...status, 'Iap Listener Started']);
          if (receipt) {
            setStatus((status) => [...status, `Has receipt`]);

            try {
              setStatus((status) => [
                ...status,
                `Processing Puchase? ${!!purchase} - ${purchase}`,
              ]);
              await processNewPurchase(purchase);

              if (Platform.OS === 'ios') {
                setStatus((status) => [
                  ...status,
                  `Finish iOS transaction - TRANSACTION ID ${purchase.transactionId}`,
                ]);
                finishTransactionIOS(purchase.transactionId);
              } else if (Platform.OS === 'android') {
                // If not consumable
                // acknowledgePurchaseAndroid(purchase.purchaseToken);
              }

              setStatus((status) => [
                ...status,
                `Finishing Transaction? ${!!purchase} - ${purchase}`,
              ]);

              // If not consumable
              await finishTransaction(purchase, false);
              setStatus((status) => [...status, 'Finished Transaction']);
            } catch (err) {
              setStatus((status) => [
                ...status,
                `Error Finishing or Processing Iap - ${
                  err && err.message ? err.message : err
                }`,
              ]);
              logger.error(
                `Error Finishing or Processing Iap - ${
                  err && err.message ? err.message : err
                }`,
              );
            }
          } else {
            // Retry / conclude the purchase is fraudulent, etc...
            setStatus((status) => [...status, 'No receipt, should retry']);
            setProcessing(false);
          }
        },
      );

      purchaseErrorSubscription = purchaseErrorListener(
        (err: PurchaseError) => {
          setStatus((status) => [
            ...status,
            `Purchase error listener - ${error}`,
          ]);
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
