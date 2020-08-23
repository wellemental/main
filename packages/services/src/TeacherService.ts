import { firestore } from './base';
// import firestore from '@react-native-firebase/firestore';

const COLLECTION = 'teachers';
const teachersCollection = firestore().collection(COLLECTION);

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
