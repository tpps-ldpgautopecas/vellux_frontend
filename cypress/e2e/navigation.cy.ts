describe('Navegação do Site', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve carregar a página inicial', () => {
    cy.contains('Vellux Motors').should('be.visible');
    cy.contains('Oficina de Alta Engenharia').should('be.visible');
  });

  it('deve navegar para as seções', () => {
    cy.get('#root div.space-y-1\\.5').click();
    cy.get('#root button.italic').click();
    
    cy.get('#root div.space-y-1\\.5').click();
    cy.get('#root div.top-full a[href="#servicos"]').click();
    
    cy.get('#root button.lg\\:hidden').click();
    cy.get('#root div.top-full a[href="#contato"]').click();
  });

  it('deve navegar entre serviços', function() {
    cy.get('#servicos div:nth-child(1) > div.group > div.flex-col').click();
    cy.get('#servicos button.\\!px-8').click();
    cy.get('#servicos div:nth-child(2) > div.group > div.flex-col').click();
    cy.get('#servicos button.\\!px-8').click();
    cy.get('#servicos div:nth-child(3) div.flex-col').click();
    cy.get('#servicos button.\\!px-8').click();
    cy.get('#servicos div:nth-child(4) div.flex-col').click();
    cy.get('#servicos button.\\!px-8').click();
    cy.get('#servicos div:nth-child(5) div.flex-col').click();
    cy.get('#servicos button.\\!px-8').click();
    cy.get('#servicos div:nth-child(6) div.flex-col').click();
    cy.get('#servicos button.\\!px-8').click();
  });

  it('deve abrir a área de login por diferentes caminhos', function() {
    cy.get('#root button.\\!px-4').click();
    cy.get('#root path[d="M12 5v14"]').click();
    cy.get('#inicio button.flex').click();
    cy.get('#root svg.lucide-plus path[d="M5 12h14"]').click();
    cy.get('#contato span.justify-center').click();
  });
});
