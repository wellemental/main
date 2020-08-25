// import { firestore } from '../base';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Content, Tags } from '../types';
import moment from 'moment';
import { ApplicationError } from '../models/Errors';

const COLLECTION = 'content';
const collection = firestore().collection(COLLECTION);

export interface ContentServiceType {
  buildContent(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): Content;
  getContent(): Promise<Content[]>;
}

class ContentService implements ContentServiceType {
  public buildContent = (
    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
  ): Content => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      video: data.video,
      thumbnail: data.thumbnail,
      description: data.description,
      teacher: data.teacher,
      type: data.type,
      tags: !data.tags
        ? undefined
        : typeof data.tags === 'string'
        ? data.tags.split(', ')
        : Object.values(data.tags),
      seconds: data.length,
      length: moment().startOf('day').seconds(data.length).format('m:ss'),
      language: data.language,
      status: data.status,
      updated_at: moment(data.updated_at),
      created_at: moment(data.created_at),
    };
  };

  public getContent = async (): Promise<Content[]> => {
    // With no tags passed, get all Content
    const query: FirebaseFirestoreTypes.CollectionReference = collection;

    // if (tag) {
    //   query = collection.where('tags', 'array-contains', tag);
    // }

    try {
      return await query
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => this.buildContent(doc)));
    } catch (err) {
      return Promise.reject(new ApplicationError(err));
    }
  };
}

export default ContentService;
