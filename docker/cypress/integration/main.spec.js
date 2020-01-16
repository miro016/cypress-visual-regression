describe('Visual Regression Example', () => {
  it('should display the home page correctly', () => {
    cy.visit('localhost:80/01.html');
    cy.get('H1').contains('Hello, World');
    cy.compareSnapshot('home');
  });

  it('should display the register page correctly', () => {
    cy.visit('localhost:80/02.html');
    cy.get('H1').contains('Register');
    cy.compareSnapshot('register');
  });

  it('should display the login page correctly', () => {
    cy.visit('localhost:80/03.html');
    cy.get('H1').contains('Login');
    cy.compareSnapshot('login', 0.0);
    cy.compareSnapshot('login2', 0.1);
  });

  it('should display the component correctly', () => {
    if (Cypress.env('type') === 'base') {
      cy.visit('localhost:80/03.html');
      cy.get('H1').contains('Login');
      cy.get('form').compareSnapshot('login-form');
    } else {
      cy.visit('localhost:80/03.html');
      cy.get('H1').contains('Login');
      cy.get('form').compareSnapshotTest('login-form').should('be.true');
      cy.get('form').compareSnapshotTest('login-form', 0.02).should('be.true');
    }
  });

  it('should display the foo page incorrectly', () => {
    if (Cypress.env('type') === 'base') {
      cy.visit('localhost:80/04.html');
      cy.get('H1').contains('bar');
      cy.compareSnapshot('bar');
    } else {
      cy.visit('localhost:80/05.html');
      cy.get('H1').contains('none');
      cy.compareSnapshotTest('bar').should('be.false');
    }
  });

  it('should handle custom error thresholds correctly', () => {
    if (Cypress.env('type') === 'base') {
      cy.visit('localhost:80/04.html');
      cy.get('H1').contains('bar');
      cy.compareSnapshot('bar');
      cy.get('H1').compareSnapshotTest('h1');
    } else {
      cy.visit('localhost:80/05.html');
      cy.get('H1').contains('none');
      cy.compareSnapshot('bar', 0.02);
      cy.compareSnapshotTest('bar', 0.02).should('be.true');
      cy.compareSnapshotTest('bar', 0.017).should('be.false');
      cy.get('H1').compareSnapshotTest('h1', 0.08).should('be.true');
      cy.get('H1').compareSnapshotTest('h1', 0.07).should('be.false');
    }
  });

  it('should handle custom error thresholds correctly - take 2', () => {
    if (Cypress.env('type') === 'base') {
      cy.visit('localhost:80/06.html');
      cy.get('H1').contains('Color');
      cy.compareSnapshot('bar');
    } else {
      cy.visit('localhost:80/07.html');
      cy.get('H1').contains('Color');
      cy.compareSnapshot('bar', 0.02);
      cy.compareSnapshotTest('bar', 0.02).should('be.true');
      cy.compareSnapshotTest('bar', 0.017).should('be.false');
      cy.compareSnapshotTest('bar').should('be.false');
    }
  });

  it('should handle not existing base', () => {
    if(Cypress.env('type') === 'base') {
      cy.visit('localhost:80/01.html');
      cy.get('H1').contains('Hello, World').should('have.length',1)
    } else{
      cy.visit('localhost:80/01.html');
      cy.get('H1').contains('Hello, World').compareSnapshotTest('hello').should('be.false');
    }
  })
});
