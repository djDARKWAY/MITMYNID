import { Paper, styled } from "@mui/material";

const StyledFaqContent = styled(Paper)(({ theme }) => ({
  margin: "0 auto 2rem auto",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 16px rgba(0,0,0,0.15)"
      : "0 2px 16px rgba(0,0,0,0.08)",
  lineHeight: "1.6",
  textAlign: "justify",
  flex: 1,
  backgroundColor: theme.palette.background.paper,
  animation: "faqMenuFadeIn 0.35s cubic-bezier(0.4,0,0.2,1)",
  "@keyframes faqMenuFadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(30px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  [theme.breakpoints.down("md")]: {
    margin: 0,
    padding: theme.spacing(2),
    borderRadius: 0,
    width: '100%',
    maxWidth: '100%',
  },
}));

export default StyledFaqContent;
