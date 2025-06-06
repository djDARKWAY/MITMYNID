import { useEffect, useState } from 'react';
import { TextInput, SelectInput } from "react-admin";
import { fetchUtils } from 'react-admin';

export const AccessPointsFilters = (permissions: string[]) => {
  const [softwareChoices, setSoftwareChoices] = useState<string[]>([]);

  useEffect(() => {
    const fetchSoftwareChoices = async () => {
      try {
        const { json } = await fetchUtils.fetchJson('http://127.0.0.1:13090/access-points/ap-software');
        setSoftwareChoices(json.sort());
      } catch (error) {
        setSoftwareChoices([]);
      }
    };

    fetchSoftwareChoices();
  }, []);

  const filters = [
    <TextInput key="warehouse_name" source="warehouse_name" size="small" label="pos.accessPoints.warehouse_name" fullWidth alwaysOn resettable />,
    <TextInput key="ip_address" source="ip_address" size="small" label="pos.accessPoints.ip_address" fullWidth alwaysOn resettable />,
    <SelectInput key="ap_software" source="ap_software" label="pos.accessPoints.ap_software" choices={softwareChoices.map(software => ({ id: software, name: software }))} fullWidth resettable />,
    <SelectInput key="is_active" source="is_active" label="pos.accessPoints.is_active" choices={[{ id: true, name: "pos.labels.active" }, { id: false, name: "pos.labels.inactive" }, ]} fullWidth resettable />,
  ];
  return filters;
};
