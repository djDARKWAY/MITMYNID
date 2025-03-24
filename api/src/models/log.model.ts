import { Entity, model, property, belongsTo } from "@loopback/repository";
import { LogType } from "./log-type.model";

@model({
  settings: {
    postgresql: { schema: "status", table: "log" },
  },
})
export class Log extends Entity {
  @property({
    type: "number",
    id: true,
    generated: true,
    postgresql: {
      columnName: "id",
      dataType: "serial",
      nullable: "NO",
    },
  })
  id?: number;

  @belongsTo(
    () => LogType,
    { name: "type" },
    {
      postgresql: {
        columnName: "type_id",
        dataType: "integer",
        nullable: "NO",
      },
    }
  )
  type_id: number;

  @property({
    type: "string",
    required: true,
    postgresql: {
      columnName: "message",
      dataType: "text",
      nullable: "NO",
    },
  })
  message: string;

  @property({
    type: "date",
    required: true,
    postgresql: {
      columnName: "timestamp",
      dataType: "timestamp with time zone",
      nullable: "NO",
    },
  })
  timestamp: string;

  @property({
    type: "object",
    postgresql: {
      columnName: "metadata",
      dataType: "jsonb",
      nullable: "YES",
    },
  })
  metadata?: object;

  constructor(data?: Partial<Log>) {
    super(data);
  }
}

export interface LogRelations {
  // describe navigational properties here
}

export type LogWithRelations = Log & LogRelations;
