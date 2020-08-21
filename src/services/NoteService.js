import axios from "axios";
import config from '../config.json'
axios.defaults.baseURL = config.api_url;
const getAll = () => {
  return axios.get("/notes");
};

const get = id => {
  return axios.get(`/notes/${id}`);
};

const create = data => {
  return axios.post("/notes", data);
};


const update = (id, data) => {
  return axios.put(`/notes/${id}`, data);
};

const remove = id => {
  return axios.delete(`/notes/${id}`);
};

const removeAll = () => {
  return axios.delete(`/notes`);
};

const findByTitle = title => {
  return axios.get(`/notes?title=${title}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle
};