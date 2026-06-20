import { mensagemErro } from '../components/toastr';

export default function validarDados(dataNascimento, cpf, celular, senha, confirmarSenha){
    const senhaValida = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
    const cpfValido = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; 
    const celularValido = /^\(\d{2}\)\s9\d{4}-\d{4}$/;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = dataNascimento.split('-').map(Number);
    const nascimento = new Date(ano, mes - 1, dia); 

    if (!cpfValido.test(cpf)) {
      mensagemErro("CPF inválido ou incompleto.");
      return;
    }
    if (!celularValido.test(celular)) {
        mensagemErro("Celular inválido. Use um número móvel que comece com 9 após o DDD.");
        return;
    }

    if (!senhaValida.test(senha)) {
      mensagemErro("A senha deve conter letra maiúscula, minúscula, número e caractere especial.");
      return;
    }

    if (senha !== confirmarSenha) {
          mensagemErro("As senhas não coincidem");
          return;
    }
        
    if (nascimento >= hoje) {
      mensagemErro("A data de nascimento deve ser menor que a data de hoje.");
      return;
    }

    return true;
}

export function validarQuantidades(quantidadeMin, quantidadeMax){
    if (quantidadeMin < 0) {
      mensagemErro("Valores quantitativos mínimos negativos não são permitidos.");
      return;
    } else if (quantidadeMax < 1) {
      mensagemErro("Valores quantitativos máximos menores que 1 não são permitidos.");
      return;
    } else if (quantidadeMin > quantidadeMax) {
        mensagemErro("Quantidade máxima menor que o mínimo");
        return;
    }
    return true;
}