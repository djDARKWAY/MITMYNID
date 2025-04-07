import { WarehousesList } from "./WarehousesList";
import { WarehousesShow } from "./WarehousesShow";
import { WarehousesEdit } from "./WarehousesEdit";
import { WarehousesCreate } from "./WarehousesCreate";

export const warehouses = (permissions?: string[]) => {
  let warehouses = null;

  if (!permissions) return warehouses;

  switch (true) {
    case permissions.includes("ADMIN"): {
      warehouses = {
        list: WarehousesList,
        show: WarehousesShow,
        edit: WarehousesEdit,
        create: WarehousesCreate,
      };
      break;
    }
  }

  return warehouses;
};
