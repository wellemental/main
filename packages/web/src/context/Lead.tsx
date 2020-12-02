import React, { useState } from 'react';

export const Lead = React.createContext<any>({
  lead: null,
  setLead: null,
});

export type PlanPrice = {
  id: string;
  stripeId: string | undefined;
  price: number;
  trialLength: number;
};

export const plans: { [key: string]: PlanPrice } = {
  monthly: {
    id: 'monthly',
    stripeId: process.env.REACT_APP_STRIPE_PLAN_MONTHLY,
    price: 6.99,
    trialLength: 0,
  },
  yearly: {
    id: 'yearly',
    stripeId: process.env.REACT_APP_STRIPE_PLAN_YEARLY,
    price: 59.99,
    trialLength: 0,
  },
};

export const LeadProvider: React.FC = ({ children }) => {
  const [lead, setLead] = useState(null);
  const [plan, togglePlan] = useState(plans.monthly);

  const setPlan = (newPlan: 'monthly' | 'yearly') => {
    if (plans[newPlan]) {
      togglePlan(plans[newPlan]);
    }
  };

  return (
    <Lead.Provider
      value={{
        lead,
        setLead,
        plan,
        setPlan,
      }}>
      {children}
    </Lead.Provider>
  );
};
