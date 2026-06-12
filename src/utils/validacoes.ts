import { mensagemErro } from '../components/toastr';

interface Props {
  dataNascimento: string;
  cpf: string;
  celular: string;
  senha: string;
}

export default function validarDados({dataNascimento, cpf, celular, senha} : Props){
    const senhaValida = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
    const cpfValido = /^\d{11}$/; 
    const celularValido = /^\d{11}$/;
    const celularCom9 = /^9/;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = dataNascimento.split('-').map(Number);
    const nascimento = new Date(ano, mes - 1, dia); 
    if (!cpfValido.test(cpf)) {
      mensagemErro("CPF inválido ou incompleto.");
      return;
    }
    if (!celularValido.test(celular) || !celularCom9.test(celular.substring(2))) {
        mensagemErro("Celular inválido. Use um número móvel que comece com 9 após o DDD.");
        return;
    }

    if (!senhaValida.test(senha)) {
      mensagemErro("A senha deve conter letra maiúscula, minúscula, número e caractere especial.");
      return;
    }
    if (nascimento >= hoje) {
      mensagemErro("A data de nascimento deve ser menor que a data de hoje.");
      return;
    }
}