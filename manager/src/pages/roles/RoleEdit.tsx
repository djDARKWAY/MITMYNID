import { useTranslate, Edit, SimpleForm, TextInput, required} from "react-admin";
import ToolbarEditForm from "../../components/general/ToolbarEditForm";

export const RoleEdit = () => {

    const translate = useTranslate();

    return(
    <Edit title={translate('resources.role.edit_title')} mutationMode="pessimistic">
        <SimpleForm toolbar={<ToolbarEditForm/>}>
            <TextInput source="description" label="resources.role.fields.nome" fullWidth validate={required()} />
        </SimpleForm>
    </Edit>
    );

};
