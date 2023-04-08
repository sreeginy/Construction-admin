
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const customer = [...Array(10)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: `/assets/user${index + 1}.png`,
  firstName: faker.name.fullName(),
  lastName: sample(['Giny']),
  address: faker.address.secondaryAddress(),
  email: faker.internet.email(),
  contactNo: faker.phone.number('+48 91 ### ## ##'), 
  deliveryAddress: sample(['202 Shanti Villa Street, Jaffna', '67 Silkhouse Street, Jaffna', '191 Allaipiddi Street, Point Pedro', '55, The Estate Street, Nelliady']),
  createdAt: faker.date.recent().getTime(),
 
}));

export default customer;