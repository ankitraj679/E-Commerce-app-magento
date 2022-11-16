export default class Review {
  constructor(post) {
    const {
      id,
      author,
      raw_message,
      createdAt,
      parent,
      likes,
      isLiked
    } = post

    try {
      this.id = id
      this.name = author.name
      this.avatar = author.avatar.cache
      this.review = raw_message
      this.date_created = createdAt
      this.rating = 0
      this.parent = parent
      this.likes = likes,
      this.isLiked = isLiked

    } catch (e) {
      console.error(e.message)
    }
  }
}
