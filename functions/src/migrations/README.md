# Migrations

These migrations focus on migrating the data in Firebase. It loosely follows the Rails migrations structure where there is a folder of migrations named by a date and a name, they have an up and down action, and completed migrations are tracked in the database so they're not re-run.

**Disclaimer:** This framework was quickly put together as part of an MVP product so it is not full featured and there may be better options out there.

## Migration Interface

The migration interface consists of 4 parts (see [./base.ts](base.ts) for the actual interface):

1. `id` - A unique ID which is used to determine if the migration has been run or not
1. `collection` - The function that returns the collection the migration should run over
1. `up` - The function which takes an unmigrated document and returns the migrated version (or null if nothing should be done)
1. `down` - The function which takes a migrated document and returns the unmigrated version (or null if nothing should be done)

## Adding a New Migration

To add a new migration:

1. Create a new file in the `migrate` directory in the format `YYYYMMDDHHMMS_[some_descriptive_name]`
1. Create a new class in the file which implements the `Migration` interface
1. Run the migration with `yarn build && GOOGLE_APPLICATION_CREDENTIALS=path-to-your-credentials.json node lib/migrations/command.js` where `path-to-your-credentials.json` is the path to the `credentials.json` file for the Firebase environment you want to run the migrations in

**Note:** It's recommended to run migrations in staging first before running them in production

**Note:** If a migration fails part way through, it will restart from the cursor position saved in a file named `partial-migration-[your-migration-id]` with the migration id

## Known Issues

The down migration command has not been implemented. If needed it should be straightforward to implement a command line helper to run it using the `RunMigrationService` and passing in the migration you want to run the down on.

Data migrations may be long running, while there is some basic support for restarting failed migrations it may not be an effective migration tool as the data set grows.
