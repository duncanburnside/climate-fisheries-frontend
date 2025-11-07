import { HttpService } from './http.service';

export class EmailService {
  private emailUrl: string;
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
    // Check for custom API URL (for local development)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const useLocalApi = process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true';
    
    if (apiUrl) {
      // Use custom API URL (e.g., http://localhost:5000)
      this.emailUrl = `${apiUrl}/email`;
    } else if (useLocalApi) {
      // Use Next.js API routes
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

