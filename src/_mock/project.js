import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const project = [...Array(24)].map((_, index) => ({
  id: faker.datatype.number(),
  avatarUrl: `../../assets/user${index + 1}.png`,
  name: faker.name.fullName(),
  type: sample(['house', 'office', 'school', 'shop']),
  description: faker.lorem.sentence(3),
  duration: sample([' 12 Months', '15 Months', '20 Months' ]),
  status: sample(['complete', 'process']),
  location: sample(['Jaffna', 'Point Pedro','Kodikamam','Vaddukottai', "Vavuniya"]),
  client: sample(['Mr.John Doe', 'Mr.James Rockey','Mr.Willims Dono','Mrs. John Smith']),
  createdAt: faker.date.recent().getTime(),
}));

export default project;