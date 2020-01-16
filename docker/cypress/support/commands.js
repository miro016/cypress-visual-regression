const compareSnapshotCommand = require('../../dist/command.js');

function compareSnapshotTestCommand() {
  Cypress.Commands.add('compareSnapshotTest', { prevSubject: 'optional' }, (subject, name, errorThreshold = 0.00) => {
   
  // take snapshot
  if (subject) {
    cy.get(subject).screenshot(`${name}`);
  } else {
    cy.screenshot(`${name}`);
  }

  // run visual tests
  if (Cypress.env('type') === 'actual') {
    const options = {
      fileName: name,
      specDirectory: Cypress.spec.name
    };
    cy.task('compareSnapshotsPlugin', options).then(results => {
      if (results.percentage > errorThreshold) return false;
      return true;
    });
  }
});
}

compareSnapshotTestCommand();
compareSnapshotCommand();
