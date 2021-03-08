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
  test('If event exist sholud return event array', async () => {
    axios.get.mockReturnValue(response);
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
  test('If event not exist sholud return null', async () => {
    axios.get.mockReturnValue(response);
    return eventsSingleton.getEvent().then((data) => {
      expect(data.events).toEqual(events);
    });
  });
});

// EVENT CREATE TEST
describe('CRUD : POST', () => {
  let response;
  let statusCode;
  let body;
  beforeEach(() => {
    body = '{ title: "asd", participants: [4], info: { day: 2, time: 8 } }';
    statusCode = 200;
    response = { status };
  });
  test('If event created sholud return status 200', async () => {
    axios.post.mockReturnValue(response);
    return eventsSingleton.addEvent(body).then((status) => {
      expect(status).toEqual(statusCode);
    });
  });
});

// EVENT DELETE TEST
describe('CRUD : DELETE', () => {
  let response;
  let statusCode;
  let eventId;
  beforeEach(() => {
    statusCode = 204;
    eventId = '0c7c939f-42dc-4b7f-9f3c-7115dbc0d283';
    response = { status };
  });
  test('If event was deleted should return status 204', async () => {
    axios.delete.mockReturnValue(response);
    return eventsSingleton.deleteEvent(eventId).then((status) => {
      expect(status).toEqual(statusCode);
    });
  });
});
