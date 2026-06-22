describe('Fluxo de Autenticação', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve abrir o modal de login e fechar', () => {
    // Clica no botão de Área do Cliente
    cy.contains('Área do Cliente').click();
    
    // Verifica se o modal abriu
    cy.get('h2').contains('Bem-vindo à Vellux').should('be.visible');
    
    // Clica para fechar o modal
    cy.get('button').contains('Cancelar').click();
    
    // Verifica se o modal fechou
    cy.get('h2').contains('Bem-vindo à Vellux').should('not.exist');
  });

  it('deve alternar entre Login e Cadastro', () => {
    cy.contains('Área do Cliente').click();
    
    cy.contains('Criar conta').click();
    cy.contains('Cadastre-se').should('be.visible');
    cy.get('input[type="text"]').should('exist'); // Nome completo
    
    cy.contains('Fazer login').click();
    cy.contains('Bem-vindo à Vellux').should('be.visible');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.contains('Área do Cliente').click();
    
    cy.get('input[type="email"]').type('email_invalido@teste.com');
    cy.get('input[type="password"]').type('senhainvalida');
    cy.contains('button', 'Entrar').click();
    
    // Supabase irá retornar um erro que deve aparecer na tela
    cy.contains('Credenciais inválidas').should('be.visible');
  });
});
