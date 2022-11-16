export default class MyOrder {
  constructor(item) {
    const {
      entity_id,
      increment_id,
      created_at,
      status,
      payment,
      base_subtotal,
      base_grand_total,
      items,

    } = item

    try {
      this.id = entity_id
      this.number = increment_id
      this.date_created = created_at
      this.status = status
      this.payment_method_title = payment.additional_information[0]
      this.total = base_grand_total
      this.sub_total = base_subtotal
      this.shipping_total = item.shipping_amount ? item.shipping_amount : 0

      if (items.length > 0) {
        items.forEach((item) => {
          item.total = item.price
          item.quantity = item.qty_ordered
        })
      }
      this.line_items = items
      this.currency = "$"

      const address = item.extension_attributes.shipping_assignments[0].shipping.address
      this.shipping = {
        address_1: address.street[0],
        postcode: address.postcode,
        city: address.city,
        state: address.region,
        country: address.country_id,
      }

    } catch (e) {
      console.error(e.message)
    }
  }
}
