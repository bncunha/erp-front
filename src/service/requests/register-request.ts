export class CreateCompanyUserRequest {
  name!: string;
  username!: string;
  phone_number?: string;
  email!: string;
  password!: string;

  parseToRequest(data: any): CreateCompanyUserRequest {
    this.name = data.user_name;
    this.username = data.username;
    this.phone_number = data.user_phone_number;
    this.email = data.email;
    this.password = data.password;
    return this;
  }
}

export class CreateCompanyAddress {
  street!: string;
  neighborhood!: string;
  number!: string;
  city!: string;
  uf!: string;
  cep!: string;

  parseToRequest(data: any): CreateCompanyAddress {
    this.street = data.street;
    this.neighborhood = data.neighborhood;
    this.number = data.number;
    this.city = data.city;
    this.uf = data.uf;
    this.cep = data.cep;
    return this;
  }
}

export class CreateCompanyRequest {
  name!: string;
  legalName!: string;
  cnpj?: string;
  cpf?: string;
  cellphone!: string;
  address!: CreateCompanyAddress;
  user!: CreateCompanyUserRequest;

  parseToRequest(form: any, isPessoaFisica: boolean): CreateCompanyRequest {
    const { companyData, address, userData } = form;
    this.name = companyData.name;
    this.legalName = isPessoaFisica ? companyData.name : companyData.legalName;
    this.cnpj = isPessoaFisica ? undefined : companyData.cnpj;
    this.cpf = isPessoaFisica ? companyData.cpf : undefined;
    this.cellphone = companyData.cellphone;
    this.address = new CreateCompanyAddress().parseToRequest(address);
    this.user = new CreateCompanyUserRequest().parseToRequest(userData);
    return this;
  }
}
