
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const customer = [...Array(10)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: `/assets/user${index + 1}.png`,
  name: faker.name.fullName(),
  address: faker.address.secondaryAddress(),
  userEmail: faker.internet.email(),
  contact: faker.phone.number('+48 91 ### ## ##'), 
 
}));

export default customer;