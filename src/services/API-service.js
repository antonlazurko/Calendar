import axios from 'axios';
import 'regenerator-runtime/runtime.js';

const SYSTEM = `anton_lazurko`;
const ENTITY = `events`;
const URL = 'http://158.101.166.74:8080/api/data/';

export const getEvents = async () => {
  try {
    const { data } = await axios.get(`${URL}${SYSTEM}/${ENTITY}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const addEvent = async body => {
  axios
    .post(`${URL}${SYSTEM}/${ENTITY}`, body)
    .then(console.log)
    .catch(console.log);
};

export const deleteEvent = async id => {
  axios.delete(`${URL}${SYSTEM}/${ENTITY}/${id}`);
};
