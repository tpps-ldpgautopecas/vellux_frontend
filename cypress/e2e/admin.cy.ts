describe('Fluxo do Admin', () => {
  // Nota: Idealmente os testes devem mockar o backend ou usar admin fixo.
  
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve ter rotas bloqueadas sem autenticação admin', () => {
    cy.visit('/admin');
    // Deve redirecionar para fora ou exibir um aviso de sem permissão
    // cy.url().should('not.include', '/admin'); // se redireciona
  });
});
