import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(1)].map((_, index) => ({
  id: faker.datatype.uuid(),
  firstName: 'Sreeginy',
  lastName: 'Giny',
  email: 'giny@mail.com',
  password: 'DftG5Hnuxc3vS',
  roleId: sample(['Admin']),
  createdAt: faker.date.recent().getTime()
}));

export default users;
