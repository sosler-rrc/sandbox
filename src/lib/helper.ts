export abstract class Helper {
  
  public static isValidEmail(email: string): boolean {
    return /.+@.+/.test(email);
  }

  public static getAppUrl(): string{
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  }
}