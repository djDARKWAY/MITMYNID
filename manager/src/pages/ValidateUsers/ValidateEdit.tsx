import { useTranslate, Edit, SimpleForm, TextField, Labeled } from "react-admin";
import { ToolbarValidateForm } from "../../components/general/ToolbarEditForm";

export const ValidateEdit = () => {
  const translate = useTranslate();

  return (
    <Edit title={translate("show.validateUsers.validate")}>
      <SimpleForm toolbar={<ToolbarValidateForm />}>
        <Labeled label={translate("show.validateUsers.person_name")}>
          <TextField source="person_name" />
        </Labeled>
        <Labeled label={translate("show.validateUsers.nif")}>
          <TextField source="nif" />
        </Labeled>
        <Labeled label={translate("show.validateUsers.email")}>
          <TextField source="email" />
        </Labeled>
      </SimpleForm>
    </Edit>
  );
};
