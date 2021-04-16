import { QueryDocumentSnapshot } from '../base';
import {
  AllTeachers,
  Tags,
  TeacherServiceType,
  Content,
  ContentObj,
  ContentServiceType,
  Categories,
} from 'common';
import moment from 'moment';
import { ApplicationError } from '../models/Errors';
import TeacherService from './TeacherService';
import BaseService, { BaseServiceContructorOptions } from './BaseService';

class ContentService extends BaseService implements ContentServiceType {
  private teachers: AllTeachers | undefined;
  private teacherService: TeacherServiceType;
  private content: ContentObj;
  private COLLECTION = 'content';
  private collection = this.firestore.collection(this.COLLECTION);

  constructor(options: BaseServiceContructorOptions) {
    super(options);
    this.teacherService = new TeacherService(options);
    this.teachers = undefined;
    this.content = {};
  }

  public buildContent = (doc: QueryDocumentSnapshot): Content | null => {
    const data = doc.data();

    const tags: Tags[] = data.tags ? data.tags.split(', ') : [];

    if (this.teachers) {
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
    }
    return null;
  };

  public getContent = async (): Promise<ContentObj> => {
    // console.log('***** GETTING CONTENT');
    // With no tags passed, get all Content
    const query: any = this.collection.orderBy('updated_at', 'desc');

    try {
      const content: ContentObj = {};
      this.teachers = await this.teacherService.getAll();

      await query.get().then((snapshot: any) =>
        snapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
          const builtContent = this.buildContent(doc);

          if (builtContent) {
            content[doc.id] = builtContent;
          }
        }),
      );

      return content;
    } catch (err) {
      this.logger.error(`Unable to get all content - ${err}`);
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
    const query: any = this.collection.orderBy('updated_at', 'desc').limit(1);

    try {
      const content = await query
        .get()
        .then((snapshot: any) =>
          snapshot.docs.map((doc: QueryDocumentSnapshot) =>
            this.buildContent(doc),
          ),
        );

      return content[0].updated_at.toDate();
    } catch (err) {
      this.logger.error('Unable to get latest content update');
      return Promise.reject(new ApplicationError(err));
    }
  };
}

export default ContentService;
