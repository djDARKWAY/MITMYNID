import { useEffect } from 'react';
import { ReferenceArrayInput, required, SelectArrayInput, SelectArrayInputProps, useRecordContext } from 'react-admin';
import { Roles } from '../../utils/types';


const RolesInput = (props: SelectArrayInputProps) => {

    const record = useRecordContext();
    
    useEffect(() => {

        if(!record) return;

        if(record.roles && record.roles.length>0){

            if(record.roles.some((obj : Roles) => {return typeof obj.description !=='undefined' ? true : false})){
                record.tempRoles = record.roles
                record.roles_ids = record.roles.map((role : Roles) => role.id);
            }

        }

    }, [record]);

    return (
        <ReferenceArrayInput
            source="roles_ids"
            reference="roles"
        >
            <SelectArrayInput
                label="resources.utilizadores.fields.roles"
                optionText={"description"}
                optionValue={"id"}
                {...props} 
                validate={required()}
                fullWidth
                variant='standard'
            />
        </ReferenceArrayInput>
    );
};

RolesInput.defaultProps = {
    source: 'roles',
    resource: 'users',
};

export default RolesInput;