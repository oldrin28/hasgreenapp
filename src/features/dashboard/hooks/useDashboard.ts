import { useState } from 'react';
import { ProfileRepository } from '../../profile/repository/ProfileRepository';
import { DevicesRepository } from '../../devices/repository/DevicesRepository';
import { PatientsRepository } from '../../patients/repository/PatientsRepository';
import { GatewaysRepository } from '../../gateways/repository/GatewaysRepository';

export const useDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [profile, devices, patients, gateways] = await Promise.all([
        ProfileRepository.getProfile().catch(() => null),
        DevicesRepository.getDevices().catch(() => []),
        PatientsRepository.getPatients().catch(() => []),
        GatewaysRepository.getGateways().catch(() => []),
      ]);

      const onlineGateways = gateways.filter(g => {
        return g.gateway_last_activity_timestamp && 
          (Date.now() / 1000 - Number(g.gateway_last_activity_timestamp) < 900);
      }).length;
      
      const offlineGateways = gateways.length - onlineGateways;

      const activeDevices = devices.filter(d => d.device_status === 1 || d.device_status === '1').length;
      const inactiveDevices = devices.length - activeDevices;

      const recentGateways = gateways.map(g => {
        const isOnline = g.gateway_last_activity_timestamp && 
          (Date.now() / 1000 - Number(g.gateway_last_activity_timestamp) < 900);
        return {
          name: g.gateway_name || 'Sin Nombre',
          location: g.gateway_location || 'Sin Ubicación',
          ip: g.gateway_ip_address || '0.0.0.0',
          status: isOnline ? 'Activo' : 'Offline'
        };
      });

      const recentDevices = devices.map(d => {
        const patient = patients.find(p => String(p.id) === String(d.patient_id));
        const patientName = patient ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim() : 'no asignado';
        return {
          name: d.device_name || 'Sin Nombre',
          location: d.device_location || 'Sin Ubicación',
          status: (d.device_status === 1 || d.device_status === '1') ? 'Activo' : 'Inactivo',
          type: d.device_type || 'Desconocido',
          patientName: patientName,
          uid: d.device_unique_id || 'N/A'
        };
      });

      setData({
        user: {
          name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuario' : 'Usuario'
        },
        gateways: {
          total: gateways.length,
          online: onlineGateways,
          offline: offlineGateways,
          faulty: 0
        },
        devices: {
          total: devices.length,
          active: activeDevices,
          inactive: inactiveDevices
        },
        analytics: [80, 60, 90, 75, 85],
        recentGateways,
        recentDevices
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, fetchDashboardData };
};
