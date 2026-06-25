import { useState, useEffect } from "react";
import {
  Paper,
  Chip,
  Grid,
  ListItemText,
  ListItem,
  List,
  Typography,
} from "@mui/material";

import {api} from "../config/axios";

function Lista({ idEvento }) {
  const baseURL = '/ingressos';
  const [ingressos, setIngressos] = useState([]);
  const [ordenacao, setOrdenacao] = useState("nome");

  useEffect(() => {
    api.get(baseURL).then((response) => {
      setIngressos(response.data || []);
    });
  }, [baseURL]);

  const ingressosOrdenados = [...ingressos]
    .filter((i) => i.idEvento === Number(idEvento))
    .sort((a, b) => {
      if (ordenacao === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }
      if (ordenacao === "status") {
        return Number(b.pago) - Number(a.pago);
      }
      return 0;
    });

  return (
    <Grid
      item
      xs={12}
      md={6}
      sx={{ px: { xs: 1, sm: 3, md: 4 }, py: { xs: 1, sm: 2 } }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          maxHeight: { xs: 250, sm: 300, md: 350 },
          overflowY: "auto",
        }}
      >
        <List disablePadding>
          {ingressosOrdenados.length === 0 ? (
            <Typography sx={{ p: 2 }} color="text.secondary">
              Nenhum participante inscrito neste evento.
            </Typography>
          ) : (
            ingressosOrdenados.map((ingresso) => (
              <ListItem
                key={ingresso.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <ListItemText
                  primary={ingresso.nomeParticipante}
                  secondary={`Ingresso #${ingresso.id}`}
                />

                <Chip
                  label={
                    ingresso.status === "PAGO"
                      ? "Pago"
                      : ingresso.status === "RESERVADO"
                        ? "Pendente"
                        : "Cancelado"
                  }
                  color={
                    ingresso.status === "PAGO"
                      ? "success"
                      : ingresso.status === "RESERVADO"
                        ? "warning"
                        : "error"
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Grid>
  );
}

export default Lista;
