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
          color={theme.palette.mode === "dark" ? "primary.light" : "primary.dark"}
          sx={{ mb: 3 }}
        >
          Mapa geográfico
        </Typography>

        <section>
          <Typography paragraph>
            A funcionalidade de mapa geográfico proporciona uma visualização intuitiva e interativa das entidades registadas no sistema. Para isso, utiliza a camada base do OpenStreetMap, que permite navegar num mapa realista e detalhado.
          </Typography>
          <Typography paragraph>
            Cada entidade que possui coordenadas geográficas válidas aparece representada por um marcador no mapa. Esta representação facilita a identificação rápida da localização e da distribuição espacial das entidades, o que é especialmente útil para planear visitas, gerir operações logísticas ou monitorizar áreas de interesse.
          </Typography>
          <Typography paragraph>
            Quando o utilizador acede ao mapa, o sistema pode pedir permissão para obter a sua localização atual. Esta funcionalidade é usada para calcular a distância direta (em linha reta) entre a posição do utilizador e cada entidade. O cálculo recorre à fórmula haversine, que considera a curvatura da Terra para fornecer uma estimativa precisa da distância em quilómetros.
          </Typography>
        </section>

        <section>
          <Typography
            variant="h6"
            component="h3"
            color={theme.palette.mode === "dark" ? "primary.light" : "primary.dark"}
            sx={{ mb: 1 }}
          >
            Informações nos marcadores
          </Typography>
          <Typography paragraph>
            Ao interagir com um marcador, abre-se uma janela informativa que apresenta os dados essenciais sobre a entidade, permitindo ao utilizador obter rapidamente os detalhes relevantes sem sair do mapa.
          </Typography>
          <ul>
            <li>Nome completo da entidade;</li>
            <li>Localização, incluindo a cidade e o distrito;</li>
            <li>Código postal completo;</li>
            <li>Distância estimada, em quilómetros;</li>
            <li>Link direto para a página da entidade.</li>
          </ul>
        </section>

        <section>
          <Typography
            variant="h6"
            component="h3"
            color={theme.palette.mode === "dark" ? "primary.light" : "primary.dark"}
            sx={{ mb: 1 }}
          >
            Filtragem disponível
          </Typography>
          <Typography paragraph>
            Para melhorar a experiência de navegação e permitir que o utilizador encontre rapidamente as entidades que procura, o mapa dispõe de dois filtros principais:
          </Typography>
          <ul>
            <li>
              Pesquisa por entidade: permite ao utilizador inserir termos, como nomes ou parte deles, para restringir os marcadores exibidos no mapa apenas às entidades correspondentes.
            </li>
            <li>
              Filtro por raio geográfico: possibilita definir um limite de distância em quilómetros a partir da localização atual (ou outra definida) do utilizador, mostrando apenas as entidades que se encontram dentro desse perímetro.
            </li>
          </ul>
        </section>
      </StyledFaqContent>
      <FaqShortcutMenu />
    </StyledFaqContainer>
  );
};

export default FaqMap;
