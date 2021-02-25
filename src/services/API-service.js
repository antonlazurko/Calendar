import axios from 'axios';
import 'regenerator-runtime/runtime.js';

const SYSTEM = `'anton_lazurko'`;
const ENTITY = `'events'`;
const URL = 'http://158.101.166.74:8080/api/data/';

export const getEvents = async () => {
  try {
    const meetings = await axios.get(`${URL}${SYSTEM}/${ENTITY}`);
    console.log(meetings);
  } catch (e) {
    console.log(e);
  }
};
export const deleteEvent = async id => {
  axios.delete(
    `${URL}${SYSTEM}/${ENTITY}/d940ab7a-ba88-4982-869c-ed3c9eb91519`,
  );
};
