import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const order = [...Array(24)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: `/assets/user${index + 1}.png`,
  name: faker.name.fullName(),
  total: sample(['20','5','30','40','100','150','200']), 
  deliveryDate: faker.date.recent().getTime(),
  status: sample(['success', 'process']),
 
}));

export default order;