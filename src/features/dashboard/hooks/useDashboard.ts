import { useState, useEffect } from 'react';
import { DashboardRepository } from '../repository/DashboardRepository';

export const useDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await DashboardRepository.getSummary();
      setData(result);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return { data, isLoading };
};
