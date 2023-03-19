import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  pro_id: faker.datatype.number(),
  avatarUrl: `../../assets/user${index + 1}.png`,
  pro_name: faker.name.fullName(),
  pro_type: sample(['stone', 'soil']),
  pro_description: faker.commerce.product(),
  pro_item: sample(['8','2','3','4','5','10','15']), 
  pro_status: sample(['active', 'banned']),
 
}));

export default users;