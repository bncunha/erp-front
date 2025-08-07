export class LoginRequest {
  username!: string;
  password!: string;

  parseToRequest(formData: any): LoginRequest {
    Object.assign(this, formData);
    return this;
  }
}
