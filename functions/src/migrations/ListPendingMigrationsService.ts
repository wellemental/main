import { Migration } from './base';
import ListMigrationsService from './ListMigrationsService';
import MigrationRepository from './MigrationRepository';

class ListPendingMigrationsService {
  public async perform(): Promise<Array<Migration>> {
    const service = new ListMigrationsService();
    const localMigrations = service.perform();

    const repository = new MigrationRepository();
    const executedMigrationIds = await repository.list();

    const pendingMigrations = [];
    for (const migration of localMigrations) {
      if (!executedMigrationIds.includes(migration.id)) {
        pendingMigrations.push(migration);
      }
    }

    return Promise.resolve(pendingMigrations);
  }
}

export default ListPendingMigrationsService;
