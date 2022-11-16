/** @format */

export default class ShippingMethod {
  constructor(post) {
    const { carrier_code, carrier_title, method_title, method_code, available, amount } = post;

    try {
      this.id = carrier_code;
      this.carrier_code = carrier_code
      this.method_code = method_code
      this.amount = amount
      this.title = carrier_title;
      this.enabled = available;
      this.order = 0;
      this.method_title = method_title;
      this.method_id = method_code;
      this.method_description = carrier_title;
      this.settings = {
        title: {
          value: carrier_title,
        },
        cost: {
          value: amount,
        },
      };
    } catch (e) {
      console.error(e.message);
    }
  }
}
