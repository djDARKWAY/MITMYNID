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
          Gestão de certificados
        </Typography>

        <section>
          <Typography paragraph>
            A gestão de certificados digitais representa um componente crítico
            do sistema, garantindo a segurança e autenticidade das comunicações
            entre os pontos de acesso e os serviços associados. Esta
            funcionalidade assegura que todos os certificados permanecem
            válidos, atualizados e devidamente vinculados às respetivas
            entidades ou pontos de acesso.
          </Typography>
          <Typography paragraph>
            Através deste módulo, os administradores conseguem controlar o ciclo
            de vida dos certificados – desde a sua inserção e consulta, até à
            renovação ou remoção – minimizando o risco de falhas de
            autenticação, expiração não detetada ou vulnerabilidades
            relacionadas com certificados desatualizados.
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
            Painel de certificados
          </Typography>
          <Typography paragraph>
            O painel de certificados apresenta uma listagem detalhada de todos
            os certificados registados no sistema, permitindo aos utilizadores
            visualizarem rapidamente o estado de cada um. Com funcionalidades de
            pesquisa por palavras-chave e filtros por estado (ativo, a expirar,
            expirado ou inativo), este painel foi desenhado para facilitar a
            monitorização contínua e eficiente.
          </Typography>
          <Typography paragraph>
            A interface permite ainda a execução de ações rápidas diretamente da
            listagem, como visualizar detalhes, editar ou eliminar um
            certificado, otimizando os fluxos de trabalho e reduzindo o número
            de cliques necessários para tarefas administrativas frequentes.
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
            Consulta detalhada de certificados
          </Typography>
          <Typography paragraph>
            A funcionalidade de consulta detalhada oferece uma visão completa
            sobre cada certificado digital armazenado no sistema. Entre os dados
            exibidos incluem-se: o período de validade (data de início e fim), a
            entidade certificadora responsável pela emissão, a entidade a que o
            certificado está associado internamente, o ponto de acesso
            correspondente, e ainda o histórico de alterações e responsável pela
            última modificação.
          </Typography>
          <Typography paragraph>
            Esta consulta detalhada permite aos gestores técnicos e
            administradores validarem facilmente a integridade e pertinência dos
            certificados, especialmente útil em contextos de auditoria ou
            resolução de problemas.
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
            Edição de certificados
          </Typography>
          <Typography paragraph>
            O sistema permite a edição dos dados de qualquer certificado
            existente, o que é essencial em casos de renovações, alterações
            administrativas ou correções de dados.
          </Typography>
          <Typography paragraph>
            Para maior controlo, existe uma aba dedicada à substituição do
            certificado propriamente dito, permitindo que o utilizador carregue
            uma nova versão do mesmo, sem comprometer as ligações ou integrações
            previamente configuradas. Esta abordagem facilita a gestão de
            certificados com prazos curtos de validade ou com requisitos de
            substituição periódica.
          </Typography>
        </section>
      </StyledFaqContent>
      <FaqShortcutMenu />
    </StyledFaqContainer>
  );
};

export default FaqMap;
