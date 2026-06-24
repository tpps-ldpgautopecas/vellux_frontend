describe('Fluxo do Admin', () => {
  it('deve ter rotas bloqueadas sem autenticação admin', () => {
    // Garante que não há sessão ativa
    cy.clearLocalStorage();
    cy.visit('/');

    // O dashboard do admin NÃO deve existir
    cy.contains('AdminDashboard').should('not.exist');


    // A landing page deve estar visível
    cy.contains('Vellux Motors').should('be.visible');
    cy.contains('Oficina de Alta Engenharia').should('be.visible');

    // O botão de Entrar deve estar disponível (usuário não está logado)
    cy.contains('Entrar').should('be.visible');
  });

  it('deve exibir dashboard ao logar como admin', () => {
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'arthuradmin@gmail.com',
      password: 'vellux123',
    }).then((response) => {
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });

    cy.visit('/');

    // O painel admin deve aparecer
    cy.contains('Administrador').should('be.visible');
  });

  it('deve navegar nas abas do dashboard', () => {
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'arthuradmin@gmail.com',
      password: 'vellux123',
    }).then((response) => {
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });
    cy.visit('/');
    // O painel admin deve aparecer
    cy.contains('Administrador').should('be.visible');


    cy.get('#root button:nth-child(2) > span').click();
    cy.get('#root button:nth-child(3) span').click();
    cy.get('#root button:nth-child(4) span').click();
    cy.get('#root button:nth-child(5) span').click();
    cy.get('#root button:nth-child(6) span').click();
    cy.get('#root div.min-w-max button:nth-child(1) span').click();
  });

  it('deve aceitar agendamento se um agendamento estiver pendente', function () {
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'arthuradmin@gmail.com',
      password: 'vellux123',
    }).then((response) => {
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });
    cy.visit('/');
    cy.contains('Administrador').should('be.visible');
    cy.intercept('GET', '**/appointments/admin/requests').as('listaRequests');
    cy.intercept('PUT', '**/appointments/**/approve').as('aprovarRequest');
    // Navega para a aba — pega o PRIMEIRO p.font-bold
    cy.get('#root div > p.font-bold').first().click();
    cy.wait('@listaRequests', { timeout: 15000 });
    cy.get('body').then(($body) => {
      if ($body.text().includes('Aprovar')) {
        cy.contains('Aprovar').first()
          .trigger('mouseover')
          .click();
        cy.wait('@aprovarRequest').its('response.statusCode').should('eq', 200);
      } else {
        cy.log('Nenhum agendamento pendente.');
      }
    });
  });

  it('deve recusar agendamento se um agendamento estiver pendente', function () {
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'arthuradmin@gmail.com',
      password: 'vellux123',
    }).then((response) => {
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });
    cy.visit('/');
    // O painel admin deve aparecer
    cy.contains('Administrador').should('be.visible');
    cy.intercept('GET', '**/appointments/admin/requests').as('listaRequests');
    cy.intercept('PUT', '**/appointments/**/reject').as('recusarRequest');
    // ✅ .first() para não pegar os 3 elementos
    cy.get('#root div > p.font-bold').first().click();
    cy.wait('@listaRequests', { timeout: 15000 });
    cy.get('body').then(($body) => {
      if ($body.text().includes('Recusar')) {
        cy.contains('Recusar').first()
          .trigger('mouseover')
          .click();
        // Preenche o motivo e confirma
        cy.get('#root label:nth-child(1) div.flex').click();
        cy.get('#root button.bg-red-500').click();
        // Verifica que o PUT foi enviado
        cy.wait('@recusarRequest').its('response.statusCode').should('eq', 200);
      } else {
        cy.log('Nenhum agendamento pendente para recusar.');
      }
    });
  });

  it('deve realizar check-in de um veículo agendado', function () {
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'arthuradmin@gmail.com',
      password: 'vellux123',
    }).then((response) => {
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });

    cy.visit('/');
    cy.contains('Administrador').should('be.visible');

    // Intercepta ANTES de abrir o modal
    cy.intercept('GET', '**/appointments/admin/pendentes').as('pendentes');
    cy.intercept('POST', '**/services/checkin').as('checkin'); // ← confirma o envio

    cy.contains('Realizar Check-in').click();
    cy.contains('Novo Check-in').click();

    cy.contains('Selecionar Veículo').should('be.visible');
    cy.wait('@pendentes', { timeout: 15000 });

    // Proteção: só prossegue se houver veículos na lista
    cy.get('body').then(($body) => {
      if ($body.find('button.w-full.p-6').length > 0) {
        cy.contains('Agendamentos Recentes')
          .parent()
          .find('button')
          .first()
          .click();

        cy.contains('Designar Serviço').should('be.visible');
        cy.get('textarea').type('Teste Cypress — veículo entregue pelo cliente.');
        cy.contains('Confirmar Entrada').click();

        // ← Confirma que o POST foi enviado e retornou sucesso
        cy.wait('@checkin', { timeout: 15000 }).its('response.statusCode').should('eq', 201);
      } else {
        cy.log('Nenhum veículo disponível para check-in (lista vazia).');
      }
    });
  });



  it('deve alocar um especialista a um serviço e iniciá-lo', function () {
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'arthuradmin@gmail.com',
      password: 'vellux123',
    }).then((response) => {
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });

    cy.visit('/');
    cy.contains('Administrador').should('be.visible');

    // Intercepta as APIs do ServiceOperations
    cy.intercept('GET', '**/services/admin').as('fetchServices');
    cy.intercept('GET', '**/auth/mechanics').as('fetchMechanics');
    cy.intercept('POST', '**/services/*/assign').as('assignSpecialist');
    cy.intercept('POST', '**/services/*/start').as('startService');
    // ← ESSAS LINHAS PRECISAM VOLTAR
    cy.contains('Realizar Check-in').click();
    cy.wait('@fetchServices', { timeout: 15000 });
    cy.wait('@fetchMechanics', { timeout: 15000 });
    // Só DEPOIS de navegar e carregar, verifica o body
    cy.get('body').then(($body) => {
      if ($body.text().includes('Iniciar Serviço')) {
        cy.intercept('GET', '**/services/admin').as('servicesRefresh');
        cy.get('svg.lucide-user-plus').first().parent().click();
        cy.contains('Atribuir Especialistas').parent().find('button').first().click();
        cy.wait('@assignSpecialist');
        cy.wait('@servicesRefresh', { timeout: 10000 });
        cy.get('svg.lucide-user-plus').first().parent()
          .invoke('attr', 'class')
          .should('include', 'yellow-500');
        cy.contains('Iniciar Serviço').first().click();
        cy.contains('Confirmar').last().scrollIntoView().click({ force: true });
        cy.wait('@startService', { timeout: 15000 }).its('response.statusCode').should('eq', 200);
      } else {
        cy.log('Nenhum serviço na fila de entrada.');
      }
    });
  });

  it('deve finalizar um serviço e gerar relatório', function () {
    cy.request('POST', 'https://vellux-backend.onrender.com/api/auth/login', {
      email: 'arthuradmin@gmail.com',
      password: 'vellux123',
    }).then((response) => {
      cy.window().then((win) => {
        win.localStorage.setItem('vellux_token', response.body.token);
        win.localStorage.setItem('vellux_profile', JSON.stringify(response.body.usuario));
      });
    });
    cy.visit('/');
    cy.contains('Administrador').should('be.visible');

    // Navega para ServiceOperations
    cy.contains('Realizar Check-in').click();

    // Aguarda a lista de serviços ativos carregar
    cy.intercept('GET', '**/services/admin').as('fetchServicesRelatorio');
    cy.wait('@fetchServicesRelatorio', { timeout: 15000 });

    cy.contains('Execução Técnica').should('be.visible');
    cy.get('body').then(($body) => {
      if ($body.text().includes('Início')) {
        // Clica no card do serviço ativo
        cy.contains('Início').first()
          .closest('[class*="cursor-pointer"]')
          .first()
          .click();

        // Clica em "Finalizar & Relatório" no modal de detalhes
        cy.contains('Finalizar').click();

        // Preenche o formulário de relatório
        cy.get('#root div.gap-10 div:nth-child(1) div:nth-child(2) div.flex button:nth-child(1)').click();
        cy.get('#root div:nth-child(1) > div.flex-wrap > button:nth-child(1)').click();
        cy.get('#root div:nth-child(2) > div:nth-child(2) > div.flex-wrap > button:nth-child(1)').click();
        cy.get('#root div.border-t button:nth-child(1)').click();
        cy.get('#root div:nth-child(2) > div:nth-child(3) > div.flex > button:nth-child(1)').click();

        // Salva — cy.contains evita o problema de escape de classes Tailwind com !
        cy.contains('Emitir Laudo Técnico').click();
      } else {
        cy.log('Nenhum serviço ativo encontrado para finalizar.');
      }
    });
  });
});