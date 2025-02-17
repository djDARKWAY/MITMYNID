export type imageData = {
    data : string,
    name : string,
    src ?: string
} | string;

export type JWT = {
    id: string,
    person_name: string,
    roles: string[],
    iat: number,
    exp: number
}

export type PostgresError = {
    length: number,
    severity: string,
    code: string,
    detail: string,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: string,
    table: string,
    column: undefined,
    dataType: undefined,
    constraint: string,
    file: string,
    line: string,
    routine: string
}