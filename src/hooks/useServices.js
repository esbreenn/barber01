import { useEffect, useMemo, useState } from 'react';
import { subscribeServices } from '../services/serviceService';

function useServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = subscribeServices(setServices);
    } catch (err) {
      console.error('Error subscribing to services:', err);
    }
    return () => unsubscribe && unsubscribe();
  }, []);

  const servicePrices = useMemo(() => (
    services.reduce((acc, s) => {
      acc[s.nombre] = s.precio;
      return acc;
    }, {})
  ), [services]);

  return { services, servicePrices };
}

export default useServices;

