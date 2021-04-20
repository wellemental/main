import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
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
} from 'common';
import LocalStateService from './LocalStateService';
import TeacherService from './TeacherService';
import BaseService, { BaseServiceContructorOptions } from './BaseService';

// Separating from 'common' types bc Typescript throwing error due to diff btw RN Firebase & firebase js
export interface MobileContentServiceType extends ContentServiceType {
  historyQuery: FirebaseFirestoreTypes.Query;
  favsQuery: FirebaseFirestoreTypes.Query;
}

class ContentService extends BaseService implements MobileContentServiceType {
  private teachers: AllTeachers | undefined;
  private localStorage: LocalStateServiceType;
  private teacherService: TeacherServiceType;
  private COLLECTION = 'content';
  private collection = this.firestore.collection(this.COLLECTION);
  private userCollection = this.firestore.collection('users');
  private userDoc: FirebaseFirestoreTypes.DocumentReference;
  public favsQuery: FirebaseFirestoreTypes.Query;
  public historyQuery: FirebaseFirestoreTypes.Query;

  constructor(args: BaseServiceContructorOptions) {
    super(args);
    this.localStorage = new LocalStateService();
    // @ts-ignore - Type diff be RNFB & firebase libraries
    this.teacherService = new TeacherService(args);
    this.teachers;
    this.userDoc = this.userCollection.doc(this.currentUser.id);
    this.historyQuery = this.userDoc
      .collection('plays')
      .orderBy('createdAt', 'desc');
    this.favsQuery = this.userDoc
      .collection('favorites')
      .where('favorited', '==', true)
      .orderBy('createdAt', 'desc');
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

  public getContentContext = async (): Promise<ContentObj> => {
    try {
      const localData = await this.localStorage.getContent();
      const hasLocalContent = localData && localData.content;
      const newContentAvailable = await this.calcUpdateAvailable(
        localData && localData.updated_at,
      );

      // Protection for old users.
      // Content state was previously an array, now an object. So if their localStarage content is an array, repull from db to make it an object.
      // Content model used to only store teacher name, now it stores entire teacher object
      // If user's localStorage has old model, then update it
      const oldLocalContentModels =
        localData &&
        (Array.isArray(localData.content) ||
          typeof Object.values(localData.content)[0].teacher === 'string');

      if (!hasLocalContent || newContentAvailable || oldLocalContentModels) {
        // console.log('Pull from db!!!!!!');
        return await this.getContentfromDb();
      } else {
        // console.log('Pull from localStorage!!!!!!');
        return localData.content;
      }
    } catch (error) {
      // console.log('ERROR', error);
      return Promise.reject(error);
    }
  };

  public getContentfromDb = async (): Promise<ContentObj> => {
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

      // Save updated Content into localStorage for future use
      await this.localStorage.setContent(content);

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

  private calcUpdateAvailable = async (
    localUpdatedAt: Date,
  ): Promise<boolean> => {
    // Get latest updated_at times from firestore
    const dbContentLatest = await this.getLatestUpdate();

    // If local state has never been saved, prompt update
    if (!localUpdatedAt) {
      return true;
    }

    // If database content has been updated more recently than the last local save, prompt update
    if (dbContentLatest > localUpdatedAt) {
      return true;
    }

    return false;
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
      // logger.error('Unable to get latest content update');
      return Promise.reject(new ApplicationError(err));
    }
  };
}

export default ContentService;
