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
  const [processing, setProcessing] = useState(false);
  const [activePlan, setActivePlan] = useState(0);
  const [statuses, setStatus] = useState([]);

  const purchaseUpdateSubscription = useRef(null);
  const purchaseErrorSubscription = useRef(null);

  const processNewPurchase = async (purchase: any) => {
    const { productId, transactionReceipt } = purchase;

    setStatus((status) => [...status, 'Proessing New Purcahase']);
    logger.info(
      `PROCESSING NEW PURCHASE *** PRODUCT ID ${productId} ** RECEIPT ${transactionReceipt}`,
    );
    if (transactionReceipt !== undefined) {
      setStatus((status) => [
        ...status,
        'HAS TRANS RECEIPT, CALLING FUNCTION ***',
      ]);
      console.log('HAS TRANS RECEIPT, CALLING FUNCTION ***');

      try {
        await functions().httpsCallable('onValidateIap')({
          receipt: transactionReceipt,
          productId: productId,
        });

        storePlanAsync({ planId: productId });
        setActivePlan(productId);
      } catch (err) {
        setStatus((status) => [...status, `PROCESSING PURCHASE ERR ***`]);
        logger.error(`PROCESSING PURCHASE ERR *** - ${err}`);
        setProcessing(false);
      }
    }
  };

  useEffect(() => {
    purchaseUpdateSubscription.current = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;
        setStatus((status) => [...status, 'Listener Started']);
        if (receipt) {
          setStatus((status) => [...status, `Has receipt`]);
          logger.info('HAS RECEIPT ***');

          try {
            if (Platform.OS === 'ios') {
              finishTransactionIOS(purchase.transactionId);
            }
            setStatus((status) => [...status, 'Finishing Transaction?']);
            await finishTransaction(purchase);
            await processNewPurchase(purchase);
          } catch (ackErr) {
            setStatus((status) => [...status, 'Error finishing transaction']);
            logger.error(`ackErr - ${ackErr}`);
            // console.log('ackErr', ackErr);
          }
        }
      },
    );
    purchaseErrorSubscription.current = purchaseErrorListener(
      (error: PurchaseError) => {
        setStatus((status) => [...status, 'Purchase error listener']);
        logger.error(`purchaseErrorListener - ${error}`);
        console.log('PURCHASE LISTEN ERROR', error);
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
