describe('Fluxo de Autenticação', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve abrir o modal de login e fechar', () => {
    // Clica no botão de Entrar
    cy.contains('Entrar').click();

    // Verifica se o modal abriu
    cy.get('h2').contains('Conectar').should('be.visible');

    // Clica para fechar o modal
    cy.get('.top-8').click();

    // Verifica se o modal fechou
    cy.get('h2').contains('Bem-vindo à Vellux').should('not.exist');
  });

  it('deve alternar entre Login e Cadastro', () => {
    cy.contains('Entrar').click();

    cy.get('.space-y-6 > .mt-6').click();
    cy.get('input[type="text"]').should('exist'); // Nome completo

    cy.get('.space-y-6 > .mt-6').click();
    cy.get('.space-y-6 > :nth-child(1) > .relative > .w-full').should('exist');

  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.contains('Entrar').click();

    cy.get('input[type="email"]').type('email_invalido@teste.com');
    cy.get('input[type="password"]').type('senhainvalida');
    // Como há um botão 'Entrar' no navbar e um 'Entrar' no modal, precisamos especificar o modal.
    cy.get('.space-y-6 > .px-10').click();

    // Supabase irá retornar um erro que deve aparecer na tela
    cy.contains('Credenciais inválidas').should('be.visible');
  });

  it('deve cadastrar novo usuário', () => {
    cy.contains('Entrar').click();
    cy.get('#root button.tracking-widest').click();


    cy.get('#root input[placeholder="Seu nome"]').type('Teste Cypress');
    cy.get('#root input[placeholder="seu@email.com"]').type('cypress@gmail.com');
    cy.get('#root input[placeholder="••••••••"]').type('@Cypress123');
    cy.get('#root input[placeholder="Digite a senha novamente"]').type('@Cypress123');
    cy.get('#root input[placeholder="(61) 99999-9999"]').type('61 99999-9998');

    cy.get('#root button[type="submit"]').click();
  });

  it('deve mostrar erro ao tentar cadastrar usuário existente', () => {
    cy.contains('Entrar').click();
    cy.get('#root button.tracking-widest').click();


    cy.get('#root input[placeholder="Seu nome"]').type('Teste Cypress');
    cy.get('#root input[placeholder="seu@email.com"]').type('cypress@gmail.com');
    cy.get('#root input[placeholder="••••••••"]').type('@Cypress123');
    cy.get('#root input[placeholder="Digite a senha novamente"]').type('@Cypress123');
    cy.get('#root input[placeholder="(61) 99999-9999"]').type('61 99999-9998');

    cy.get('#root button[type="submit"]').click();

    cy.get('#root div.rounded').click();
    cy.contains('Este email já está cadastrado').should('be.visible');
  });

  it('deve realizar login', function () {
    cy.get('#root button.\\!px-4').click();

    cy.get('#root input[placeholder="seu@email.com"]').type('cypress@gmail.com');
    cy.get('#root input[placeholder="••••••••"]').type('@Cypress123');

    cy.get('#root button[type="submit"]').click();


    cy.contains('Acesso Cliente').should('exist');
  });

  it('deve mostrar erro ao logar com credenciais inválidas', function () {
    cy.get('#root button.\\!px-4').click();

    cy.get('#root input[placeholder="seu@email.com"]').type('cypress@gmail.com');
    cy.get('#root input[placeholder="••••••••"]').type('@Cypress1234');

    cy.get('#root button[type="submit"]').click();

    cy.contains('Credenciais inválidas.').should('exist');

  });

  it('deve mostrar erros de validação nos campos inválidos', () => {
    cy.contains('Entrar').click();
    cy.get('#root button.tracking-widest').click();

    // Email inválido — digita e sai do campo (blur)
    cy.get('#root input[placeholder="seu@email.com"]')
      .type('emailinvalido')
      .blur();
    cy.contains('Digite um e-mail válido').should('be.visible');

    // Senha fraca — digita algo e verifica os indicadores
    cy.get('#root input[placeholder="••••••••"]').first().type(' ');
    cy.contains('Mínimo de 8 caracteres').should('be.visible');
    cy.contains('Pelo menos uma letra maiúscula').should('be.visible');
    cy.contains('Pelo menos uma letra minúscula').should('be.visible');
    cy.contains('Pelo menos um número').should('be.visible');
    cy.contains('Pelo menos um caractere especial').should('be.visible');
    cy.contains('Não conter espaços').should('be.visible');

    // Confirmar senha diferente
    cy.get('#root input[placeholder="Digite a senha novamente"]')
      .type('outracoisa')
      .blur();
    cy.contains('As senhas não coincidem').should('be.visible');

    // Telefone inválido — digita e sai do campo (blur)
    cy.get('#root input[placeholder="(61) 99999-9999"]')
      .type('1')
      .blur();
    cy.contains('Digite um telefone válido').should('be.visible');
  });

  it('deve mostrar/ocultar senha para cadastro e login', function () {
    cy.get('#root button.\\!px-4').click();
    cy.get('#root button.right-3').click();
    cy.get('#root button.right-3').click();
    cy.get('#root button.tracking-widest').click();
    cy.get('#root div:nth-child(3) button.absolute').click();
    cy.get('#root div:nth-child(3) button.absolute').click();
  });

  it('deve realizar login e sair da conta', function () {
    cy.get('#root button.\\!px-4').click();
    
    cy.get('#root input[placeholder="seu@email.com"]').type('cypress@gmail.com');
    cy.get('#root input[placeholder="••••••••"]').type('@Cypress123');
    
    cy.get('#root button[type="submit"]').click();
    
    
    cy.contains('Acesso Cliente').should('exist');
    
    cy.get('#root svg.lucide-log-out').click();
  });
});


