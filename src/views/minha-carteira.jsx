
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Skeleton,
  Divider,
} from "@mui/material";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

import axios, { BASE_URL } from "../config/axios";
import { mensagemErro } from "../components/toastr";

function MinhaCarteira() {
  const [saldo, setSaldo] = useState(0);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarCarteira() {
      try {
        const [saldoRes, movimentacoesRes] = await Promise.all([
          axios.get(`${BASE_URL}/carteira`),
          axios.get(`${BASE_URL}/carteira/movimentacoes`),
        ]);

        setSaldo(Number(saldoRes.data));
        setMovimentacoes(movimentacoesRes.data);
      } catch (error) {
        console.error("Erro ao carregar carteira:", error);
        mensagemErro("Não foi possível carregar sua carteira.");
      } finally {
        setCarregando(false);
      }
    }

    carregarCarteira();
  }, []);

  const formatarMoeda = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatarData = (dataHora) => {
    if (!dataHora) return "";

    return new Date(dataHora).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (carregando) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 15, px: 3 }}>
        <Skeleton variant="rounded" height={190} sx={{ borderRadius: 4, mb: 4 }} />
        <Skeleton variant="text" width={250} height={40} />
        <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
        <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box
  sx={{
    maxWidth: 1000,
    mx: "auto",
    mt: 13,
    mb: 5,
    p: 4,
    backgroundColor: "#fff",
    borderRadius: 3,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  }}
>
     <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
       Minha Carteira
      </Typography>

      {/* Cartão de saldo */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #0B3B91, #1E66F5)",
          color: "#fff",
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          mb: 5,
          boxShadow: "0 8px 24px rgba(11,59,145,0.18)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountBalanceWalletOutlinedIcon />
          <Typography variant="body1" fontWeight={600}>
            Saldo disponível
          </Typography>
        </Stack>

        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mt: 2, mb: 1 }}
        >
          {formatarMoeda(saldo)}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          EVENT + · Sua carteira digital
        </Typography>
      </Paper>

      {/* Histórico */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Histórico de Movimentações
      </Typography>

      {movimentacoes.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            border: "1px solid #eee",
          }}
        >
          <AccountBalanceWalletOutlinedIcon
            sx={{ fontSize: 45, color: "#aaa", mb: 1 }}
          />

          <Typography color="text.secondary">
            Você ainda não possui movimentações na carteira.
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #eee",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {movimentacoes.map((movimentacao, index) => {
            const credito = movimentacao.tipo === "CREDITO";

            return (
              <Box key={movimentacao.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 2.5,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        backgroundColor: credito ? "#E8F5E9" : "#FFEBEE",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {credito ? (
                        <ArrowDownwardRoundedIcon sx={{ color: "#2E7D32" }} />
                      ) : (
                        <ArrowUpwardRoundedIcon sx={{ color: "#D32F2F" }} />
                      )}
                    </Box>

                    <Box>
                      <Typography fontWeight={700}>
                        {credito ? "Crédito" : "Débito"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {movimentacao.idIngresso
                          ? `Ingresso ${movimentacao.idIngresso}`
                          : "Movimentação da carteira"}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatarData(movimentacao.dataHora)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    fontWeight={700}
                    color={credito ? "success.main" : "error.main"}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {credito ? "+" : "−"} {formatarMoeda(movimentacao.valor)}
                  </Typography>
                </Box>

                {index < movimentacoes.length - 1 && <Divider />}
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
}

export default MinhaCarteira;
