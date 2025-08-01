export class CreateCategoryRequest {
  name!: string;

  parseToRequest(formData: any): CreateCategoryRequest {
    Object.assign(this, formData);
    return this;
  }
}

export class UpdateCategoryRequest {
  name!: string;

  parseToRequest(formData: any): UpdateCategoryRequest {
    Object.assign(this, formData);
    return this;
  }
}
