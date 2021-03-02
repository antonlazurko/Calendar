import { User, Admin } from './user';

export const daysArray = [
  {
    id: 0,
    name: 'monday',
  },
  {
    id: 1,
    name: 'thuesday',
  },
  {
    id: 2,
    name: 'wednesday',
  },
  {
    id: 3,
    name: 'thursday',
  },
  {
    id: 4,
    name: 'friday',
  },
];
export const timeArray = [
  {
    id: 0,
    name: '10:00',
  },
  {
    id: 1,
    name: '11:00',
  },
  {
    id: 2,
    name: '12:00',
  },
  {
    id: 3,
    name: '13:00',
  },
  {
    id: 4,
    name: '14:00',
  },
  {
    id: 5,
    name: '15:00',
  },
  {
    id: 6,
    name: '16:00',
  },
  {
    id: 7,
    name: '17:00',
  },
  {
    id: 8,
    name: '18:00',
  },
];

export const participants = [
  new User({
    id: 1,
    name: 'John',
    meetings: [],
  }),
  new User({
    id: 2,
    name: 'Maria',
    meetings: [],
  }),
  new User({
    id: 3,
    name: 'David',
    meetings: [],
  }),
  new User({
    id: 4,
    name: 'Anna',
    meetings: [],
  }),
  new Admin({
    id: 5,
    name: 'BIG BOSS',
    meetings: [],
  }),
];
