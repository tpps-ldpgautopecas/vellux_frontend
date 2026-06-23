describe('Fluxo do Cliente', () => {
  beforeEach(() => {
    // Faz o login real via API e guarda o token
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'cypress@gmail.com',
      password: '@Cypress123',
    }).then((response) => {
      // Injeta o token real e o perfil no localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });
    cy.visit('/');
  });

  it('deve permitir cadastro de veículo se estiver logado', () => {
    cy.contains('Acesso Cliente').should('be.visible');


    cy.get('#root svg.group-hover\\:text-\\[\\#F6911F\\]').click();


    cy.get('#root input[placeholder="Ex: Porsche, Ferrari, BMW..."]').click();
    cy.get('#root input[placeholder="Ex: Porsche, Ferrari, BMW..."]').type('Audi');
    cy.get('#root input[placeholder="Ex: 911 Turbo S, M5..."]').click();
    cy.get('#root input[placeholder="Ex: 911 Turbo S, M5..."]').type('A3 1.6 3p');
    cy.get('#root input[placeholder="ABC-1234"]').click();
    cy.get('#root input[placeholder="ABC-1234"]').type('OVO-1234');
    cy.get('#root input[placeholder="2024"]').click();
    cy.get('#root input[placeholder="2024"]').type('2025');
    cy.get('#root input[placeholder="Ex: Grigio Telesto, Rosso Corsa..."]').click();
    cy.get('#root input[placeholder="Ex: Grigio Telesto, Rosso Corsa..."]').type('Cinza');
    cy.get('#root button.group').click();


  });

  it('deve mostrar erro ao cadastrar veículo existente se estiver logado', function () {
    cy.contains('Acesso Cliente').should('be.visible');


    cy.get('#root svg.group-hover\\:text-\\[\\#F6911F\\]').click();


    cy.get('#root input[placeholder="Ex: Porsche, Ferrari, BMW..."]').click();
    cy.get('#root input[placeholder="Ex: Porsche, Ferrari, BMW..."]').type('Audi');
    cy.get('#root input[placeholder="Ex: 911 Turbo S, M5..."]').click();
    cy.get('#root input[placeholder="Ex: 911 Turbo S, M5..."]').type('A3 1.6 3p');
    cy.get('#root input[placeholder="ABC-1234"]').click();
    cy.get('#root input[placeholder="ABC-1234"]').type('OVO-1234');
    cy.get('#root input[placeholder="2024"]').click();
    cy.get('#root input[placeholder="2024"]').type('2025');
    cy.get('#root input[placeholder="Ex: Grigio Telesto, Rosso Corsa..."]').click();
    cy.get('#root input[placeholder="Ex: Grigio Telesto, Rosso Corsa..."]').type('Cinza');
    cy.get('#root button.group').click();

    cy.contains('Placa ou Chassi já cadastrados').should('be.visible');

  });

  it('deve permitir ver detalhes/histórico de um veículo se estiver logado', function () {
    cy.get('#root button.\\!px-6').click();
    cy.contains('Histórico').should('be.visible');
  });

  it('deve permitir realizar um agendamento para um veículo se estiver logado', function () {
    cy.contains('Garagem').should('be.visible');

    cy.get('#root button.w-full').click();
    cy.get('#root div.flex.gap-4').click();
    cy.get('#root button.group').click();

    // Calcula o próximo dia (amanhã) dinamicamente
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dia = amanha.getDate().toString(); // Ex: "24"
    // Clica no botão cujo texto é exatamente o número do dia

    cy.get('#root button').contains(new RegExp(`^${dia}$`)).click();

    cy.get('#root select.border').select('Reparo em Suspensão, Rolamentos e Freios');
    cy.get('#root div.grid-cols-3 button:nth-child(1)').click();
    cy.get('#root textarea.border').click();
    cy.get('#root textarea.border').type('Freio está fazendo um barulho estanho.');
    cy.get('#root div.justify-center').click();

    cy.contains('Solicitação Enviada').should('be.visible');
  });
});
