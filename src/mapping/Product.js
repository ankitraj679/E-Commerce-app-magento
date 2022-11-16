import _ from 'lodash'

export default class Product {
  constructor(post) {
    const {
      id,
      name,
      slug,
      created_at,
      updated_at,
      parent_id,
      description,
      tags,
      attributes,
      enabled,
      sku,
      tax_class,
      related_product_ids,
      price,
      sale_price,
      regular_price,
      date_sale_from,
      date_sale_to,
      on_sale,
      status,
      dimensions,
      images,
      weight,
      quantity,
      stock_backorder,
      category_ids,
      options,
      variants,
      url,
      media_gallery_entries
    } = post

    try {
      this.id = id
      this.name = name
      this.slug = slug
      this.permalink = ""
      this.date_created = created_at
      this.date_created_gmt = created_at
      this.date_modified = updated_at
      this.date_modified_gmt = updated_at
      this.type = ""
      this.status = enabled ? "publish" : ""
      this.featured = false
      this.catalog_visibility = ""
      this.description = description
      this.short_description = ""
      this.sku = sku
      this.price = price
      this.regular_price = regular_price
      this.sale_price = sale_price
      this.date_on_sale_from = date_sale_from
      this.date_on_sale_from_gmt = date_sale_from
      this.date_on_sale_to = date_sale_to
      this.date_on_sale_to_gmt = date_sale_to
      this.price_html = ""
      this.on_sale = on_sale
      this.purchasable = true
      this.total_sales = 0
      this.virtual = false
      this.downloadable = false
      this.downloads = []
      this.download_limit = -1
      this.download_expiry = -1
      this.external_url = ""
      this.button_text = ""
      this.tax_status = ""
      this.tax_class = tax_class
      this.manage_stock = ""
      this.stock_quantity = quantity
      this.in_stock = status == 1
      this.backorders = ""
      this.backorders_allowed = stock_backorder
      this.backordered = false
      this.sold_individually = false
      this.weight = weight
      this.dimensions = dimensions
      this.shipping_required = true
      this.shipping_taxable = true
      this.shipping_class = ""
      this.shipping_class_id = 0
      this.reviews_allowed = true
      this.average_rating = ""
      this.rating_count = 0
      this.related_ids = related_product_ids
      this.upsell_ids = []
      this.cross_sell_ids = []
      this.parent_id = parent_id
      this.purchase_note = ""
      this.categories = category_ids
      this.tags = tags

      var imgItems = []
      if (images && images.length > 0) {
        images.forEach((item) => {
          imgItems.push({ src: item })
        })
      }
      this.images = imgItems

      if (attributes && attributes.length > 0) {
        attributes.forEach((item) => {
          item.position = 0
          item.options = [item.value]
          item.visible = true
        })
      }
      this.attributes = attributes
      this.default_attributes = []

      if (variants && variants.length > 0) {
        variants.forEach((item) => {
          item.options.forEach((option) => {
            let { optionName, value } = this.getValueOption(options, option.option_id, option.value_id)
            option.value_name = value
            option.option_name = optionName
          })
        })
      }

      this.options = options
      this.variations = variants

      this.grouped_products = []
      this.menu_order = 0
      this.meta_data = []
      this.permalink = url

      if (media_gallery_entries && media_gallery_entries.length > 0) {
        const media = _.find(media_gallery_entries, (item) => item.media_type == "external-video")
        if (media) {
          this.videoLink = media.extension_attributes.video_content.video_url
        }
      }
    } catch (e) {
      console.error(e.message)
    }
  }

  getValueOption = (options, optionId, valueId) => {
    var option = null
    var value = null
    var optionName = null
    options.forEach((item) => {
      if (item.id == optionId) {
        option = item
        return
      }
    })
    if (option) {
      option.values.forEach((item) => {
        if (item.id == valueId) {
          value = item.name
          optionName = option.name
          return
        }
      })
    }

    return { optionName, value }
  }
}
