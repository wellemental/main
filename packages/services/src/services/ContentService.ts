import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import moment from 'moment';
import { ApplicationError } from '../models/Errors';
import {
  LocalStateServiceType,
  AllTeachers,
  TeacherServiceType,
  Content,
  ContentObj,
  ContentServiceType,
  Categories,
  Tags,
  QueryDocumentSnapshot,
  LocalContent,
} from 'common';
import LocalStateService from './LocalStateService';
import TeacherService from './TeacherService';
import BaseService, { BaseServiceContructorOptions } from './BaseService';

class ContentService extends BaseService implements ContentServiceType {
  private teachers: AllTeachers | undefined;
  private localStorage: LocalStateServiceType;
  private teacherService: TeacherServiceType;
  private content: ContentObj;
  private COLLECTION = 'content';
  private collection = this.firestore.collection(this.COLLECTION);

  constructor(args: BaseServiceContructorOptions) {
    super(args);
    this.localStorage = new LocalStateService();
    this.teacherService = new TeacherService(args);

    this.teachers;
    this.content = {};
  }

  public buildContent = (doc: QueryDocumentSnapshot): Content => {
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

  public getLocalContent = async (): Promise<LocalContent> => {
    try {
      return await this.localStorage.getContent();
    } catch (error) {
      return Promise.reject(new ApplicationError(error));
    }
  };

  public getContent = async (): Promise<ContentObj> => {
    const localData = await this.getLocalContent();

    if (localData) {
      if (localData.content) {
        // Protection for old users. Content state was previously an array, now an object.
        // So if their localStarage content is an array, repull from db to make it an object.
        if (Array.isArray(localData.content)) {
          await getDbContent();
          // We updated content model to already have been built with the full corresponding teacher obj
          // If user's localStorage has old model, then update it
        } else if (
          typeof Object.values(localData.content)[0].teacher === 'string'
        ) {
          await getDbContent();
        } else {
          setContent(localData.content);
        }
      }
    }

    const query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = this.collection.orderBy(
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
        .then(snapshot =>
          snapshot.docs.forEach(
            doc => (content[doc.id] = this.buildContent(doc)),
          ),
        );

      this.content = content;
      return content;
    } catch (err) {
      // logger.error(`Unable to get all content - ${err}`);
      return Promise.reject(new ApplicationError(err));
    }
  };

  public getFeatures = (
    category: Categories,
    contentObj: ContentObj,
  ): Content[] => {
    return Object.values(contentObj).filter(
      item => item.type === category && item.tags.includes(Tags.Featured),
    );
  };

  public getLatestUpdate = async (): Promise<Date> => {
    const query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = this.collection
      .orderBy('updated_at', 'desc')
      .limit(1);

    try {
      const content = await query
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()));

      return content[0].updated_at.toDate();
    } catch (err) {
      logger.error('Unable to get latest content update');
      return Promise.reject(new ApplicationError(err));
    }
  };
}

export default ContentService;
