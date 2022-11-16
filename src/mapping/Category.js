export default class Category {
  constructor(post) {
    const {
      id,
      name,
      slug,
      parent_id,
      description,
      image,
      position,
      is_active,
      product_count
    } = post

    try {
      this.id = id
      this.name = name
      this.slug = slug
      this.parent = parent_id == undefined ? 0 : parent_id
      this.description = description
      this.display = is_active
      this.image = {
        id: "",
        src: image,
        title: "",
        alt: ""
      }
      this.menu_order = position
      this.count = product_count

    } catch (e) {
      console.error(e.message)
    }
  }
}
