import axios from 'axios';

// 모든 API 요청에 공통적으로 적용될 설정으로 axios 인스턴스를 생성합니다.
const apiClient = axios.create({
  baseURL: '/',
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 토큰이 있으면 헤더에 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 오류 처리
    return Promise.reject(error);
  }
);

export default apiClient;
