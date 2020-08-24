// import { firestore } from '../base';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Content } from '../types';
import moment from 'moment';

const COLLECTION = 'content';
const collection = firestore().collection(COLLECTION);

export interface ContentServiceType {
  buildContent(doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): Content;
  getAllContent(): Promise<Content[]>;
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
      seconds: data.length,
      length: moment().startOf('day').seconds(data.length).format('m:ss'),
      language: data.language,
      status: data.status,
      updatedAt: moment(data.updatedAt),
    };
  };

  public getAllContent = async (): Promise<Content[]> => {
    const query = collection;

    return query
      .get()
      .then((snapshot) => snapshot.docs.map((doc) => this.buildContent(doc)));
  };
}

export default ContentService;
