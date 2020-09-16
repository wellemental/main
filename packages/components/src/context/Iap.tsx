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
import { AsyncStorage } from 'react-native';
import functions from '@react-native-firebase/functions';
import { LocalStateService } from 'services';

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

  const purchaseUpdateSubscription = useRef(null);
  const purchaseErrorSubscription = useRef(null);

  const processNewPurchase = async (purchase: any) => {
    const { productId, transactionReceipt } = purchase;

    console.log('PROCESSING NEW PURCHASE ***', productId);

    if (transactionReceipt !== undefined) {
      console.log('HAS TRANS RECEIPT, CALLING FUNCTION ***');
      try {
        await functions().httpsCallable('onValidateIap')({
          receipt: transactionReceipt,
          productId: productId,
        });

        storePlanAsync({ planId: productId });
        setActivePlan(productId);
      } catch (err) {
        setProcessing(false);
      }
    }
  };

  useEffect(() => {
    purchaseUpdateSubscription.current = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          console.log('HAS RECEIPT ***');
          try {
            if (Platform.OS === 'ios') {
              finishTransactionIOS(purchase.transactionId);
            }
            await finishTransaction(purchase);
            await processNewPurchase(purchase);
          } catch (ackErr) {
            console.log('ackErr', ackErr);
          }
        }
      },
    );
    purchaseErrorSubscription.current = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('purchaseErrorListener', error);
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
      }}>
      {children}
    </IAPContext.Provider>
  );
};

export default IAPProvider;
