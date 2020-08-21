import app from './base';

const COLLECTION = 'teachers';
const teachersCollection = app.firestore().collection(COLLECTION);

class TeacherService {
  public findTeacher = async (): Promise<any> => {
    const query = teachersCollection;

    return await query.get().then((snapshot) =>
      snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        bio: doc.data().bio,
      })),
    );
  };
}

export default TeacherService;
