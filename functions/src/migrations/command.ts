import * as firebase from 'firebase-admin';
import RunPendingMigrationsService from './RunPendingMigrationsService';

const run = async (): Promise<void> => {
  firebase.initializeApp();
  const service = new RunPendingMigrationsService();
  const reports = await service.perform();

  for (const report of reports) {
    console.log('-----------------------------------');
    console.log('Finished migrating:');
    console.log(`  documents migrated: ${report.totalDocumentsMigrated}`);
    console.log(`  documents skipped:  ${report.totalDocumentsSkipped}`);
    console.log(`  documents failed:   ${report.totalDocumentsFailed}`);
    console.log('-----------------------------------');
  }
};

run()
  .then(_ => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
