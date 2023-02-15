export class ResultModel<TEntity> {
  constructor(success: boolean, errors?: string[], data?: TEntity) {
    this.success = success;
    this.errors = errors;
    this.data = data;
  }

  success: boolean;
  errors?: string[];
  data?: TEntity;
}
