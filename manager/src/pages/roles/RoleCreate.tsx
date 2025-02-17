import { Create, SimpleForm, TextInput, required, useTranslate } from "react-admin";
import ToolbarCreateForm from "../../components/general/ToolbarCreateForm";

export const RoleCreate = () => {

    const translate = useTranslate();

    return(
    <Create title={translate('resources.role.create_title')}>
        <SimpleForm toolbar={<ToolbarCreateForm/>}>
            <TextInput source="description" fullWidth label="resources.role.fields.nome" validate={required()} />
        </SimpleForm>
     </Create>
     );
};