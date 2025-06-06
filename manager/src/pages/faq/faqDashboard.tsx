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

const FaqDashboard = () => {
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
          Dashboard
        </Typography>

        <section>
          <Typography paragraph>
            O dashboard constitui o ponto central de controlo e monitorização do
            sistema, fornecendo uma visão consolidada e atualizada dos seus
            principais componentes. Este painel agrega múltiplas secções
            funcionais, otimizadas para uma leitura rápida do estado do ambiente
            e das entidades geridas.
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
            Estado dos serviços
          </Typography>
          <Typography paragraph>
            Esta secção apresenta o estado atual dos serviços críticos
            associados à plataforma Domibus, nomeadamente a Base de Dados, o JMS
            Broker e os Quartz Triggers. Cada serviço é identificado por um
            indicador de estado, com representação visual através de cores:
            verde (Normal), amarelo (Alerta), vermelho (Crítico), cinzento
            (Offline) ou com um ícone de carregamento quando está a estabelecer
            ligação. O utilizador pode atualizar as informações manualmente
            através do botão de refresh.
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
            Access Points
          </Typography>
          <Typography paragraph>
            Lista os pontos de acesso (Access Points) associados às entidades
            registadas, com possibilidade de filtragem por estado: ativos,
            inativos ou todos. A visualização inclui um gráfico do tipo “rosca”
            que representa a proporção de Access Points ativos face aos
            inativos, permitindo uma análise rápida do estado geral da rede de
            comunicações.
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
            Certificados
          </Typography>
          <Typography paragraph>
            Exibe os certificados presentes no sistema, com filtros aplicáveis
            aos estados: ativos, a caducar nos próximos 30 dias e inativos. Esta
            segmentação facilita a gestão do ciclo de vida dos certificados e
            permite a identificação de potenciais riscos relacionados com
            validade.
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
            Entidades
          </Typography>
          <Typography paragraph>
            Indica o total de entidades registadas no sistema, como empresas e
            estruturas logísticas, bem como um resumo das últimas alterações ou
            inserções efetuadas. A listagem permite acompanhar a evolução do
            ecossistema em tempo real.
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
            Registos
          </Typography>
          <Typography paragraph>
            Apresenta os registos recentes de atividade do sistema, com destaque
            para eventos como erros, autenticações e modificações. Esta área
            fornece uma visão de auditoria essencial para diagnóstico e análise
            operacional.
          </Typography>
        </section>
      </StyledFaqContent>
      <FaqShortcutMenu />
    </StyledFaqContainer>
  );
};

export default FaqDashboard;
