/// <reference types="cypress" />


const API = "http://localhost:8080/api/v1";


const campo = (rotulo) =>
  cy.contains("label", rotulo).parent().find("input, select, textarea");

const preencher = (rotulo, valor) =>
  campo(rotulo).clear().type(valor);

const preencherNumero = (rotulo, valor) =>
  campo(rotulo).type(`{selectall}${valor}`);

const dataFutura = (dias) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

const lerFaixaDoPorte = () =>
  cy
    .contains("small", "Faixa permitida")
    .invoke("text")
    .then((txt) => {
      const [min, max] = txt.match(/\d+/g).map(Number);
      return { min, max };
    });

function preencherFormularioValido(nome) {
  preencher("Nome do Evento", nome);
  campo("Modalidade").select("PRESENCIAL");
  campo("Tipo de Evento").select(1); 
  preencher("Descrição", "Evento criado pelo teste funcional automatizado.");
  preencherNumero("Valor do Ingresso", "50");
  preencherNumero("Idade Mínima", "18");
  campo("Porte do Evento").select(1);

  lerFaixaDoPorte().then(({ min }) => {
    preencherNumero("Lotação Máxima", String(Math.max(min, 1)));
  });

  preencher("Data de Início", dataFutura(30));
  preencher("Hora de Início", "19:00");
  preencher("Data de Fim", dataFutura(30));
  preencher("Hora de Fim", "23:00");

  preencher("CEP", "36570-000");
  preencher("Logradouro", "Av. P. H. Rolfs");
  preencher("Número", "100");
  preencher("Bairro", "Centro");
  preencher("Cidade", "Viçosa");
  preencher("Estado", "MG");
}

function loginPelaTela() {
  cy.session("usuario-teste", () => {
    cy.visit("/");
    cy.env(["EMAIL", "SENHA"]).then(({ EMAIL, SENHA }) => {
      cy.get('input[name="email"]').type(EMAIL);
      cy.get('input[type="password"]').type(SENHA, { log: false });
    });
    cy.contains("button", "Entrar").click();
    cy.location("pathname").should("eq", "/listagem-eventos");
  });
}

describe("Tela de Cadastro de Evento", () => {
  context("Usuário autenticado", () => {
    beforeEach(() => {
      loginPelaTela();
      cy.visit("/cadastro-eventos");
      cy.contains("Cadastrar Evento").should("be.visible");
    });

    it("CF01 - cadastra evento com dados válidos e redireciona para Eventos Organizados", () => {
      cy.intercept("POST", `${API}/eventos`).as("criarEvento");

      preencherFormularioValido(`Evento Cypress ${Date.now()}`);
      cy.contains("button", "Salvar").click();

      cy.wait("@criarEvento").its("response.statusCode").should("be.oneOf", [200, 201]);
      cy.get(".toast-success").should("contain", "cadastrado com sucesso");
      cy.location("pathname").should("eq", "/eventos-organizados");
    });

    it("CF02 - bloqueia idade mínima menor que 18 sem chamar a API", () => {
      cy.intercept("POST", `${API}/eventos`).as("criarEvento");

      preencherFormularioValido(`Evento Idade ${Date.now()}`);
      preencherNumero("Idade Mínima", "17");
      cy.contains("button", "Salvar").click();

      cy.get(".toast-error").should(
        "contain",
        "A idade mínima deve ser maior ou igual a 18 anos."
      );
      cy.get("@criarEvento.all").should("have.length", 0);
      cy.location("pathname").should("eq", "/cadastro-eventos");
    });

    it("CF03 - rejeita evento com nome em branco (erro devolvido pela API)", () => {
      preencherFormularioValido("Temporario");
      campo("Nome do Evento").clear();
      cy.contains("button", "Salvar").click();

      cy.get(".toast-error").should("be.visible");
      cy.location("pathname").should("eq", "/cadastro-eventos");
    });

    it("CF04 - rejeita evento com data de fim anterior à data de início", () => {
      preencherFormularioValido(`Evento Datas ${Date.now()}`);
      preencher("Data de Fim", dataFutura(10));
      cy.contains("button", "Salvar").click();

      cy.get(".toast-error").should("be.visible");
      cy.location("pathname").should("eq", "/cadastro-eventos");
    });

    it("CF05 - rejeita lotação acima da faixa permitida pelo porte", () => {
      preencherFormularioValido(`Evento Lotacao ${Date.now()}`);

      lerFaixaDoPorte().then(({ max }) => {
        preencherNumero("Lotação Máxima", String(max + 1));
      });
      cy.contains("button", "Salvar").click();

      cy.get(".toast-error").should("be.visible");
      cy.location("pathname").should("eq", "/cadastro-eventos");
    });

    it("CF06 - botão Cancelar volta para Eventos Organizados", () => {
      cy.contains("button", "Cancelar").click();
      cy.location("pathname").should("eq", "/eventos-organizados");
    });
  });

  context("Usuário não autenticado", () => {
    it("CF07 - acesso direto sem login redireciona para a tela de login", () => {
      cy.clearAllLocalStorage();
      cy.visit("/cadastro-eventos");
      cy.location("pathname").should("eq", "/");
      cy.contains("button", "Entrar").should("be.visible");
    });
  });
});
