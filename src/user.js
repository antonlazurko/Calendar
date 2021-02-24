export class User {
  isAdmin = false;
  constructor(user) {
    this.user = user;
  }
}
export class Admin extends User {
  constructor(user) {
    super(user);
    this.isAdmin = true;
  }
}
