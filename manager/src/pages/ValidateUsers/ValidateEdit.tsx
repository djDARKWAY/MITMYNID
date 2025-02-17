import { useTranslate, Edit, SimpleForm, useNotify, TextField, Labeled } from "react-admin";
import { ToolbarValidateForm } from "../../components/general/ToolbarEditForm";
import { useTheme } from "@mui/material"
import { url } from "../../App";

function formatLogo(value: any) {
  if (typeof value === "string") { // Value is null or the url string from the backend, wrap it in an object so the form input can handle it
    return { src: url + value };
  } else {  // Else a new image is selected which results in a value object already having a preview link under the url key
    return value;
  }
}

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
