export interface IUsersRepository {
  findById(id: string): Promise<any>;

  findByEmail(email: string): Promise<any>;

  create(data: any): Promise<any>;

  update(id: string, data: any): Promise<any>;

  delete(id: string): Promise<any>;
}
