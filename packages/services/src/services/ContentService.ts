import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import moment from 'moment';
import { ApplicationError } from '../models/Errors';
import logger from './LoggerService';
import {
  LocalStateServiceType,
  AllTeachers,
  TeacherServiceType,
  Content,
  ContentObj,
  ContentServiceType,
  Categories,
  Tags,
} from 'common';
import LocalStateService from './LocalStateService';
import TeacherService from './TeacherService';

const COLLECTION = 'content';
const collection = firestore().collection(COLLECTION);

class ContentService implements ContentServiceType {
  private teachers: AllTeachers | undefined;
  private localStorage: LocalStateServiceType;
  private teacherService: TeacherServiceType;
  private content: ContentObj;

  constructor() {
    this.localStorage = new LocalStateService();
    this.teacherService = new TeacherService();

    this.teachers;
    this.content = {};
  }

  public buildContent = (
    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
  ): Content => {
    const data = doc.data();
    const tags: Tags[] = data.tags ? data.tags.split(', ') : [];

    return {
      id: doc.id,
      title: data.title,
      video: data.video,
      video_orientation: data.video_orientation,
      thumbnail: data.thumbnail,
      description: data.description,
      teacher: this.teachers[data.teacher],
      type: data.type,
      tags: tags,
      seconds: data.seconds,
      length: data.seconds
        ? moment().startOf('day').seconds(data.seconds).format('m:ss')
        : '0:00',
      language: data.language,
      priority: data.priority,
      status: data.status,
      updated_at: data.updated_at,
      created_at: data.created_at,
    };
  };

  public getFeatures = (
    category: Categories,
    contentObj: ContentObj,
  ): Content[] => {
    return Object.values(contentObj).filter(
      (item) => item.type === category && item.tags.includes(Tags.Featured),
    );
  };

  public getContent = async (): Promise<ContentObj> => {
    const query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = collection.orderBy(
      'updated_at',
      'desc',
    );

    try {
      const content: ContentObj = {};
      this.teachers = await this.teacherService.getAll();

      if (!this.teachers) {
        return Promise.reject(
          new ApplicationError('Teachers have not been loaded'),
        );
      }

      await query
        .get()
        .then((snapshot) =>
          snapshot.docs.forEach(
            (doc) => (content[doc.id] = this.buildContent(doc)),
          ),
        );

      this.content = content;
      return content;
    } catch (err) {
      logger.error(`Unable to get all content - ${err}`);
      return Promise.reject(new ApplicationError(err));
    }
  };

  public getLatestUpdate = async (): Promise<Date> => {
    const query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = collection
      .orderBy('updated_at', 'desc')
      .limit(1);

    try {
      const content = await query
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data()));

      return content[0].updated_at.toDate();
    } catch (err) {
      logger.error('Unable to get latest content update');
      return Promise.reject(new ApplicationError(err));
    }
  };
}

export default ContentService;
