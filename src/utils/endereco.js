export function formatarCEP(cep){
    const end = cep.replace(/\D/g, '');
    return end.replace(
            /^(\d{5})(\d{3})$/,
            "$1-$2"
    );
}