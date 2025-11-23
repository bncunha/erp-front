export class ChangePasswordRequest {
  code!: string;
  uuid!: string;
  password!: string;

  parseToRequest(formData: any, code: string, uuid: string): ChangePasswordRequest {
    Object.assign(this, formData);
    this.code = code;
    this.uuid = uuid;
    return this;
  }

  passwordsMatch(confirmPassword: string): boolean {
    return this.password === confirmPassword;
  }
}


export class ForgotPasswordRequest {
  email!: string;

  parseToRequest(formData: any): ForgotPasswordRequest {
    Object.assign(this, formData);
    return this;
  }
}