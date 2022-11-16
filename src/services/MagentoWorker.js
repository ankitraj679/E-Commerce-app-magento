import { AppConfig } from '@common'
import axios from 'axios'
import { Category, Product, User, ShippingMethod, PaymentMethod, Address, MyOrder } from '@mapping'
import * as MagentoUtils from '@utils/MagentoUtils'
import moment from 'moment'
import { warn } from "@app/Omni";

export const getUserInfo = (token) => {
    return new Promise((resolve, reject) => {
        axios.get(AppConfig.Magento.url + "/index.php/rest/V1/customers/me", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(({ data }) => {
                var user = new User(data)
                axios.get(AppConfig.Magento.url + "/index.php/rest/V1/customers/me/shippingAddress", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(({ data }) => {
                        if (data && Object.keys(data).length > 0) {
                            const { street, city, region, postcode, telephone, country_id } = data
                            user.billing = { ...user.billing, address_1: street.length > 0 ? street[0] : "", city, state: region.region, postcode, phone: telephone, country: country_id }
                            resolve({ user, token })
                        } else {
                            resolve({ user, token })
                        }
                    })
                    .catch((err) => {
                        if (err.response && err.response.data.message) {
                            reject(err.response.data.message)
                        } else {
                            reject("Server don't response correctly")
                        }
                    })
            })
            .catch((err) => {
                if (err.response && err.response.data.message) {
                    reject(err.response.data.message)
                } else {
                    reject("Server don't response correctly")
                }
            })
    })
}
export const getCategoryById = (item) => {
    return new Promise((resolve, reject) => {
        if (item.image) {
            const image = MagentoUtils.getCategoryImageUrl(item.image)
            resolve({ ...item, image })
        } else {
            resolve(item)
        }
    })
}

export const getCategories = () => {
    return new Promise((resolve, reject) => {
        axios.get(AppConfig.Magento.url + "/index.php/rest/V1/mstore/categories", {
            headers: {
                'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
            }
        })
            .then(({ status, data }) => {
                if (status == 200 && data) {
                    const children_data = data.children_data
                    var categories = []
                    var items = []
                    if (children_data) {
                        children_data.forEach((item1, index) => {
                            categories.push({ ...item1, parent_id: 0 })
                            if (item1.children_data.length > 0) {
                                item1.children_data.forEach((item2, index) => {
                                    categories.push(item2)
                                    if (item2.children_data.length > 0) {
                                        item2.children_data.forEach((item3, index) => {
                                            categories.push(item3)
                                            if (item3.children_data.length > 0) {
                                                item3.children_data.forEach((item4, index) => {
                                                    categories.push(item4)
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                    if (categories) {
                        var count = 0
                        categories.forEach((item, index) => {
                            getCategoryById(item)
                                .then((category) => {
                                    count += 1
                                    if (category) {
                                        const cat = new Category({ ...category, product_count: item.product_count, parent_id: item.parent_id })
                                        items.push(cat)
                                    }

                                    if (count == categories.length) {
                                        resolve({ categories: items, categoriesTree: children_data })
                                    }
                                })
                                .catch((err) => { })
                        })
                    }
                } else {
                    resolve([])
                }
            })
            .catch(reject)
    })
}

export const getAllProducts = (per_page, page, order, orderby) => {
    return new Promise((resolve, reject) => {
        var url = AppConfig.Magento.url + `/index.php/rest/V1/mstore/products?searchCriteria[sortOrders][1][field]=${orderby}&searchCriteria[sortOrders][1][direction]=${order}&searchCriteria[pageSize]=${per_page}&searchCriteria[currentPage]=${page}`
        axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
            }
        })
            .then(({ status, data }) => {
                if (status == 200 && data.items) {
                    var items = []
                    data.items.forEach((item) => {
                        const date_sale_from = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_from_date")
                        const date_sale_to = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_to_date")
                        var on_sale = false
                        var price = item.price
                        if (date_sale_from && date_sale_to) {
                            on_sale = moment().isBetween(moment(date_sale_from), moment(date_sale_to))
                            if (on_sale) {
                                price = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price")
                            }
                        }
                        const media_gallery_entries = item.media_gallery_entries
                        var images = [MagentoUtils.getProductImageUrl(item, "thumbnail")]
                        if (media_gallery_entries && media_gallery_entries.length > 1) {
                            for (let index = 1; index < media_gallery_entries.length; index++) {
                                images.push(MagentoUtils.getProductImageUrlByName(media_gallery_entries[index].file))
                            }
                        }
                        const product = new Product({
                            ...item,
                            description: MagentoUtils.getCustomAttribute(item.custom_attributes, "description"),
                            category_ids: MagentoUtils.getCustomAttribute(item.custom_attributes, "category_ids"),
                            tax_class: MagentoUtils.getCustomAttribute(item.custom_attributes, "tax_class_id"),
                            sale_price: MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price"),
                            date_sale_from,
                            date_sale_to,
                            on_sale,
                            price,
                            regular_price: item.price,
                            images
                        })
                        items.push(product)
                    })
                    resolve(items)
                } else {
                    resolve([])
                }
            })
            .catch(reject)
    })
}

export const productsByCategoryId = (categoryId,
    per_page,
    page,
    filters) => {
    return new Promise((resolve, reject) => {
        var url = AppConfig.Magento.url + `/index.php/rest/V1/mstore/products?searchCriteria[pageSize]=${per_page}&searchCriteria[currentPage]=${page}`
        if (filters.category || categoryId) {
            url += `&searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${filters.category ? filters.category : categoryId}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`
        }
        if (filters.price) {
            url += `&searchCriteria[filter_groups][0][filters][1][field]=price&searchCriteria[filter_groups][0][filters][1][value]=${filters.price}&searchCriteria[filter_groups][0][filters][1][condition_type]=lteq`
        }
        axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
            }
        })
            .then(({ status, data }) => {
                if (status == 200 && data.items) {
                    var items = []
                    data.items.forEach((item) => {
                        const date_sale_from = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_from_date")
                        const date_sale_to = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_to_date")
                        var on_sale = false
                        var price = item.price
                        if (date_sale_from && date_sale_to) {
                            on_sale = moment().isBetween(moment(date_sale_from), moment(date_sale_to))
                            if (on_sale) {
                                price = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price")
                            }
                        }
                        const media_gallery_entries = item.media_gallery_entries
                        var images = [MagentoUtils.getProductImageUrl(item, "image")]
                        if (media_gallery_entries && media_gallery_entries.length > 1) {
                            for (let index = 1; index < media_gallery_entries.length; index++) {
                                images.push(MagentoUtils.getProductImageUrlByName(media_gallery_entries[index].file))
                            }
                        }
                        const product = new Product({
                            ...item,
                            description: MagentoUtils.getCustomAttribute(item.custom_attributes, "description"),
                            category_ids: MagentoUtils.getCustomAttribute(item.custom_attributes, "category_ids"),
                            tax_class: MagentoUtils.getCustomAttribute(item.custom_attributes, "tax_class_id"),
                            sale_price: MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price"),
                            date_sale_from,
                            date_sale_to,
                            on_sale,
                            price,
                            regular_price: item.price,
                            images
                            // slug,
                            // tags,
                            // attributes,
                            // enabled,
                            // ,
                            // related_product_ids,
                            // dimensions,
                            // stock_backorder,
                            // ,
                            // options,
                            // variants,
                            // url
                        })
                        items.push(product)
                    })
                    resolve(items)
                } else {
                    resolve([])
                }
            })
            .catch(reject)
    })
}

export const productsByCategoryTag = (categoryId,
    tagId,
    per_page,
    page) => {
    return new Promise((resolve, reject) => {
        var url = null
        if (categoryId) {
            url = AppConfig.Magento.url + `/index.php/rest/V1/mstore/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${categoryId}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[sortOrders][1][field]=created_at&searchCriteria[pageSize]=${per_page}&searchCriteria[currentPage]=${page}`
        } else {
            url = AppConfig.Magento.url + `/index.php/rest/V1/mstore/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${tagId}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[sortOrders][1][field]=created_at&searchCriteria[pageSize]=${per_page}&searchCriteria[currentPage]=${page}`
        }
        axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
            }
        })
            .then(({ status, data }) => {
                if (status == 200 && data.items) {
                    var items = []
                    data.items.forEach((item) => {
                        const date_sale_from = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_from_date")
                        const date_sale_to = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_to_date")
                        var on_sale = false
                        var price = item.price
                        if (date_sale_from && date_sale_to) {
                            on_sale = moment().isBetween(moment(date_sale_from), moment(date_sale_to))
                            if (on_sale) {
                                price = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price")
                            }
                        }

                        const media_gallery_entries = item.media_gallery_entries
                        var images = [MagentoUtils.getProductImageUrl(item, "thumbnail")]
                        if (media_gallery_entries && media_gallery_entries.length > 1) {
                            for (let index = 1; index < media_gallery_entries.length; index++) {
                                images.push(MagentoUtils.getProductImageUrlByName(media_gallery_entries[index].file))
                            }
                        }
                        const product = new Product({
                            ...item,
                            description: MagentoUtils.getCustomAttribute(item.custom_attributes, "description"),
                            category_ids: MagentoUtils.getCustomAttribute(item.custom_attributes, "category_ids"),
                            tax_class: MagentoUtils.getCustomAttribute(item.custom_attributes, "tax_class_id"),
                            sale_price: MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price"),
                            date_sale_from,
                            date_sale_to,
                            on_sale,
                            price,
                            regular_price: item.price,
                            images
                        })
                        items.push(product)
                    })
                    resolve(items)
                } else {
                    resolve([])
                }
            })
            .catch(reject)
    })
}

export const productsByName = (name,
    per_page,
    page,
    filters) => {
    return new Promise((resolve, reject) => {
        var url = AppConfig.Magento.url + `/index.php/rest/V1/mstore/products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%${name}%&searchCriteria[filter_groups][0][filters][0][condition_type]=like&searchCriteria[sortOrders][1][field]=created_at&searchCriteria[pageSize]=${per_page}&searchCriteria[currentPage]=${page}`
        var index = 0
        if (filters.category) {
            index += 1
            url += `&searchCriteria[filter_groups][0][filters][${index}][field]=category_id&searchCriteria[filter_groups][0][filters][${index}][value]=${filters.category}&searchCriteria[filter_groups][0][filters][${index}][condition_type]=eq`
        }
        if (filters.max_price) {
            index += 1
            url += `&searchCriteria[filter_groups][0][filters][${index}][field]=price&searchCriteria[filter_groups][0][filters][${index}][value]=${filters.max_price}&searchCriteria[filter_groups][0][filters][${index}][condition_type]=lteq`
        }
        axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
            }
        })
            .then(({ status, data }) => {
                if (status == 200 && data.items) {
                    var items = []
                    data.items.forEach((item) => {
                        const date_sale_from = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_from_date")
                        const date_sale_to = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_to_date")
                        var on_sale = false
                        var price = item.price
                        if (date_sale_from && date_sale_to) {
                            on_sale = moment().isBetween(moment(date_sale_from), moment(date_sale_to))
                            if (on_sale) {
                                price = MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price")
                            }
                        }
                        const media_gallery_entries = item.media_gallery_entries
                        var images = [MagentoUtils.getProductImageUrl(item, "thumbnail")]
                        if (media_gallery_entries && media_gallery_entries.length > 1) {
                            for (let index = 1; index < media_gallery_entries.length; index++) {
                                images.push(MagentoUtils.getProductImageUrlByName(media_gallery_entries[index].file))
                            }
                        }
                        const product = new Product({
                            ...item,
                            description: MagentoUtils.getCustomAttribute(item.custom_attributes, "description"),
                            category_ids: MagentoUtils.getCustomAttribute(item.custom_attributes, "category_ids"),
                            tax_class: MagentoUtils.getCustomAttribute(item.custom_attributes, "tax_class_id"),
                            sale_price: MagentoUtils.getCustomAttribute(item.custom_attributes, "special_price"),
                            date_sale_from,
                            date_sale_to,
                            on_sale,
                            price,
                            regular_price: item.price,
                            images
                        })
                        items.push(product)
                    })
                    resolve(items)
                } else {
                    resolve([])
                }
            })
            .catch(reject)
    })
}

export const register = ({ username, email, firstName, lastName, password }) => {
    return new Promise((resolve, reject) => {
        axios.post(AppConfig.Magento.url + "/index.php/rest/V1/customers", {
            "customer": {
                email,
                "firstname": firstName,
                "lastname": lastName
            },
            password
        })
            .then(({ status, data }) => {
                var user = new User(data)
                resolve(user)
            })
            .catch((err) => {
                if (err.response && err.response.data.message) {
                    var message = err.response.data.message
                    const params = err.response.data.parameters
                    if (params && params.length > 0) {
                        params.forEach((item, index) => {
                            message = message.replace(`%${index + 1}`, item)
                        })
                    }
                    reject(message);
                } else {
                    reject("Server don't response correctly")
                }
            })
    })
}

export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        axios.post(AppConfig.Magento.url + "/index.php/rest/V1/integration/customer/token", {
            username, password
        })
            .then((res) => {
                const token = res.data
                getUserInfo(token)
                    .then(resolve)
                    .catch(reject)
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}

export const socialLogin = (token, type) => {
    return new Promise((resolve, reject) => {
        axios.post(AppConfig.Magento.url + "/index.php/rest/V1/mstore/social_login", {
            token, type
        })
            .then((res) => {
                const token = res.data
                getUserInfo(token)
                    .then(resolve)
                    .catch(reject)
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}

export const createAQuote = (token) => {
    return new Promise((resolve, reject) => {
        axios.post(AppConfig.Magento.url + (token ? "/index.php/rest/V1/carts/mine" : "/index.php/rest/V1/guest-carts"), {}, {
            headers: token ? {
                'Authorization': 'Bearer ' + token
            } : {}
        })
            .then(({ status, data }) => {
                resolve(data)
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}

export const getCartInfo = (token) => {
    return new Promise((resolve, reject) => {
        axios.get(AppConfig.Magento.url + "/index.php/rest/V1/carts/mine", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(({ status, data }) => {
                resolve(data)
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject({ message, status: err.response.status })
            })
    })
}

export const removeItemInCart = (item_id, token) => {
    return new Promise((resolve, reject) => {
        axios.delete(AppConfig.Magento.url + "/index.php/rest/V1/carts/mine/items/" + item_id, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(({ status, data }) => {
                resolve(data)
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}

export const addItemToCart = (sku, qty, quote_id, token) => {
    return new Promise((resolve, reject) => {
        const url = token ? AppConfig.Magento.url + "/index.php/rest/V1/carts/mine/items" : AppConfig.Magento.url + "/index.php/rest/V1/guest-carts/" + quote_id + "/items"
        axios.post(url, { cartItem: { sku, qty, quote_id } }, {
            headers: token ? {
                'Authorization': 'Bearer ' + token
            } : {}
        })
            .then(({ status, data }) => {
                resolve(data)
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}

export const getShippingMethod = (address, quote_id, token) => {
    return new Promise((resolve, reject) => {
        const url = token ? AppConfig.Magento.url + "/index.php/rest/V1/carts/mine/estimate-shipping-methods" : AppConfig.Magento.url + "/index.php/rest/V1/guest-carts/" + quote_id + "/estimate-shipping-methods"
        axios.post(url, { address }, {
            headers: token ? {
                'Authorization': 'Bearer ' + token
            } : {}
        })
            .then(({ status, data }) => {
                var items = []
                data.forEach((item) => {
                    var shippingMethod = new ShippingMethod(item)
                    items.push(shippingMethod)
                })
                resolve(items)
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}

export const setShippingBillingInfo = (address, shipping_carrier_code, shipping_method_code, quote_id, token) => {
    const addr = new Address(address)
    var params =
    {
        "addressInformation": {
            "shipping_address": addr,
            "billing_address": addr,
        }
    }
    if (shipping_carrier_code && shipping_method_code) {
        params.addressInformation.shipping_carrier_code = shipping_carrier_code
        params.addressInformation.shipping_method_code = shipping_method_code
    }
    const url = token ? AppConfig.Magento.url + "/index.php/rest/V1/carts/mine/shipping-information" : AppConfig.Magento.url + "/index.php/rest/V1/guest-carts/" + quote_id + "/shipping-information"
    return axios.post(url, params, {
        headers: token ? {
            'Authorization': 'Bearer ' + token
        } : {}
    })
}

export const getPayments = (address, shipping_carrier_code, shipping_method_code, quote_id, token) => {
    return new Promise((resolve, reject) => {
        setShippingBillingInfo(address, shipping_carrier_code, shipping_method_code, quote_id, token)
            .then((res) => {
                const url = token ? AppConfig.Magento.url + "/index.php/rest/V1/carts/mine/payment-methods" : AppConfig.Magento.url + "/index.php/rest/V1/guest-carts/" + quote_id + "/payment-methods"
                axios.get(url, {
                    headers: token ? {
                        'Authorization': 'Bearer ' + token
                    } : {}
                })
                    .then(({ status, data }) => {
                        var items = []
                        data.forEach((item) => {
                            var paymentMethod = new PaymentMethod(item)
                            items.push(paymentMethod)
                        })
                        resolve(items)
                    })
                    .catch((err) => {
                        const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                        reject(message)
                    })
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })

    })
}

export const createNewOrder = (payload, quote_id, onFinish, onError) => {
    //set shipping and billing information
    const token = payload.token
    const address = new Address(payload.billing)
    const shipping_lines = payload.shipping_lines[0]
    const params =
    {
        "addressInformation": {
            "shipping_address": address,
            "billing_address": address,
            "shipping_carrier_code": shipping_lines.method_id.split(":")[1],
            "shipping_method_code": shipping_lines.method_id.split(":")[0]
        }
    }

    // const url = token ? AppConfig.Magento.url + "/index.php/rest/V1/carts/mine/shipping-information" : AppConfig.Magento.url + "/index.php/rest/V1/guest-carts/" + quote_id + "/shipping-information"
    // axios.post(url, params, {
    //     headers: token ? {
    //         'Authorization': 'Bearer ' + token
    //     } : {}
    // })
    //     .then(({ status, data }) => {
    //set payment information
    const paymentParams = token ? {
        "paymentMethod": {
            "method": payload.payment_method
        },
        "billing_address": address
    } : {
            "paymentMethod": {
                "method": payload.payment_method
            },
            "email": address.email,
            "firstname": address.firstname,
            "lastname": address.lastname
        }
    const checkoutUrl = token ? AppConfig.Magento.url + "/index.php/rest/V1/carts/mine/payment-information" : AppConfig.Magento.url + "/index.php/rest/V1/guest-carts/" + quote_id + "/payment-information"
    axios.post(checkoutUrl, paymentParams, {
        headers: token ? {
            'Authorization': 'Bearer ' + token
        } : {}
    })
        .then(({ status, data }) => {
            onFinish(data)
        })
        .catch((err) => {
            const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
            onError(message)
        })
    // })
    // .catch((err) => {
    //     const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
    //     onError(message)
    // })
}

export const ordersByCustomerId = (customer_id, per_page, page) => {
    return new Promise((resolve, reject) => {
        axios.get(AppConfig.Magento.url + `/index.php/rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][value]=${customer_id}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[sortOrders][1][field]=created_at&searchCriteria[pageSize]=${per_page}&searchCriteria[currentPage]=${page}`, {
            headers: {
                'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
            }
        })
            .then(({ status, data }) => {
                if (status == 200 && data.items) {
                    var items = []
                    data.items.forEach((item) => {
                        items.push(new MyOrder(item))
                    })
                    resolve(items)
                } else {
                    resolve([])
                }
            })
            .catch(reject)
    })
}

export const updateOrder = (order, orderId) => {
    if (order.status == "cancelled") {
        return new Promise((resolve, reject) => {
            axios.post(AppConfig.Magento.url + "/index.php/rest/V1/orders/" + orderId + "/cancel", {}, {
                headers: {
                    'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
                }
            })
                .then(({ status, data }) => {
                    resolve(data)
                })
                .catch((err) => {
                    const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                    reject(message)
                })
        })
    }

}

export const getProductDetail = (sku) => {
    return new Promise((resolve, reject) => {
        axios.get(AppConfig.Magento.url + "/index.php/rest/V1/products/" + sku, {
            headers: {
                'Authorization': 'Bearer ' + AppConfig.Magento.accessToken
            }
        })
            .then(({ status, data }) => {
                var images = []
                data.media_gallery_entries.forEach((item) => {
                    if (item.media_type == "image") {
                        images.push({ src: MagentoUtils.getProductImageUrlByName(item.file) })
                    }
                })

                resolve({ images, stock_item: data.extension_attributes.stock_item })
            })
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}

export const sendContactUs = (name, email, phone, comment) => {
    return new Promise((resolve, reject) => {
        axios.post(AppConfig.Magento.url + "/index.php/rest/V1/mstore/contact_us", {
            name, email, phone, comment
        })
            .then(resolve)
            .catch((err) => {
                const message = err.response && err.response.data.message ? err.response.data.message : "Server don't response correctly"
                reject(message)
            })
    })
}