import * as firebase from 'firebase-admin';

class MigrationRepository {
  public async list(): Promise<Array<string>> {
    const migrations: Array<string> = [];

    try {
      const results = await firebase
        .firestore()
        .collection('migrations')
        .get();

      results.forEach((result: FirebaseFirestore.QueryDocumentSnapshot) => {
        migrations.push(result.id);
      });
    } catch (error) {
      console.error('Failed to get migration collection: ', error);
      return Promise.reject(error);
    }

    return Promise.resolve(migrations);
  }

  public async save(id: string): Promise<void> {
    try {
      await firebase
        .firestore()
        .collection('migrations')
        .doc(id)
        .set({ runAt: firebase.firestore.FieldValue.serverTimestamp() });
    } catch (error) {
      console.error(`Failed to save migration: '${id}':`, error);
      return Promise.reject(error);
    }

    return Promise.resolve();
  }

  public async delete(id: string): Promise<void> {
    try {
      await firebase
        .firestore()
        .collection('migrations')
        .doc(id)
        .delete();
    } catch (error) {
      console.error(`Failed to delete migration: '${id}':`, error);
      return Promise.reject(error);
    }

    return Promise.resolve();
  }
}

export default MigrationRepository;
