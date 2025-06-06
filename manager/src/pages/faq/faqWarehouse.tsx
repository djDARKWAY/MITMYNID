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

const FaqWarehouse = () => {
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
          Painel de entidades
        </Typography>

        <section>
          <Typography paragraph>
            O painel de entidades disponibiliza uma lista completa e detalhada
            de todas as entidades registadas no sistema, incluindo empresas,
            armazéns, centros de distribuição e outras unidades logísticas
            relevantes. Esta funcionalidade foi concebida para facilitar a
            gestão eficiente dos dados, permitindo ao utilizador filtrar e
            pesquisar com rapidez entre centenas ou milhares de registos.
          </Typography>
          <Typography paragraph>
            Para além da simples listagem, o painel integra ferramentas
            avançadas de pesquisa e filtros por critérios variados, como nome,
            localização, tipo de entidade ou estado, o que agiliza
            significativamente a localização de registos específicos. Desta
            forma, gestores e operadores podem tomar decisões informadas com
            base em dados atualizados e facilmente acessíveis.
          </Typography>
          <Typography paragraph>
            A partir deste painel, é possível também iniciar operações
            essenciais como a criação de novas entidades, a edição de
            informações já existentes ou a consulta detalhada de cada registo,
            tudo isto numa interface intuitiva e responsiva.
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
            Visualização e consulta de detalhes
          </Typography>
          <Typography paragraph>
            Cada entidade pode ser selecionada para uma visualização detalhada,
            onde são exibidos de forma clara e organizada todos os dados
            relevantes, tais como localização geográfica, estado atual da
            entidade, contactos para comunicação e histórico de alterações
            realizadas no registo.
          </Typography>
          <Typography paragraph>
            Esta visualização permite ao utilizador obter um panorama completo
            da entidade sem necessidade de entrar no modo de edição, o que ajuda
            a evitar alterações acidentais e facilita a rápida consulta de
            informações essenciais para a tomada de decisão.
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
            Edição e eliminação de entidades
          </Typography>
          <Typography paragraph>
            O sistema oferece ferramentas robustas para atualizar e corrigir os
            dados das entidades, garantindo que toda a informação permanece
            atual e fiável. A edição pode ser realizada de forma individual,
            permitindo modificar qualquer campo necessário para refletir
            alterações operacionais ou administrativas.
          </Typography>
          <Typography paragraph>
            Além disso, o painel suporta a eliminação múltipla de entidades, um
            recurso especialmente útil para manutenção e limpeza de dados, que
            permite remover vários registos de uma só vez de forma rápida e
            segura, reduzindo o risco de erros e melhorando a organização global
            do sistema.
          </Typography>
        </section>
      </StyledFaqContent>
      <FaqShortcutMenu />
    </StyledFaqContainer>
  );
};

export default FaqWarehouse;
