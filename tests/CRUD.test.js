import axios from 'axios';
import { eventsSingleton } from '../src/services/API-services-Singleton';

jest.mock('axios');

// EVENT GET TESTS
describe('CRUD : GET', () => {
  let response;
  let events;
  beforeEach(() => {
    events = [
      {
        data: "{title:'asd',participants:[1],info:{day:0,time:0}}",
        id: '57dd7db8-8f3e-4fd9-b896-ee3a28d93857',
      },
    ];
    response = { data: { events } };
  });
  test('If event exist sholud return event array', () => {
    axios.get.mockResolvedValue(response);
    return eventsSingleton.getEvent().then((data) => {
      expect(data.events).toEqual(events);
    });
  });
});

describe('CRUD : GET', () => {
  let response;
  let events;
  beforeEach(() => {
    events = null;
    response = { data: { events } };
  });
  test('If event not exist sholud return null', () => {
    axios.get.mockResolvedValue(response);
    return eventsSingleton.getEvent().then((data) => {
      expect(data.events).toEqual(events);
    });
  });
});

// EVENT CREATE TEST
describe('CRUD : POST', () => {
  let response;
  let status;
  let body;
  beforeEach(() => {
    body = '{ title: "asd", participants: [4], info: { day: 2, time: 8 } }';
    status = 200;
    response = { data: { status } };
  });
  test('If event was added should be called', () => {
    axios.post.mockResolvedValue(response);
    eventsSingleton.addEvent(body).then(() => {
      expect(eventsSingleton.addEvent).toHaveBeenCalled();
    });
  });
});

// // EVENT DELETE TEST
describe('CRUD : DELETE', () => {
  let response;
  let status;
  let id;
  beforeEach(() => {
    status = 204;
    id = 'dd1800c6-32ff-4871-b929-b0104d633de9';
    response = { data: { status } };
  });
  test('If event was deleted should be called', () => {
    axios.delete.mockResolvedValue(response);
    eventsSingleton.deleteEvent(id).then(() => {
      expect(eventsSingleton.deleteEvent).toHaveBeenCalled();
    });
  });
});
