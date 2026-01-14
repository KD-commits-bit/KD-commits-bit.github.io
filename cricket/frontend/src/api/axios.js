import axios from 'axios';

// 모든 API 요청에 공통적으로 적용될 설정으로 axios 인스턴스를 생성합니다.
const apiClient = axios.create({
  baseURL: '/', // baseURL은 기존처럼 유지하거나 필요시 '/api' 등으로 변경할 수 있습니다.
  withCredentials: true // 쿠키를 요청에 포함시키기 위한 설정
});

export default apiClient;