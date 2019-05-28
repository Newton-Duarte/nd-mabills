export default class Account {

  constructor(
    description = '',
    balance = 0.00,
    type = '',
    color = '',
  ) {

    this.description = description;
    this.balance = balance;
    this.type = type;
    this.color = color;
  }

}