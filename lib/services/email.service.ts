import { HttpService } from './http.service';

export class EmailService {
  private emailUrl = '/api/email';
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async sendEmail(
    name: string,
    subject: string,
    email: string,
    message: string
  ): Promise<any> {
    const url = this.emailUrl;
    const params = {
      name,
      subject,
      email,
      message
    };
    return this.httpService.sendPost(url, params);
  }
}

