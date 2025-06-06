import FaqShortcutMenu from "./faqMenu";
import { Box, Typography, styled, useTheme } from "@mui/material";
import StyledFaqContent from "../../components/layout/StyledFaqContent";

const StyledFaqContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  width: "calc(100% - 280px)",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    display: "block",
  },
}));

const FaqMap = () => {
  const theme = useTheme();

  return (
    <StyledFaqContainer>
      <StyledFaqContent>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          color={
            theme.palette.mode === "dark" ? "primary.light" : "primary.dark"
          }
          sx={{ mb: 3 }}
        >
          Vincular ficheiros
        </Typography>

        <section>
          <Typography paragraph>
            O sistema disponibiliza uma funcionalidade que permite a importação
            direta dos ficheiros necessários à configuração de certificados
            digitais. Esta operação foi pensada para agilizar o processo de
            associação de certificados a pontos de acesso ainda não
            configurados.
          </Typography>
          <Typography paragraph>
            Através da interface, o utilizador pode carregar os três ficheiros
            essenciais:
          </Typography>
          <Typography component="ul" sx={{ pl: 3 }}>
            <li>
              Certificado do Servidor (SC) – identifica o servidor e assegura a
              comunicação segura.
            </li>
            <li>
              Certificado da Autoridade Certificadora Intermédia (CA) – valida a
              confiança no certificado do servidor.
            </li>
            <li>
              Chave Privada – necessária para garantir a autenticação segura
              entre sistemas.
            </li>
          </Typography>
        </section>
      </StyledFaqContent>
      <FaqShortcutMenu />
    </StyledFaqContainer>
  );
};

export default FaqMap;
