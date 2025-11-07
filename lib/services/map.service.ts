import { HttpService } from './http.service';
import { MapTypes } from '../models/MapTypes';

export class MapService {
  private zoneUrl = '/api/zone';
  private pixelUrl = '/api/pixel';
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
    if (process.env.NEXT_PUBLIC_API_URL) {
      this.zoneUrl = 'https://climate-fisheries-backend.vercel.app/zone';
      this.pixelUrl = 'https://climate-fisheries-backend.vercel.app/pixel';
    }
  }

  async getCountries(): Promise<any> {
    const url = '/assets/geoJSONs/countries.json';
    return this.httpService.sendGet(url, {});
  }

  async getAntarctica(): Promise<any> {
    const url = '/assets/geoJSONs/antarctica.geojson';
    return this.httpService.sendGet(url, {});
  }

  async getZone(model: string, indicator: string, climate: string, period: string, id: string): Promise<any> {
    const url = this.zoneUrl;
    const params = {
      model,
      indicator,
      climate,
      period,
      id
    };
    return this.httpService.sendGet(url, {}, params);
  }

  async getZoneAsset(model: string): Promise<any> {
    const url = `/assets/geoJSONs/${model}.json`;
    return this.httpService.sendGet(url, {});
  }

  async getPixel(
    indicator: string,
    climate: string,
    period: string,
    latitude: number,
    longitude: number
  ): Promise<any> {
    const url = this.pixelUrl;
    const params = {
      indicator,
      climate,
      period,
      latitude,
      longitude
    };
    return this.httpService.sendGet(url, {}, params);
  }
}

