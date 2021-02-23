import * as glob from 'glob';

import { Migration } from './base';

class ListMigrationsService {
  public perform(): Array<Migration> {
    const migrations: Array<Migration> = [];
    const files = glob.sync('./migrate/*.js', { cwd: __dirname });

    for (const file of files) {
      const migration = require(file); // eslint-disable-line @typescript-eslint/no-var-requires
      migrations.push(new migration.default());
    }

    return migrations;
  }
}

export default ListMigrationsService;
