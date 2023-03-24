
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { mockImgAvatar, mockImgProduct } from '../../src/utils/mockImages';

// ----------------------------------------------------------------------

const employee = [...Array(10)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.name.fullName(),
  position: sample(['Engineer','Supervisor', 'Manager']),
  bio: faker.lorem.sentence(3),
  email: faker.internet.url(),
  facebook: sample ([ 'facebook/john', 'facebook/rockey','facebook/willims','facebook/smith']),
  twitter: sample ([ 'twitter/john', 'twitter/rockey','twitter/willims','twitter/smith']),
  linkedin: sample ([ 'linkedin/john', 'linkedin/rockey','linkedin/willims','linkedin/smith']),
//   facebook: sample ([ 'facebook.com/john.doe', 'facebook.com/james.rockey','facebook.com/willims.dono','facebook.com/john.smith'])
createdAt: faker.date.recent().getTime(),
}));

export default employee;