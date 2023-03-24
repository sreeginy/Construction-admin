import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const order = [...Array(24)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: `/assets/user${index + 1}.png`,
  name: faker.name.fullName(),
  productName: sample(['Natural Stone', 'Design Stone','cement']),
  total: sample(['20','5','30','40','100','150','200']), 
  deliveryDate: faker.date.recent().getTime(),
  deliveryAddress: sample(['202 Shanti Villa Street, Jaffna', '67 Silkhouse Street, Jaffna', '191 Allaipiddi Street, Point Pedro', '55, The Estate Street, Nelliady']),
  orderStatus: sample(['success', 'process']),
  contactNo: faker.phone.number('+48 91 ### ## ##'), 
  createdAt: faker.date.recent().getTime(),
}));

export default order;