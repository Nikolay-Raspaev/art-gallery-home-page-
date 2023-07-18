import axios from 'axios';
import { host, limit } from '../Consts';
import { IAxiosPainting } from './Interface';

export default class QueryService {
  // @ts-ignore
  static async getPaintings(incomingParams) {
    const url = `${host}/paintings`;
    const params = {
      _page: incomingParams.currentPage,
      _limit: limit,
      ...(incomingParams.selectedAuthorID && {
        authorId: incomingParams.selectedAuthorID
      }),
      ...(incomingParams.selectedLocationId && {
        locationId: incomingParams.selectedLocationId
      }),
      ...(incomingParams.paintingName && {
        name: incomingParams.paintingName
      }),
      ...(incomingParams.dateValue?.from && {
        created_gte: incomingParams.dateValue?.from
      }),
      ...(incomingParams.dateValue?.before && {
        created_lte: incomingParams.dateValue?.before
      })
    };
    return axios.get<IAxiosPainting[]>(url, { params });
  }

  static async getLocations() {
    return (await axios.get(`${host}/locations`)).data;
  }

  static async getAuthors() {
    return (await axios.get(`${host}/authors`)).data;
  }
}