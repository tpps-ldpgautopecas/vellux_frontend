describe('Navegação do Site', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve carregar a página inicial', () => {
    cy.contains('Vellux Motors').should('be.visible');
    cy.contains('A Arte da Performance Mecânica').should('be.visible');
  });

  it('deve navegar para as seções', () => {
    cy.get('a[href="#services"]').click();
    cy.url().should('include', '#services');
    
    cy.get('a[href="#manifesto"]').click();
    cy.url().should('include', '#manifesto');
    
    cy.get('a[href="#contact"]').click();
    cy.url().should('include', '#contact');
  });
});
