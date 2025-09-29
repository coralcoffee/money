import apiBase from './ApiBase';

export async function get() {
  return apiBase.get('/abp/api-definition');
}
