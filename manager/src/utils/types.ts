import { DataProvider, RaRecord } from "react-admin";

export type ThemeName = "light" | "dark";

type GetEveryParams = {
  filter: object;
  limit?: number;
  sort?: {
    order: string;
    field: string;
  };
  meta?: object;
};

type GetEveryResult<RecordType extends RaRecord = any> = {
  data: RecordType[];
  total?: number;
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};

// type NoParamsResult<RecordType extends RaRecord = any> = {
//     data: RecordType;
// }

export interface DataProviderWithCustomMethods extends DataProvider {
  /**
   * Em norma a função "create" do dataProvider espera que um id seja retornado com o registo criado, porém,
   * nem sempre esse é o caso, e nesses caso utilizamos este componente
   *  @remark neId - not expecting Id
   */
  getEvery: <RecordType extends RaRecord = any>(
    resource: string,
    params?: GetEveryParams
  ) => Promise<GetEveryResult<RecordType>>;
}

export type imageData = {
  data: string | undefined;
  path: string;
};

export type fileTypes = {
  [key: string]: string;
};

export type Identity = {
  id: string;
  fullName: string;
  entidade: string;
  avatar: string;
};

export type jwtObject = {
  id: string;
  person_name: string;
  roles: string[];
  iat: number;
  exp: number;
};

export interface Users extends RaRecord {
  id: string;
  person_name: string;
  username: string;
  address?: string | null;
  nif?: string | null;
  nic?: string | null;
  cc?: string | null;
  email: string | null;
  phone?: string | null;
  mobile?: string | null;
  password?: string | null;
  photo?: string | null;
  active?: boolean | null;
  validation_date?: string | null;
  last_access?: string | null;
  roles?: Array<Roles> | string[];
}

export interface Roles extends RaRecord {
  id: string;
  description: string;
  app_id?: number;
}

export interface Certificates extends RaRecord {
  id: string;
  name: string;
  file_path: string;
  issue_date: string;
  expiration_date: string;
  issuer_name: string;
  is_active: boolean;
}
export interface AccessPoint extends RaRecord {
  id: string;
  location_description: string;
  ip_address: string;
  ap_software: string;
  is_active: boolean;
  company_id: string;
}
