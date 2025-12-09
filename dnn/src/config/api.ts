export const API_BASE_URL = "https://dunu-backend.onrender.com;
export const API_ENDPOINTS = {
  MUSIC: { UPLOAD: `${API_BASE_URL}/upload` },
  PUBLIC: {
    CONTACT: `${API_BASE_URL}/public/contact`,
    ARTICLES: `${API_BASE_URL}/public/articles`,
    EVENTS: `${API_BASE_URL}/public/events`,
    COURSES: `${API_BASE_URL}/public/courses`,
  },
  ADMIN: {
    LOGIN: `${API_BASE_URL}/admin/login`,
    TRACKS: `${API_BASE_URL}/admin/tracks`,
    TRACK_ACTION: (id: string, action: string) => `${API_BASE_URL}/admin/tracks/${id}/${action}`,
    DELETE_TRACK: (id: string) => `${API_BASE_URL}/admin/tracks/${id}`,
    MESSAGES: `${API_BASE_URL}/admin/messages`,
    MESSAGE_ACTION: (id: string, action: string) => `${API_BASE_URL}/admin/messages/${id}/${action}`,
    DELETE_MESSAGE: (id: string) => `${API_BASE_URL}/admin/messages/${id}`,
    ARTICLES: `${API_BASE_URL}/admin/articles`,
    DELETE_ARTICLE: (id: string) => `${API_BASE_URL}/admin/articles/${id}`,
    EVENTS: `${API_BASE_URL}/admin/events`,
    DELETE_EVENT: (id: string) => `${API_BASE_URL}/admin/events/${id}`,
    COURSES: `${API_BASE_URL}/admin/courses`,
    DELETE_COURSE: (id: string) => `${API_BASE_URL}/admin/courses/${id}`,
    SCRAPE: `${API_BASE_URL}/admin/scrape`,
  },
};