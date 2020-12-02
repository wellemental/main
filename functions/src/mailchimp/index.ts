import * as functions from 'firebase-functions';
import { McTags } from '../types';

const md5 = require('md5');

// import and initialize Mailchimp instance
const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(functions.config().mailchimp.secret);

const mcList = functions.config().mailchimp.list;

const md5HashEmail = (email: string): string => {
  return md5(email.toLowerCase());
};

export const mcTagUser = async (email: string, tag: McTags): Promise<void> => {
  try {
    const hashedEmail = md5HashEmail(email);
    await mailchimp.post({
      path: `/lists/${mcList}/members/${hashedEmail}/tags`,
      body: {
        tags: [
          {
            name: tag,
            status: 'active',
          },
        ],
      },
    });
    return Promise.resolve();
  } catch (err) {
    console.log(`Error tagging player ${email} with ${tag}`);
    return Promise.reject();
  }
};
