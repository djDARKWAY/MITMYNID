import { Entity, model, property } from "@loopback/repository";

@model({
  settings: {
    postgresql: { schema: "status", table: "log_type" },
  },
})
export class LogType extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "id",
      dataType: "serial",
    },
  })
  id?: number;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "type",
      dataType: "varchar",
      dataLength: 50,
    },
  })
  type: string;

  @property({
    type: "string",
    postgresql: {
      columnName: "description",
      dataType: "text",
    },
  })
  description?: string;

  constructor(data?: Partial<LogType>) {
    super(data);
  }
}

export interface LogTypeRelations {
  // describe navigational properties here
}

export type LogTypeWithRelations = LogType & LogTypeRelations;
