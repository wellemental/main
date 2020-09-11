enum SubStatus {
  Canceled = 'canceled',
  Active = 'active',
  Trial = 'trialed',
}

class User {
  public id: string;
  public name: string;
  public email: string;
  public subStatus?: SubStatus;
  public favorites?: string[];

  constructor(
    id: string,
    name: string,
    email: string,
    subStatus: SubStatus,
    favorites: string[],
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.subStatus = subStatus;
    this.favorites = favorites;
  }
}

export default User;
