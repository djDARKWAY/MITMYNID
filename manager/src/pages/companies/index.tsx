import { CompaniesList } from "./CompaniesList";
import { CompaniesShow } from "./CompaniesShow";
import { CompaniesEdit } from "./CompaniesEdit";
import { CompaniesCreate } from "./CompaniesCreate";

export const companies = (permissions?: string[]) => {
  let companies = null;

  if (!permissions) return companies;

  switch (true) {
    case permissions.includes("ADMIN"): {
      companies = {
        list: CompaniesList,
        show: CompaniesShow,
        edit: CompaniesEdit,
        create: CompaniesCreate,
      };
      break;
    }
  }

  return companies;
};
