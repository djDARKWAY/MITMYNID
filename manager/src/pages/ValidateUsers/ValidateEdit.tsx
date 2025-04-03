import { useTranslate, Edit, SimpleForm, useNotify, TextField, Labeled } from "react-admin";
import { ToolbarValidateForm } from "../../components/general/ToolbarEditForm";
import { useTheme } from "@mui/material"

export const ValidateEdit = () => {
  const translate = useTranslate();
  const theme = useTheme();
  const notify = useNotify();

  return (
    <Edit title="resources.utilizadores.validate">
      <SimpleForm toolbar={<ToolbarValidateForm />}>
        <Labeled>
          <TextField source="person_name" />
        </Labeled>
        <Labeled>
          <TextField source="nif" />
        </Labeled>
        <Labeled>
          <TextField source="email" />
        </Labeled>
      </SimpleForm>
    </Edit>
  );
};
