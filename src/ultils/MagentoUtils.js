import { AppConfig, Images } from '@common'

export const getCustomAttribute = (customAttributes, attribute) => {
    var value = null
    if (typeof customAttributes != 'undefined' && customAttributes.length > 0) {
        customAttributes.forEach((item) => {
            if (item.attribute_code == attribute) {
                value = item.value
                return
            }
        })
    }
    return value
}

export const getProductImageUrlByName = (imageName) => {
    return AppConfig.Magento.url + "/media/catalog/product/" + imageName
}

export const getProductImageUrl = (item, attribute = "thumbnail") => {
    const imageName = getCustomAttribute(item.custom_attributes, attribute)
    if (imageName) {
        return imageName.indexOf("http") > -1 ? imageName : getProductImageUrlByName(imageName)
    }
    return ""
}

export const getCategoryImageUrl = (imageName) => {
    return "http://beta.cavaraty.com" + "/media/catalog/category/" + imageName
}