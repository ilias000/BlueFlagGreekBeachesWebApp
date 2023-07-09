import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'https://localhost:8080/',
});

export default baseAxios;