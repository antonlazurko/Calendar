import axios from 'axios';
import 'regenerator-runtime/runtime.js';

const SYSTEM = `anton_lazurko`;
const ENTITY = `events`;
const URL = 'http://158.101.166.74:8080/api/data/';

class EventAPI {
  constructor() {
    this.data = [];
    this.error = {};
    this.status = '';
  }
  async getEvent() {
    try {
      const { data, status } = await axios.get(`${URL}${SYSTEM}/${ENTITY}`);
      this.data = data;
      return data;
    } catch (error) {
      this.error = error;
      console.log(this.error);
      return error;
    }
  }
  async addEvent(body) {
    try {
      const { status } = await axios.post(`${URL}${SYSTEM}/${ENTITY}`, body);
      this.status = status;
      return status;
    } catch (e) {
      this.error = error;
      console.log(this.error);
      return error;
    }
  }
  async deleteEvent(id) {
    try {
      const { status } = await axios.delete(`${URL}${SYSTEM}/${ENTITY}/${id}`);
      this.status = status;
      return status;
    } catch (e) {
      this.error = error;
      console.log(this.error);
      return error;
    }
  }
}
export const eventsSingleton = new EventAPI();
