import axios from 'axios';
import 'regenerator-runtime/runtime.js';
import { ErrorDecorator } from './API-error-Decorator.js';
const SYSTEM = `anton_lazurko`;
const ENTITY = `events`;
const URL = 'http://158.101.166.74:8080/api/data/';

let instance = null;

class EventAPI {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }
  @ErrorDecorator
  async getEvent() {
    const { data } = await axios.get(`${URL}${SYSTEM}/${ENTITY}`);
    return data;
    // try {
    //   const { data, status } = await axios.get(`${URL}${SYSTEM}/${ENTITY}`);
    //   this.data = data;
    //   this.status = status;
    //   return this.data;
    // } catch (error) {
    //   this.error = error;
    //   return this.error;
    // }
  }
  @ErrorDecorator
  async addEvent(body) {
    const { status } = await axios.post(`${URL}${SYSTEM}/${ENTITY}`, body);
    return status;
    // try {
    //   const { status } = await axios.post(`${URL}${SYSTEM}/${ENTITY}`, body);
    //   this.status = status;
    //   return this.status;
    // } catch (error) {
    //   this.error = error;
    //   return this.error;
    // }
  }
  @ErrorDecorator
  async deleteEvent(id) {
    const { status } = await axios.delete(`${URL}${SYSTEM}/${ENTITY}/${id}`);
    return status;
    // try {
    //   const { status } = await axios.delete(`${URL}${SYSTEM}/${ENTITY}/${id}`);
    //   this.status = status;
    //   return this.status;
    // } catch (error) {
    //   this.error = error;
    //   return this.error;
    // }
  }
}
export const eventsSingleton = new EventAPI();
