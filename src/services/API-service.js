import axios from 'axios';
import 'regenerator-runtime/runtime.js';

const SYSTEM = `anton_lazurko`;
const ENTITY = `events`;
const URL = 'http://158.101.166.74:8080/api/data/';

export const getEvents = async () => {
  try {
    const { data, status } = await axios.get(`${URL}${SYSTEM}/${ENTITY}`);
    console.log(status);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const addEvent = async body => {
  try {
    const { status } = await axios.post(`${URL}${SYSTEM}/${ENTITY}`, body);
    console.log(status);
    return status;
  } catch (e) {
    console.log(e);
  }
};

export const deleteEvent = async id => {
  try {
    const { status } = await axios.delete(`${URL}${SYSTEM}/${ENTITY}/${id}`);
    console.log(status);
    return status;
  } catch (e) {
    console.log(e);
  }
};
