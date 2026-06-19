import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";

const flexRowStyle = {
  display: "flex",
  gap: 1,
};

function BoxInfoEvento({
  nomeEvento,
  dataInicioEvento,
  dataFimEvento,
  cep,
  logradouro,
  bairro,
  cidade,
  estado,
  numero,
  complemento,
  infoLateral,
  lotacaoMaxima,
  statusPagamento,
}) {
  let mensagem = "";
  let valor = "";

  if (infoLateral === "Participantes") {
    mensagem = "Capacidade máxima"; 
    valor = lotacaoMaxima;
  }

  if (infoLateral === "Dados evento") {
    mensagem = "Status do pagamento";
    valor = statusPagamento ? "Pago" : "A pagar";
  }

  const formatarData = (dataHora) => {
    if (!dataHora) return "";
    return new Date(dataHora).toLocaleDateString("pt-BR");
  };

  const formatarHora = (dataHora) => {
  if (!dataHora) return "";

  const hora = new Date(dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [h, m] = hora.split(":");

  return `${parseInt(h, 10)}h${m}`;
};

  return (
    <Box
      sx={{
        backgroundColor: "#f9fafb",
        borderRadius: 3,
        padding: 3,
        mb: 3,
      }}
    >
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        {nomeEvento}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ ...flexRowStyle, alignItems: "center", mb: 2 }}>
            <InsertInvitationOutlinedIcon color="primary" />
            <Typography variant="body1">
              <strong>
                {formatarData(dataInicioEvento)} {formatarHora(dataInicioEvento)}
              </strong>{" "}
              — {formatarData(dataFimEvento)} {formatarHora(dataFimEvento)}
            </Typography>
          </Box>

          <Box sx={{ ...flexRowStyle, alignItems: "flex-start" }}>
            <FmdGoodOutlinedIcon color="primary" />
            <Typography variant="body2" color="text.secondary">
              CEP {cep} — {logradouro}, {numero}
              <br />
              {bairro} — {cidade}/{estado}
              {complemento && ` (${complemento})`}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 2,
              padding: 2,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {mensagem}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
              color={
                valor === "Pago"
                  ? "success.main"
                  : valor === "A pagar"
                  ? "warning.main"
                  : "text.primary"
              }
            >
              {valor}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BoxInfoEvento;
