import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const project = [...Array(24)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: `../../assets/user${index + 1}.png`,
  name: faker.name.fullName(),
  type: sample(['house', 'office', 'school', 'shop']),
  description: faker.name.findName(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
 
}));

export default project;