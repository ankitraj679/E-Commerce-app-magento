/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, Dimensions, ScrollView, View } from "react-native";
import css from "@cart/styles";
import { connect } from "react-redux";
import { warn, toast } from "@app/Omni";
import { Button, ConfirmCheckout, TapPayment } from "@components";
import { Languages, Config, Images, withTheme } from "@common";
import Buttons from "@cart/Buttons";
import HTML from "react-native-render-html";
import styles from "./styles";
import * as MagentoWorker from '@services/MagentoWorker'
const { width } = Dimensions.get("window");
import { isArray } from "lodash";
import _ from 'lodash'
class PaymentOptions extends PureComponent {
  static propTypes = {
    fetchPayments: PropTypes.func,
    message: PropTypes.array,
    type: PropTypes.string,
    cleanOldCoupon: PropTypes.func,
    onNext: PropTypes.func,
    user: PropTypes.object,
    userInfo: PropTypes.object,
    currency: PropTypes.any,
    payments: PropTypes.object,
    isLoading: PropTypes.bool,
    cartItems: PropTypes.any,
    onShowCheckOut: PropTypes.func,
    emptyCart: PropTypes.func,
    couponCode: PropTypes.any,
    couponId: PropTypes.any,
    couponAmount: PropTypes.any,
    shippingMethod: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // token: null,
      selectedIndex: 0,
      // accountNumber: '',
      // holderName: '',
      // expirationDate: '',
      // securityCode: '',
      // paymentState: '',
      // createdOrder: {},
    };
  }

  getPayments() {
    const { shippingMethod, quote_id } = this.props;

    const shipping_carrier_code = shippingMethod ? shippingMethod.carrier_code : ""
    const shipping_method_code = shippingMethod ? shippingMethod.method_code : ""
    this.isGetPayment = true
    this.props.fetchPayments(this.getBillingAddress(), shipping_carrier_code, shipping_method_code, quote_id, this.props.user.token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message && nextProps.message.length > 0) {
      // Alert.alert(Languages.Error, nextProps.carts.message)
      toast(nextProps.message);
    }

    if (nextProps.paymentMsg && nextProps.paymentMsg.length > 0 && this.isGetPayment) {
      this.isGetPayment = false
      toast(nextProps.paymentMsg);
    }

    if (
      nextProps.type !== this.props.type &&
      nextProps.type == "CREATE_NEW_ORDER_SUCCESS"
    ) {
      warn(nextProps);
      this.props.cleanOldCoupon();
      this.props.onNext();
    }
  }

  getBillingAddress = () => {
    const { user } = this.props.user;
    const { userInfo } = this.props;
    return {
      ...(user ? user.billing : null),
      email: userInfo.email,
      phone: userInfo.phone,
      first_name:
        user && user.billing.first_name.length === 0
          ? userInfo.first_name
          : user
            ? user.billing.first_name
            : userInfo.first_name,
      last_name:
        user && user.billing.last_name.length === 0
          ? userInfo.last_name
          : user
            ? user.billing.last_name
            : userInfo.last_name,
      address_1:
        user && user.billing.address_1.length === 0
          ? userInfo.address_1
          : user
            ? user.billing.address_1
            : userInfo.address_1,
      city:
        user && user.billing.city.length === 0
          ? userInfo.city
          : user
            ? user.billing.city
            : userInfo.city,
      state:
        user && user.billing.state.length === 0
          ? userInfo.state
          : user
            ? user.billing.state
            : userInfo.state,
      country:
        user && user.billing.country.length === 0
          ? userInfo.country
          : user
            ? user.billing.country
            : userInfo.country,
      postcode:
        user && user.billing.postcode.length === 0
          ? userInfo.postcode
          : user
            ? user.billing.postcode
            : userInfo.postcode,
    }
  }

  nextStep = () => {
    const { user, token } = this.props.user;
    const { userInfo, currency } = this.props;
    const coupon = this.getCouponInfo();
    // Billing First name is a required field.
    // Billing Last name is a required field.
    // Billing Country is a required field.
    // Billing Street address is a required field.
    // Billing Town / City is a required field.

    const list = _.filter(this.props.payments.list, (item) => Config.Payments[item.id] != undefined);
    if (list.length == 0) {
      return
    }
    const payload = {
      token,
      customer_id: user ? user.id : 0, // using for anonymous
      set_paid: list[this.state.selectedIndex].id == "cashondelivery",
      payment_method: list[this.state.selectedIndex].id,
      payment_method_title: list[this.state.selectedIndex].title,
      billing: this.getBillingAddress(),
      shipping: {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        address_1: userInfo.address_1,
        city: userInfo.city,
        state: userInfo.state,
        country: userInfo.country,
        postcode: userInfo.postcode,
      },
      line_items: this.getItemsCart(),
      customer_note: typeof userInfo.note !== "undefined" ? userInfo.note : "",
      currency: currency.code,
    };

    // check the shipping info
    if (Config.shipping.visible) {
      payload.shipping_lines = this.getShippingMethod();
    }

    // check the coupon
    if (coupon.length != 0) {
      payload.coupon_lines = this.getCouponInfo();
    }

    this.setState({ loading: this.props.isLoading });

    // warn([userInfo, payload]);

    if (list[this.state.selectedIndex].id != "tap") {
      this.setState({ loading: true });
      MagentoWorker.createNewOrder(
        payload,
        this.props.quote_id,
        () => {
          this.setState({ loading: false });
          this.props.emptyCart();
          this.props.onNext();
        },
        (message) => {
          alert(message)
          this.setState({ loading: false });
        }
      );
    } else {
      this.payload = payload
      this.refs.tapPayment.show({ ...payload.billing, amount: this.getTotalPrice() })
    }
    // other kind of payment
    //this.props.onShowCheckOut(payload);
  };

  getTotalPrice = () => {
    const shippingMethod = this.getShippingMethod()
    const shippingPrice = isArray(shippingMethod)
      ? shippingMethod[0].total
      : shippingMethod;

    const total =
      parseFloat(this.props.totalPrice) +
      parseFloat(shippingPrice);
    return total
  }

  onPaymentSuccess = (transaction) => {
    this.setState({ loading: true });
    this.payload.set_paid = true
    warn(this.payload);

    MagentoWorker.createNewOrder(
      this.payload,
      this.props.quote_id,
      () => {
        this.setState({ loading: false });
        this.props.emptyCart();
        this.props.onNext();
      },
      (message) => {
        alert(message)
        this.setState({ loading: false });
      }
    );
  }

  getItemsCart = () => {
    const { cartItems } = this.props;
    const items = [];
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];

      const item = {
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      };

      if (cartItem.variation != null) {
        item.variation_id = cartItem.variation.id;
      }
      items.push(item);
    }
    return items;
  };

  getCouponInfo = () => {
    const { couponCode, couponAmount } = this.props;
    if (
      typeof couponCode !== "undefined" &&
      typeof couponAmount !== "undefined" &&
      couponAmount > 0
    ) {
      return [
        {
          code: couponCode,
        },
      ];
    }
    return {};
  };

  getShippingMethod = () => {
    const { shippingMethod } = this.props;

    if (typeof shippingMethod !== "undefined" && shippingMethod != null) {
      return [
        {
          method_id: `${shippingMethod.method_id}:${shippingMethod.id}`,
          method_title: shippingMethod.title,
          total: shippingMethod.settings.cost.value,
        },
      ];
    }
    // return the free class as default
    return [
      {
        method_id: "freeshipping",
        total: "0",
      },
    ];
  };

  renderDesLayout = (item) => {
    if (typeof item === "undefined") {
      return <View />;
    }
    if (item.description == null || item.description == "") return <View />;

    const tagsStyles = {
      p: {
        color: "#666",
        flex: 1,
        textAlign: "center",
        width: width - 40,
        paddingLeft: 20,
      },
    };
    return (
      <View style={styles.descriptionView}>
        <HTML tagsStyles={tagsStyles} html={`<p>${item.description}</p>`} />
      </View>
    );
  };

  render() {
    const list = _.filter(this.props.payments.list, (item) => Config.Payments[item.id] != undefined);

    const {
      theme: {
        colors: { text },
      },
    } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={css.rowEmpty}>
            <Text style={[styles.label, { color: text }]}>
              {Languages.SelectPayment}:
            </Text>
          </View>

          <View style={styles.paymentOption}>
            {list.map((item, index) => {
              if (!item.enabled) return null;

              const image =
                typeof Config.Payments[item.id] !== "undefined" &&
                Config.Payments[item.id];

              return (
                <View style={styles.optionContainer} key={index.toString()}>
                  <Button
                    type="image"
                    source={image}
                    defaultSource={Images.defaultPayment}
                    onPress={() => this.setState({ selectedIndex: index })}
                    buttonStyle={[
                      styles.btnOption,
                      this.state.selectedIndex == index &&
                      styles.selectedBtnOption,
                    ]}
                    imageStyle={styles.imgOption}
                  />
                </View>
              );
            })}
          </View>
          {this.renderDesLayout(list[this.state.selectedIndex])}

          <ConfirmCheckout
            couponAmount={this.props.couponAmount}
            discountType={this.props.discountType}
            shippingMethod={this.getShippingMethod()}
            totalPrice={this.props.totalPrice}
          />
        </ScrollView>

        <Buttons
          isAbsolute
          onPrevious={this.props.onPrevious}
          isLoading={this.state.loading}
          nextText={Languages.ConfirmOrder}
          onNext={this.nextStep}
        />
        <TapPayment ref="tapPayment" onPaymentSuccess={this.onPaymentSuccess} />
      </View>
    );
  }
}

