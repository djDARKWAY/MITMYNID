import { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { Typography, Divider, Box, Checkbox } from "@mui/material";
import { Home, ContactMail, Language, Person } from "@mui/icons-material";

const CompaniesCreate = () => {
  const [useEmailAsContact, setUseEmailAsContact] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");

  // Modifica os dados antes de enviar
  const transform = (data: any) => {
    if (useEmailAsContact) {
      data.contact = email;
    }
    return data;
  };

  return (
    <Create transform={transform} title="Criar Empresa">
      <SimpleForm>
        {/* Identificação */}
        <Box>
          <Box display="flex" alignItems="center">
            <Person />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Identificação
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TextInput source="name" label="Nome" validate={required()} fullWidth />
        </Box>

        {/* Localização */}
        <Box mt={3}>
          <Box display="flex" alignItems="center">
            <Home />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Localização
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TextInput source="address" label="Endereço" validate={required()} fullWidth />

          <Box display="flex" gap={2} width="100%">
            <Box sx={{ width: "50%" }}>
              <ReferenceInput
                source="country_id"
                reference="countries"
                label="País"
                perPage={180}
                sort={{ field: "name", order: "ASC" }}
              >
                <SelectInput
                  optionText={(country) => (
                    <Box display="flex" alignItems="center">
                      <img
                        src={country.flag_url}
                        alt={country.name}
                        style={{ width: 20, height: 15, marginRight: 8 }}
                      />
                      {country.name}
                    </Box>
                  )}
                  fullWidth
                />
              </ReferenceInput>
            </Box>
            <TextInput source="city" label="Cidade" validate={required()} sx={{ width: "50%" }} />
          </Box>
          <TextInput source="zip_code" label="Código Postal" validate={required()} fullWidth />
        </Box>

        {/* Contactos */}
        <Box mt={3}>
          <Box display="flex" alignItems="center">
            <ContactMail />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Contactos
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TextInput
            source="email"
            label="Email"
            validate={required()}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />

          <Box display="flex" alignItems="center">
            <Checkbox
              checked={useEmailAsContact}
              onChange={(e) => setUseEmailAsContact(e.target.checked)}
            />
            <Typography>Usar email como contacto</Typography>
          </Box>

          {!useEmailAsContact && (
            <TextInput source="contact" label="Contato" validate={required()} fullWidth />
          )}

          <TextInput source="phone" label="Telefone" validate={required()} fullWidth />
        </Box>

        {/* Website */}
        <Box mt={3}>
          <Box display="flex" alignItems="center">
            <Language />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Website
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TextInput source="website" label="Website" fullWidth />
        </Box>
      </SimpleForm>
    </Create>
  );
};

export { CompaniesCreate };
