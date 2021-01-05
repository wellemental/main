import firebase, { QueryDocumentSnapshot } from '../base';
import { Content, ContentServiceType } from '../types';
import moment from 'moment';
import { ApplicationError } from '../models/Errors';
import logger from './LoggerService';

const COLLECTION = 'content';
const collection = firebase.firestore().collection(COLLECTION);

class ContentService implements ContentServiceType {
  public buildContent = (doc: QueryDocumentSnapshot): Content => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      video: data.video,
      video_orientation: data.video_orientation,
      thumbnail: data.thumbnail,
      description: data.description,
      teacher: data.teacher,
      type: data.type,
      tags: !data.tags
        ? undefined
        : typeof data.tags === 'string'
        ? data.tags.split(', ')
        : Object.values(data.tags),
      seconds: data.seconds,
      length: data.seconds
        ? moment().startOf('day').seconds(data.seconds).format('m:ss')
        : undefined,
      language: data.language,
      status: data.status,
      updated_at: data.updated_at,
      created_at: data.created_at,
    };
  };

  public getContent = async (): Promise<Content[]> => {
    // With no tags passed, get all Content
    const query: any = collection.orderBy('updated_at', 'desc');

    // if (tag) {
    //   query = collection.where('tags', 'array-contains', tag);
    // }

    try {
      return await query
        .get()
        .then((snapshot: any) =>
          snapshot.docs.map((doc: QueryDocumentSnapshot) =>
            this.buildContent(doc),
          ),
        );
    } catch (err) {
      logger.error(`Unable to get all content - ${err}`);
      return Promise.reject(new ApplicationError(err));
    }
  };

  public getLatestUpdate = async (): Promise<Date> => {
    const query: any = collection.orderBy('updated_at', 'desc').limit(1);

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
      logger.error('Unable to get latest content update');
      return Promise.reject(new ApplicationError(err));
    }
  };
}

export default ContentService;
