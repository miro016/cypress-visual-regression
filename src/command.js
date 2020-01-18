/* eslint-disable no-undef */

function compareSnapshotCommand() {
  Cypress.Commands.add(
    'compareSnapshot',
    { prevSubject: 'optional' },
    (subject, name, errorThreshold = 0.0) => {
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
          specDirectory: Cypress.spec.name,
          strict: Cypress.env('missingBase') !== 'create',
        };
        cy.task('compareSnapshotsPlugin', options).then((results) => {
          if (results.percentage > errorThreshold) {
            throw new Error(`${name} images are different`);
          }
        });
      }
    }
  );
}

/* eslint-enable no-undef */

module.exports = compareSnapshotCommand;
