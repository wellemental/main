import {
  Teacher,
  AllTeachers,
  TeacherServiceType,
  QueryDocumentSnapshot,
} from 'common';
import { ApplicationError } from '../models/Errors';
import BaseService from './BaseService';

class TeacherService extends BaseService implements TeacherServiceType {
  private COLLECTION = 'teachers';
  private teachersCollection = this.firestore.collection(this.COLLECTION);

  public buildTeacher = (doc: QueryDocumentSnapshot): Teacher => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      photo: data.photo,
      bio: data.bio,
      language: data.language,
      updated_at: data.updated_at,
    };
  };

  public findTeacherByName = async (name: string): Promise<Teacher | void> => {
    const query = this.teachersCollection.where('name', '==', name);

    try {
      return await query.get().then(snapshots => {
        snapshots.docs.map(doc => {
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

  public getAll = async (): Promise<AllTeachers> => {
    const query = this.teachersCollection;
    const teachers: { [key: string]: Teacher } = {};

    try {
      await query
        .get()
        .then(snapshot =>
          snapshot.docs.forEach(
            (doc: QueryDocumentSnapshot) =>
              (teachers[doc.data().name] = this.buildTeacher(doc)),
          ),
        );
    } catch (err) {
      this.logger.error(`Unable to get all teachers - ${err}`);
      return Promise.reject(new ApplicationError(err));
    }

    return teachers;
  };

  public getLatestUpdate = async (): Promise<Date> => {
    const query: any = this.teachersCollection
      .orderBy('updated_at', 'desc')
      .limit(1);

    try {
      const teachers = await query
        .get()
        .then((snapshot: any) =>
          snapshot.docs.map((doc: QueryDocumentSnapshot) =>
            this.buildTeacher(doc),
          ),
        );

      return teachers[0].updated_at.toDate();
    } catch (err) {
      this.logger.error('Unable to get latest teacher update');
      return Promise.reject(new ApplicationError(err));
    }
  };
}

export default TeacherService;
