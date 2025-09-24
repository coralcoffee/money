import ApiBase from './ApiBase';

export async function get() {
  return ApiBase.get('/abp/api-definition');
}
