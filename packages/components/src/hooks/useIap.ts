import { useContext } from 'react';
import { IAPContext } from '../context/Iap';

export const useIap = () => useContext(IAPContext);
