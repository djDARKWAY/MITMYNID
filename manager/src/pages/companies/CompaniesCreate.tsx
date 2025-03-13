import { useState } from "react";
import {
    Create,
    TabbedForm,
    TextInput,
    required,
    ReferenceInput,
    AutocompleteInput,
    useTranslate
} from "react-admin";
import ToolbarCreateForm from "../../components/general/ToolbarCreateForm";
import { Typography, Box, Divider } from '@mui/material';
import { Home, ContactMail, Language, Person } from "@mui/icons-material";

export const CompaniesCreate = () => {

    const [companyName, setCompanyName] = useState<string>('');
    const [isChecked, setChecked] = useState<boolean>(true);

    const translate = useTranslate();

    const transform = (data: any) => {
        if (isChecked && companyName.length > 0) {
            data.name = companyName;
        }
        return data;
    };

    return (
        <Create transform={transform} title="resources.companies.create_title">
            <TabbedForm defaultValues={{ active: true }} toolbar={<ToolbarCreateForm />}>
                <TabbedForm.Tab label="Identificação">
                    <Box display="flex" alignItems="center">
                        <Person />
                        <Typography variant="h6" sx={{ ml: 1 }}>Identificação</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <TextInput fullWidth source="name" inputProps={{ minLength: 3 }} autoComplete="off" label="resources.companies.fields.name" validate={required()} onChange={e => setCompanyName(e.target.value)} />
                </TabbedForm.Tab>
                
                <TabbedForm.Tab label="Localização">
                    <Box display="flex" alignItems="center">
                        <Home />
                        <Typography variant="h6" sx={{ ml: 1 }}>Localização</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <TextInput source="address" autoComplete="off" label="resources.companies.fields.address" fullWidth />
                    <Box display="flex" gap={2} width="100%" alignItems="center">
                        <Box sx={{ width: "50%" }}>
                            <ReferenceInput source="country_id" reference="countries" label="resources.companies.fields.country_id">
                                <AutocompleteInput fullWidth />
                            </ReferenceInput>
                        </Box>
                        <TextInput source="city" autoComplete="off" label="resources.companies.fields.city" sx={{ width: "50%" }} />
                    </Box>
                    <TextInput source="zip_code" autoComplete="off" label="resources.companies.fields.zip_code" fullWidth />
                </TabbedForm.Tab>

                <TabbedForm.Tab label="Contactos">
                    <Box display="flex" alignItems="center">
                        <ContactMail />
                        <Typography variant="h6" sx={{ ml: 1 }}>Contactos</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <TextInput source="email" autoComplete="off" type="email" label="resources.companies.fields.email" validate={required()} fullWidth />
                    <TextInput source="phone" autoComplete="off" label="resources.companies.fields.phone" fullWidth />
                </TabbedForm.Tab>

                <TabbedForm.Tab label="Website">
                    <Box display="flex" alignItems="center">
                        <Language />
                        <Typography variant="h6" sx={{ ml: 1 }}>Website</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <TextInput source="website" autoComplete="off" label="resources.companies.fields.website" fullWidth />
                </TabbedForm.Tab>
            </TabbedForm>
        </Create>
    );
};
