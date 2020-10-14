type Collection =
  | FirebaseFirestore.CollectionReference
  | FirebaseFirestore.Query;

type MigrationFunction = (
  document:
    | FirebaseFirestore.DocumentSnapshot
    | FirebaseFirestore.QueryDocumentSnapshot,
) => FirebaseFirestore.UpdateData | null;

interface Migration {
  id: string;
  collection: () => Collection;
  up: MigrationFunction;
  down: MigrationFunction;
}

enum MigrationDirection {
  Up = 'up',
  Down = 'down',
}

interface MigrationReport {
  totalDocumentsMigrated: number;
  totalDocumentsSkipped: number;
  totalDocumentsFailed: number;
}

export { Collection, Migration, MigrationDirection, MigrationReport };
