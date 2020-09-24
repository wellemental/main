import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import {
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

export const IAPContext: React.Context<any> = React.createContext({
  processing: false,
  setProcessing: () => {},
  activePlan: 0,
});

const localStateService = new LocalStateService();

const storePlanAsync = async (planData: any) => {
  await localStateService.setStorage('wmPlan', planData);
};

export const IAPProvider = ({ children }: any) => {
  const { user, updateUser } = useCurrentUser();
  const [processing, setProcessing] = useState(false);
  const [activePlan, setActivePlan] = useState(0);
  const [statuses, setStatus] = useState([]);

  const purchaseUpdateSubscription = useRef(null);
  const purchaseErrorSubscription = useRef(null);

  const processNewPurchase = async (purchase: any) => {
    const { productId, transactionReceipt } = purchase;

    setStatus((status) => [...status, 'Proessing New Purcahase']);
    setStatus((status) => [
      ...status,
      `*** PRODUCT ID ${productId} ** RECEIPT ${!!transactionReceipt}`,
    ]);
    if (transactionReceipt !== undefined) {
      try {
        setStatus((status) => [
          ...status,
          `HAS TRANS RECEIPT, CALLING FUNCTION *** PRODUCTID ${productId} `,
        ]);
        await functions().httpsCallable('onValidateIap')({
          // data: {
          receipt: transactionReceipt,
          productId: productId,
          // },
        });

        if (user) {
          setStatus((status) => [
            ...status,
            `Updated user state in local storage - ${productId} `,
          ]);
          updateUser({ plan: { status: 'active', planId: productId } });
        }

        // storePlanAsync({ planId: productId });
        setActivePlan(productId);
        setProcessing(false);
      } catch (err) {
        setStatus((status) => [...status, `PROCESSING PURCHASE ERR ***${err}`]);
        logger.error(`PROCESSING PURCHASE ERR *** - ${err}`);
        setProcessing(false);
      }
    }
  };

  useEffect(() => {
    purchaseUpdateSubscription.current = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;
        setStatus((status) => [...status, 'Iap Listener Started']);
        if (receipt) {
          setStatus((status) => [...status, `Has receipt`]);

          try {
            if (Platform.OS === 'ios') {
              setStatus((status) => [
                ...status,
                `Finish iOS transaction - TRANSACTION ID ${purchase.transactionId}`,
              ]);
              finishTransactionIOS(purchase.transactionId);
            }
            setStatus((status) => [
              ...status,
              `Finishing Transaction? ${!!purchase} - ${purchase}`,
            ]);

            await finishTransaction(purchase);
            setStatus((status) => [
              ...status,
              'Finished Transaction, going to process purchase',
            ]);
            await processNewPurchase(purchase);
          } catch (err) {
            setStatus((status) => [...status, 'Error finishing transaction']);
            logger.error(`Error Finishing or Processing Iap - ${err}`);
          }
        }
      },
    );
    purchaseErrorSubscription.current = purchaseErrorListener(
      (error: PurchaseError) => {
        setStatus((status) => [
          ...status,
          `Purchase error listener - ${error}`,
        ]);
        logger.error(`purchaseErrorListener - ${error}`);
      },
    );

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.current.remove();
        purchaseUpdateSubscription.current = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.current.remove();
        purchaseErrorSubscription.current = null;
      }
    };
  }, []);

  return (
    <IAPContext.Provider
      value={{
        processing: processing,
        setProcessing: setProcessing,
        activePlan: activePlan,
        status: statuses,
      }}>
      {children}
    </IAPContext.Provider>
  );
};

export default IAPProvider;
