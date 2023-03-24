import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: sample([' Wall tiling ', 'Compound wall', 'Interior Design']),
  projectName: faker.company.name(),
  description: faker.lorem.sentence(3),
  category: sample([ 'ESSENTIAL', 'PREMIUM', 'LUXURIOUS', 'THE ONE']),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  createdAt: faker.date.recent().getTime(),
}));

export default users;
