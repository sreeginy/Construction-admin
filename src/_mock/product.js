import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { mockImgProduct } from '../../src/utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl:  mockImgProduct(index + 1),
  pro_name: faker.name.fullName(),
  pro_type: sample(['stone', 'soil']),
  price: faker.commerce.price(100, 200, 0,'Rs'),
  pro_item: sample(['8','2','3','4','5','10','15']), 
  pro_status: sample(['active', 'banned']),
  createdAt: faker.date.recent().getTime(),
 
}));

export default users;