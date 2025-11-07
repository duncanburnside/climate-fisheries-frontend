import { HttpService } from './http.service';

export class EmailService {
  private emailUrl: string;
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
    // Default to deployed backend, use local API routes only if explicitly configured
    const useLocalApi = process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true';
    if (useLocalApi) {
      this.emailUrl = '/api/email';
    } else {
      // Use deployed backend by default
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

