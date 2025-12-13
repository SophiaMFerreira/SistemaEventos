import { useState, useEffect } from "react";
import { Paper, Chip, Grid, ListItemText, ListItem,  List, Typography} from "@mui/material";

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';


function Lista({ idEvento }) {
    const baseURL = `${BASE_URL_S}/ingresso`;
    const baseURLparticipanteCPF = `${BASE_URL_S}/participanteCPF`;
    const baseURLparticipanteCNPJ = `${BASE_URL_S}/participanteCNPJ`;
    
    const [ingressos, setIngressos] = useState([]);
    const [participantes, setParticipantes] = useState({});
    const [ordenacao, setOrdenacao] = useState("nome");

    useEffect(() => {
        axios.get(baseURL).then((response) => {
        setIngressos(response.data || []);
    });
    }, [baseURL]);

    useEffect(() => {
    const ingressosEvento = ingressos.filter(
        (i) => i.idEvento === Number(idEvento)
    );

    if (ingressosEvento.length === 0) return;

    async function carregarParticipantes() {
      const mapa = {};
      await Promise.all(
            ingressosEvento.map(async (ingresso) => {
                try {
                    if (ingresso.idParticipanteCPF) {
                        const res = await axios.get(
                            `${baseURLparticipanteCPF}/${ingresso.idParticipanteCPF}`
                        );
                        mapa[ingresso.id] = res.data.nome;
                    }
                    if (ingresso.idParticipanteCNPJ) {
                        const res = await axios.get(
                            `${baseURLparticipanteCNPJ}/${ingresso.idParticipanteCNPJ}`
                        );
                        mapa[ingresso.id] = res.data.nomeFantasia;
                    }
                } catch (e) {
                  console.error(e);
                }
            })
      );
      setParticipantes(mapa);
    }
    carregarParticipantes();
    }, [ingressos, idEvento, baseURLparticipanteCPF, baseURLparticipanteCNPJ]);
    
    const ingressosOrdenados = [...ingressos]
    .filter(i => i.idEvento === Number(idEvento))
    .sort((a, b) => {
    if (ordenacao === "nome") {
        return (participantes[a.id] || "").localeCompare(
            participantes[b.id] || ""
        );
    }
    if (ordenacao === "status") {
        return Number(b.pago) - Number(a.pago);
    }
    return 0;
    });

  return (
      <Grid item xs={12} md={6} sx={{ px: { xs: 1, sm: 3, md: 4 }, py: { xs: 1, sm: 2 } }}>
          <Paper elevation={3} sx={{borderRadius: 2, maxHeight: { xs: 250, sm: 300, md: 350 }, overflowY: "auto"}}>
                <List disablePadding>
                  {ingressosOrdenados.length === 0 ? (<Typography sx={{ p: 2 }} color="text.secondary">Nenhum participante inscrito neste evento.</Typography>) : (
                      ingressosOrdenados.map((ingresso) => (
                          <ListItem key={ingresso.id} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 1}} 
                          secondaryAction={<Chip label={ingresso.pago ? "Pago" : "A pagar"} color={ingresso.pago ? "default" : "success"} size="small"/>}>
                              <ListItemText primary={participantes[ingresso.id] || "Carregando..."}/>
                          </ListItem>
                      ))
                   )}
                </List>
        </Paper>
      </Grid>
  );
}

export default Lista;