import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { mockImgProduct } from '../../src/utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  productNo: faker.datatype.number(),
  avatarUrl:  mockImgProduct(index + 1),
  productName: faker.name.fullName(),
  productType: sample(['stone', 'soil']),
  price: faker.commerce.price(100, 200, 0,'Rs'),
  quantity: sample(['8','2','3','4','5','10','15']), 
  productStatus: sample(['active', 'banned']),
  createdAt: faker.date.recent().getTime(),
 
}));

export default users;