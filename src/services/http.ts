import axios from "axios";
import type { AxiosInstance } from "axios";
import { fakeAdapter } from "./fakeServer";

const http: AxiosInstance = axios.create({
  adapter: fakeAdapter,
});

export default http;
