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
          Dispositivos de rede
        </Typography>

        <section>
          <Typography paragraph>
            A gestão dos pontos de acesso é um elemento central no controlo das
            comunicações entre entidades, uma vez que é através destes
            dispositivos que ocorrem as ligações e a transmissão de dados dentro
            do sistema.
          </Typography>
        </section>

        <section>
          <Typography
            variant="h6"
            component="h3"
            color={
              theme.palette.mode === "dark" ? "primary.light" : "primary.dark"
            }
            sx={{ mb: 1 }}
          >
            Painel de pontos de acesso
          </Typography>
          <Typography paragraph>
            O sistema disponibiliza um painel de gestão onde é apresentada uma
            listagem completa dos pontos de acesso registados. Esta interface
            inclui funcionalidades de pesquisa e filtragem, que facilitam a
            identificação rápida de entradas específicas. A partir deste painel,
            o utilizador pode aceder diretamente às ações de criação, edição,
            visualização ou remoção de pontos de acesso, com suporte para
            operações pontuais ou em massa, conforme os critérios definidos.
          </Typography>
        </section>

        <section>
          <Typography
            variant="h6"
            component="h3"
            color={
              theme.palette.mode === "dark" ? "primary.light" : "primary.dark"
            }
            sx={{ mb: 1 }}
          >
            Consulta detalhada
          </Typography>
          <Typography paragraph>
            A funcionalidade de consulta detalhada permite visualizar, de forma
            estruturada, todos os dados associados a um ponto de acesso
            específico. São apresentados elementos como a descrição geográfica
            ou física, o endereço IP, a entidade associada, os certificados
            digitais vinculados, os parâmetros técnicos de configuração e o
            estado atual do dispositivo.
          </Typography>
        </section>

        <section>
          <Typography
            variant="h6"
            component="h3"
            color={
              theme.palette.mode === "dark" ? "primary.light" : "primary.dark"
            }
            sx={{ mb: 1 }}
          >
            Edição de pontos de acesso
          </Typography>
          <Typography paragraph>
            Através da funcionalidade de edição (ver Anexo D), é possível
            modificar de forma intuitiva os dados de um ponto de acesso. A
            interface foi desenhada para garantir clareza e eficiência nas
            alterações, promovendo uma gestão segura e controlada da informação.
          </Typography>
        </section>
      </StyledFaqContent>
      <FaqShortcutMenu />
    </StyledFaqContainer>
  );
};

export default FaqMap;
