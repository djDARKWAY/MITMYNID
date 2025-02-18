import { Entity, model, property } from "@loopback/repository";

@model({
  settings: {
    strict: false,
    postgresql: {
      table: "pedidos_remocao",
    },
  },
})
export class PedidosRemocao extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "id",
      dataType: "integer",
      nullable: "NO",
    },
  })
  id: number;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "email_cliente",
      dataType: "text",
    },
  })
  email_cliente: string;

  @property({
    type: "string",
    jsonSchema: {
      type: "string",
      nullable: true,
    },
    postgresql: {
      columnName: "motivo",
      dataType: "text",
    },
  })
  motivo?: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "ip_cliente",
      dataType: "text",
    },
  })
  ip_cliente: string;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "code",
      dataType: "text",
    },
  })
  code: string;

  @property({
    type: "date",
    required: true,
    defaultFn: "now",
    postgresql: {
      columnName: "data_pedido",
      dataType: "timestamp with time zone",
    },
  })
  data_pedido: string;

  @property({
    type: "date",
    jsonSchema: {
      type: "string",
      nullable: true,
    },
    postgresql: {
      columnName: "data_confirm",
      dataType: "timestamp with time zone",
    },
  })
  data_confirm?: string;

  constructor(data?: Partial<PedidosRemocao>) {
    super(data);
  }
}

export interface PedidosRemocaoRelations {
  // describe navigational properties here
}

export type PedidosRemocaoWithRelations = PedidosRemocao &
  PedidosRemocaoRelations;
