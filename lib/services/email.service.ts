import { HttpService } from './http.service';

export class EmailService {
  private emailUrl = '/api/email';
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
    if (process.env.NEXT_PUBLIC_API_URL) {
      this.emailUrl = 'https://climate-fisheries-backend.vercel.app/email';
    }
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

