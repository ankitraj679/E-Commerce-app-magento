export default class Address {
  constructor(post) {
    const {
      state,
      country,
      address_1,
      postcode,
      city,
      first_name,
      last_name,
      userId,
      phone,
      email
    } = post

    try {
      this.region = state
      this.region_id = 43
      this.country_id = country
      this.street = [address_1]
      this.postcode = postcode
      this.city = city
      this.firstname = first_name
      this.lastname = last_name
      this.customer_id = userId
      this.email = email
      this.telephone = phone
    } catch (e) {
      console.error(e.message)
    }
  }
}
