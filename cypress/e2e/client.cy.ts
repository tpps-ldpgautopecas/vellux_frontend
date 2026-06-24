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
    cy.get('div[class*="cursor-pointer"]').first().click();
    // 3. Avança para o passo 2 (data/horário)
    cy.contains('Próximo Passo').click();

    // Intercepta a chamada de slots ANTES de qualquer clique
    cy.intercept('GET', '**/appointments/available-slots*').as('fetchSlots');
    const selecionarDiaDisponivel = (offsetDias: number) => {
      if (offsetDias > 14) throw new Error('Nenhum dia disponível nos próximos 14 dias.');
      const data = new Date();
      data.setDate(data.getDate() + offsetDias);
      const dia = data.getDate().toString();
      // Clica no dia do calendário
      cy.get('button.aspect-square')
        .not('[disabled]')
        .contains(new RegExp(`^${dia}$`))
        .click();
      // Aguarda a API responder de verdade
      cy.wait('@fetchSlots').then((interception) => {
        const slots = interception.response?.body?.slots || [];
        if (slots.length === 0) {
          cy.log(`Dia ${dia} cheio, tentando offset +${offsetDias + 1}`);
          selecionarDiaDisponivel(offsetDias + 1);
        }
        // Se tem slots, não faz nada — os comandos seguintes continuam
      });
    };
    selecionarDiaDisponivel(1);
    cy.get('#root select').select('Reparo em Suspensão, Rolamentos e Freios');
    // Agora aguarda os botões de horário — eles JÁ existem pois esperamos a API
    cy.get('button.py-3.border').first().click();
    cy.get('textarea').type('Freio está fazendo um barulho estranho.');
    cy.contains('Confirmar Agendamento').click();
    cy.contains('Solicitação Enviada').should('be.visible');
  });

})
