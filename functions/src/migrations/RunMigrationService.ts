import * as firebase from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { Migration, MigrationDirection, MigrationReport } from './base';

// For reading cursor position.
const exists = util.promisify(fs.exists);
const write = util.promisify(fs.writeFile);
const read = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

class RunMigrationService {
  private batchSize = 300;

  public async perform(
    migration: Migration,
    direction: MigrationDirection,
  ): Promise<MigrationReport> {
    let totalDocumentsMigrated = 0;
    let totalDocumentsSkipped = 0;
    let totalDocumentsFailed = 0;
    let cursor;

    const migrationFunction =
      direction === MigrationDirection.Down ? migration.down : migration.up;

    const cursorPositionFile = path.join(
      __dirname,
      `partial-migration-${migration.id}`,
    );
    if (await exists(cursorPositionFile)) {
      const cursorDocumentId = (await read(cursorPositionFile)).toString();
      cursor = await firebase.firestore().doc(cursorDocumentId).get();
      console.log(
        `Resuming Cloud Firestore migration ${migration.id} from document ${cursorDocumentId}.`,
      );
    }

    do {
      if (cursor) {
        await write(cursorPositionFile, cursor.ref.path);
      }
      let query = migration.collection().limit(this.batchSize);
      if (cursor) {
        query = query.startAfter(cursor);
      }
      const snapshot = await query.get();
      const docs = snapshot.docs;
      if (docs.length === 0) {
        break;
      }
      cursor = docs[docs.length - 1];

      const batch = firebase.firestore().batch();
      for (const doc of docs) {
        try {
          const updates = await migrationFunction(doc);
          if (updates) {
            batch.update(doc.ref, updates);
            totalDocumentsMigrated += 1;
          } else {
            totalDocumentsSkipped += 1;
          }
        } catch (error) {
          totalDocumentsFailed += 1;
          console.error(`Failed to update document ${doc.ref.path}: ${error}`);
        }
      }

      await batch.commit();
    } while (true);

    try {
      if (fs.existsSync(cursorPositionFile)) {
        await unlink(cursorPositionFile);
      }
    } catch (e) {
      console.log(
        `Error unlinking journal file ${cursorPositionFile} after successful import: ${e.toString()}`,
      );
    }

    const report = {
      totalDocumentsMigrated,
      totalDocumentsSkipped,
      totalDocumentsFailed,
    };
    return Promise.resolve(report);
  }
}

export default RunMigrationService;
