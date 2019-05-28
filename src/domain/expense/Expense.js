export default class Expense {

  constructor(
    amount = 0.00,
    date = new Date().toISOString().substr(0, 10),
    description = '',
    paid = false,
    category = '',
    account = '',
    note = ''
  ) {

    this.amount = amount;
    this.date = date;
    this.description = description;
    this.paid = paid;
    this.category = category;
    this.account = account;
    this.note = note;
  }

}