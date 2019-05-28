export default class Income {

  constructor(
    amount = 0.00,
    date = new Date().toISOString().substr(0, 10),
    description = '',
    received = false,
    category = '',
    account = '',
    note = ''
  ) {

    this.amount = amount;
    this.date = date;
    this.description = description;
    this.received = received;
    this.category = category;
    this.account = account;
    this.note = note;
  }

}