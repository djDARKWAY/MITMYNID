import { useTranslate, Edit, SimpleForm, useNotify, TextField, Labeled } from "react-admin";
import { ToolbarValidateForm } from "../../components/general/ToolbarEditForm";
import { useTheme } from "@mui/material";
import { Box, Typography, Divider } from "@mui/material";

export const ValidateEdit = () => {
  const translate = useTranslate();
  const theme = useTheme();
  const notify = useNotify();

  return (
    <Edit title="resources.utilizadores.validate">
      <SimpleForm toolbar={<ToolbarValidateForm />}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {translate('resources.utilizadores.validation_info')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            • {translate('resources.utilizadores.validation_active')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            • {translate('resources.utilizadores.validation_role')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            • {translate('resources.utilizadores.validation_date')}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        
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
