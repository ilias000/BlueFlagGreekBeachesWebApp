import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'http://localhost:8080/',
});

export default baseAxios;