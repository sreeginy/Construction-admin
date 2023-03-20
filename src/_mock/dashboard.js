import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const dashboard = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  email: faker.internet.email(),
  role: sample([
    'Super Admin',
    'Admin',
    'Admin User',
  ]),
  status: sample(['active', 'banned']),
  createdAt: faker.date.recent().getTime(),
}));

export default dashboard;
