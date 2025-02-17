import { TextInput } from "react-admin";

export const userFilters = (permissions : string[]) => {

    let filters = [
        <TextInput source="person_name" size="small" label={'pos.labels.search'} fullWidth alwaysOn resettable={true}/>,
    ];

    switch(true){
        case permissions.includes('ADMIN'):
            filters.push();
            break;
        default:
            break;
    }

    return filters;

}