const mapStateToProps = ({ payments, carts, user, products, currency }) => {
  return {
    payments,
    paymentMsg: payments.type == "PAYMENT_FETCH_FAILURE" ? payments.message : null,
    user,
    type: carts.type,
    quote_id: carts.quote_id,
    cartItems: carts.cartItems,
    totalPrice: carts.totalPrice,
    message: carts.message,
    customerInfo: carts.customerInfo,

    couponCode: products.coupon && products.coupon.code,
    couponAmount: products.coupon && products.coupon.amount,
    discountType: products.coupon && products.coupon.type,
    couponId: products.coupon && products.coupon.id,

    shippingMethod: carts.shippingMethod,

    currency,
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CartRedux = require("@redux/CartRedux");
  const productActions = require("@redux/ProductRedux").actions;
  const paymentActions = require("@redux/PaymentRedux").actions;
  return {
    ...ownProps,
    ...stateProps,
    emptyCart: () => CartRedux.actions.emptyCart(dispatch),
    createNewOrder: (payload) => {
      CartRedux.actions.createNewOrder(dispatch, payload);
    },
    cleanOldCoupon: () => {
      productActions.cleanOldCoupon(dispatch);
    },
    fetchPayments: (address, shipping_carrier_code, shipping_method_code, quote_id, token) => {
      paymentActions.fetchPayments(dispatch, address, shipping_carrier_code, shipping_method_code, quote_id, token);
    },
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps,
  { forwardRef: true }
)(withTheme(PaymentOptions));
