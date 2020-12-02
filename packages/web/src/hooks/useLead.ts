import { useContext } from 'react';
import { Lead } from '../context/Lead';

export const useLead = () => {
  const leadContext = useContext(Lead);
  if (!leadContext) throw new Error('Current User missing from context');
  return {
    lead: leadContext.lead,
    setLead: leadContext.setLead,
    plan: leadContext.plan,
    setPlan: leadContext.setPlan,
  };
};
