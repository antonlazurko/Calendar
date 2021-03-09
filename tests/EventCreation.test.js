import 'regenerator-runtime/runtime.js';
import onFormSubmit from './simulateSubmit';

jest.mock('./simulateSubmit');

describe('submit', () => {
  test('event should be created', () => {
    expect(onFormSubmit).toHaveBeenCalled();
  });
});
