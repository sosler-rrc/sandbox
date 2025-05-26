export abstract class Helper {
  
  public static isValidEmail(email: string): boolean {
    return /.+@.+/.test(email);
  }
}