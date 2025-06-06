import { useEffect, useState } from "react";
import { TextInput, SelectInput } from "react-admin";
import { fetchUtils } from "react-admin";

export const CertificatesFilters = (permissions: string[]) => {
  const [issuers, setIssuers] = useState<string[]>([]);

  useEffect(() => {
    const fetchIssuers = async () => {
      try {
        const { json } = await fetchUtils.fetchJson("http://127.0.0.1:13090/certificates/issuers");
        setIssuers(json.sort());
      } catch (error) {
        setIssuers([]);
      }
    };

    fetchIssuers();
  }, []);

  const filters = [
    <TextInput key="name" source="name" size="small" label="pos.certificates.name" fullWidth alwaysOn resettable />,
    <SelectInput key="issuer" source="issuer_name" label="pos.certificates.issuer" choices={issuers.map(issuer => ({ id: issuer, name: issuer }))} fullWidth resettable />,
    <SelectInput key="is_active" source="is_active" label="pos.certificates.is_active" choices={[{ id: false, name: "pos.labels.active" }, { id: true, name: "pos.labels.inactive" }, ]} fullWidth resettable />,
];
  return filters;
};
