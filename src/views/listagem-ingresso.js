import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/card";
import "../custom.css";
import {api} from "../config/axios";
import { Box, Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PaidIcon from "@mui/icons-material/Paid";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const baseURLEventos = '/eventos';
const baseURLIngressos = '/ingressos';

const itemRowStyle = {
  marginBottom: "10px",
};

function ListagemIngressos() {
  const { idParam } = useParams();

  const idParticipante = Number(localStorage.getItem("idUsuario"));

  const [ingressosExibidos, setIngressosExibidos] = useState([]);

  useEffect(() => {
    async function carregarIngressos() {
      try {
        const [resEventos, resIngressos] = await Promise.all([
          api.get(baseURLEventos),
          api.get(baseURLIngressos),
        ]);

        const eventos = resEventos.data;
        const ingressos = resIngressos.data;

        const meusIngressos = ingressos.filter(
          (i) =>
            Number(i.idEvento) === Number(idParam) &&
            Number(i.idParticipante) === idParticipante &&
            i.status === "PAGO",
        );

        const ingressosCompletos = meusIngressos.map((ing) => {
          const evento = eventos.find(
            (ev) => Number(ev.id) === Number(ing.idEvento),
          );

          const tipoFormatado = ing.tipoIngresso
            ? ing.tipoIngresso.charAt(0).toUpperCase() +
              ing.tipoIngresso.slice(1).toLowerCase()
            : "Inteira";

          return {
            id: ing.id,
            nomeParticipante: ing.nomeParticipante,
            nomeEvento: evento?.nome,
            dataEvento: evento?.dataHoraInicio,
            localEvento: `${evento?.endereco?.cidade} - ${evento?.endereco?.estado}`,

            valor: Number(ing.valor),

            tipoIngresso: tipoFormatado,
            status: ing.status,
          };
        });

        setIngressosExibidos(ingressosCompletos);
      } catch (err) {
        console.error("Erro ao carregar ingressos:", err);
      }
    }

    carregarIngressos();
  }, [idParticipante, idParam]);

  const gerarPDF = async () => {
    const ingresso = document.getElementById("ingresso-pdf");

    const canvas = await html2canvas(ingresso, {
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const largura = 190;

    const altura = (canvas.height * largura) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, largura, altura);

    pdf.save("ingresso.pdf");
  };

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      {ingressosExibidos.length === 0 ? (
        <p>Você não possui ingressos disponíveis.</p>
      ) : (
        <div className="row" style={{ justifyContent: "center" }}>
          {ingressosExibidos.map((ing) => {
            const codigoIngresso = `EVT-${String(ing.id).padStart(6, "0")}`;

            return (
              <div key={ing.id} className="col-lg-6 mb-4">
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,.10)",
                    transition: ".3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,.15)",
                    },
                  }}
                >
                  <Box
                    id="ingresso-pdf"
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: "20px",
                      border: "2px dashed #1976d2",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        background: "linear-gradient(135deg,#1976d2,#0d47a1)",
                        color: "#fff",
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ConfirmationNumberIcon />
                        <h5 style={{ margin: 0, fontWeight: 700 }}>
                          Ingresso Digital
                        </h5>
                      </Box>

                      <div
                        style={{
                          marginTop: 12,
                          fontSize: 24,
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {ing.nomeEvento}
                      </div>
                    </Box>

                    <Box sx={{ p: 3 }}>
                      <div style={itemRowStyle}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EventIcon color="primary" />
                          <strong>Data:</strong>
                          {new Date(ing.dataEvento).toLocaleDateString("pt-BR")}
                        </Box>
                      </div>

                      <div style={itemRowStyle}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon color="primary" />
                          <strong>Horário:</strong>
                          {new Date(ing.dataEvento).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Box>
                      </div>

                      <div style={itemRowStyle}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocationOnIcon color="primary" />
                          <strong>Local:</strong>
                          {ing.localEvento}
                        </Box>
                      </div>

                      <hr />

                      <div style={itemRowStyle}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon color="primary" />
                          <strong>Participante:</strong> {ing.nomeParticipante}
                        </Box>
                      </div>

                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          marginBottom: 15,
                        }}
                      >
                        {ing.nomeParticipante}
                      </div>

                      <div style={itemRowStyle}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <ConfirmationNumberIcon color="primary" />
                          <strong>Tipo:</strong>
                          {ing.tipoIngresso || "Inteira"}
                        </Box>
                      </div>

                      <div style={{ marginBottom: 15 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PaidIcon color="success" />
                          <strong>Valor:</strong>
                          R$ {ing.valor.toFixed(2)}
                        </Box>
                      </div>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 3,
                          mb: 2,
                        }}
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${codigoIngresso}`}
                          alt="QR Code"
                        />
                      </Box>

                      <Box
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "10px",
                          p: 2,
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                            color: "#2e7d32",
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircleIcon />
                          Pagamento Confirmado
                        </Box>

                        <div style={{ marginTop: 8, fontWeight: 600 }}>
                          Código: {codigoIngresso}
                        </div>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={gerarPDF}
                  sx={{ mt: 2 }}
                >
                  Baixar PDF
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ListagemIngressos;
