import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';

function BoxInfoEvento({nomeEvento,
                        dataInicioEvento,
                        horaInicioEvento,
                        dataFimEvento,
                        horaFimEvento,
                        cep,
                        logradouro,
                        bairro,
                        cidade,
                        estado,
                        numero,
                        complemento,
                        infoLateral,  
                        lotacaoMaxima,
                        statusPagamento
                                        }) {
    let mensagem = "";
    let valor = "";

    if (infoLateral === "Participantes") {
        mensagem = "Lotação máxima";
        valor = lotacaoMaxima;
    }
    if (infoLateral === "Dados evento") {
        mensagem = "Status Pagamento";
        valor = statusPagamento ? "Pago" : "A pagar";
    }

    const formatarData = (data) => {
        if (!data) return "";
            const [ano, mes, dia] = data.split("-");
            return `${dia}/${mes}/${ano}`;
    };

    return (
        <Grid sx={{px: { xs: 2, sm: 4, md: 6 }, py: 2, boxSizing: "border-box"}}>
            <Typography variant="h2" id="titulo" sx={{fontSize: { xs: "1.6rem", sm: "2rem" }, mb: 3}}>{nomeEvento}</Typography>
            <Grid  container direction="row" spacing={2} size={10}>
                <Grid container direction="column" size="grow" spacing={1} sx={{px: { xs: 0, sm: 3 }, py: 1, alignItems: "center", alignItems: "flex-start"}}>
                    <Grid  container direction="row" spacing={1} sx={{minHeight: 48, alignItems: "flex-start"}}>
                        <InsertInvitationOutlinedIcon size={1}/>
                        <Typography variant="body1" textAlign="left"><span className="destaqueAzul">{formatarData(dataInicioEvento)} - {horaInicioEvento}</span> -  {formatarData(dataFimEvento)} - {horaFimEvento}</Typography>
                        <Grid size="grow"/>
                    </Grid>
                    <Grid  container direction="row" spacing={1} sx={{minHeight: 48, alignItems: "flex-start"}}>
                        <FmdGoodOutlinedIcon/>
                        <Typography variant="body1" textAlign="left"><span className="destaqueAzul">CEP: {cep} - {logradouro} {numero}, {bairro} - {cidade}, {estado} {complemento && ` (${complemento})`}</span></Typography>
                        <Grid size="grow"/>
                    </Grid>
                </Grid>
                <Grid container direction="column" spacing={1} sx={{px: { xs: 0, sm: 3 }, py: 1, alignItems: "flex-end" }}>
                    <Typography variant="body1" textAlign="rigth" className="destaqueLaranja" sx={{ textAlign: { xs: "left", sm: "right" } }}>{mensagem}</Typography>
                    <Typography variant="body1" textAlign="rigth" className="destaqueLaranja" sx={{ textAlign: { xs: "left", sm: "right" } }}>{valor}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}
export default BoxInfoEvento;
