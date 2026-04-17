export interface IUser {
  username: string;
  pwd: string;
}

export class User implements IUser {
  username: string;
  pwd: string;

  constructor(username?: string, pwd?: string) {
    this.username = username || '';
    this.pwd = pwd || '';
  }
}
