export default class User {
  constructor(post) {
    const {
      id,
      firstname,
      lastname,
      email
    } = post

    try {
      this.id = id
      this.first_name = firstname
      this.last_name = lastname
      this.email = email
      this.billing = {
        first_name: firstname,
        last_name: lastname,
        email: email,
        address_1: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
        phone: ""
      }
    } catch (e) {
      console.error(e.message)
    }
  }
}
