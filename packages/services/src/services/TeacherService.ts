// import { firestore } from '../base';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Teacher, Teachers } from '../types';
import { ApplicationError } from '../models/Errors';

const COLLECTION = 'teachers';
const teachersCollection = firestore().collection(COLLECTION);

export interface TeacherServiceType {
  buildTeacher(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): Teacher;
  findTeacherByName(name: string): Teacher;
  getAllTeachers(): Promise<Teacher[]>;
}

class TeacherService implements TeacherServiceType {
  public buildTeacher = (
    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
  ): Teacher => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      photo: data.photo,
      bio: data.bio,
    };
  };

  public findTeacherByName = async (name: string): Promise<Teacher | void> => {
    const query = teachersCollection.where('name', '==', name);

    try {
      return await query.get().then((snapshots) => {
        snapshots.docs.map((doc) => {
          if (doc) {
            return this.buildTeacher(doc);
          } else {
            return Promise.reject(new ApplicationError('No teacher found'));
          }
        });
      });
    } catch (err) {
      return Promise.reject(new ApplicationError('Error getting teacher'));
    }
  };

  public getAllTeachers = async (): Promise<{ [key: string]: Teacher }> => {
    const query = teachersCollection;
    const teachers = {};

    await query.get().then((snapshot) =>
      snapshot.docs.forEach(
        (doc) =>
          (teachers[doc.data().name] = {
            id: doc.id,
            name: doc.data().name,
            bio: doc.data().bio,
            photo: doc.data().photo,
          }),
      ),
    );

    return teachers;
  };
}

export default TeacherService;
