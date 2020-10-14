import { MigrationDirection, MigrationReport } from './base';
import ListPendingMigrationsService from './ListPendingMigrationsService';
import MigrationRepository from './MigrationRepository';
import RunMigrationService from './RunMigrationService';

class RunPendingMigrationsService {
  public async perform(): Promise<Array<MigrationReport>> {
    const reports = [];

    const repository = new MigrationRepository();
    const listService = new ListPendingMigrationsService();
    const runService = new RunMigrationService();

    const pendingMigrations = await listService.perform();
    for (const migration of pendingMigrations) {
      const report = await runService.perform(migration, MigrationDirection.Up);
      await repository.save(migration.id);
      reports.push(report);
    }

    return reports;
  }
}

export default RunPendingMigrationsService;
