/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';
import ScrollableTabView from "react-native-scrollable-tab-view";
import { connect } from "react-redux";
import base64 from "base-64";
import Modal from "react-native-modalbox";
import { isObject } from "lodash";

import { BlockTimer, warn } from "@app/Omni";
import { StepIndicator } from "@components";
import {
  Languages,
  Images,
  AppConfig,
  Constants,
  Config,
  withTheme,
  Events
} from "@common";

import MyCart from "./MyCart";
import Delivery from "./Delivery";
import Payment from "./Payment";
import FinishOrder from "./FinishOrder";
import PaymentEmpty from "./Empty";
import Buttons from "./Buttons";
import styles from "./styles";

class Cart extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    onMustLogin: PropTypes.func.isRequired,
    finishOrder: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    onFinishOrder: PropTypes.func.isRequired,
    onViewProduct: PropTypes.func,
    cartItems: PropTypes.array,
    onViewHome: PropTypes.func,
  };

  static defaultProps = {
    cartItems: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      // createdOrder: {},
      userInfo: null,
      order: "",
      isLoading: false,
      orderId: null,
      isLoading: false
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({ title: Languages.ShoppingCart });
    Events.onLogout(() => {
      this.isRequesting = false
      this.setState({ isLoading: false })
      this.props.onMustLogout();
    })
  }

  componentWillUnmount() {
    Events.onRemoveLogout()
  }

  componentWillReceiveProps(nextProps) {
    // reset current index when update cart item
    if (this.props.cartItems && nextProps.cartItems) {
      if (nextProps.cartItems.length !== 0) {
        if (this.props.cartItems.length !== nextProps.cartItems.length) {
          this.updatePageIndex(0);
          this.onChangeTabIndex(0);
        }
      }
    }

    if (nextProps.type == "CREATE_A_QUOTE_SUCCESS" && this.isRequesting) {
      this.isRequesting = false
      this.setState({ isLoading: false }, () => {
        setTimeout(()=>{
          this.tabCartView.goToPage(this.state.currentIndex + 1);
        },500)
      })
      if (this.props.selectedAddress && this.props.selectedAddress.country) {
        this.props.getShippingMethod({ country_id: this.props.selectedAddress.country }, this.props.quote_id, this.props.token)
      }
    }

    if (nextProps.type == "CREATE_A_QUOTE_FAIL" && this.isRequesting) {
      this.isRequesting = false
      this.setState({ isLoading: false })
      alert(nextProps.error)
    }
  }

  checkUserLogin = () => {
    const { user } = this.props.user;

    // check anonymous checkout
    if (!Config.Login.AnonymousCheckout) {
      if (user === null) {
        this.props.onMustLogin();
        return false;
      }
    }

    return true;
  };

  onNext = () => {
    // check validate before moving next
    let valid = true;
    switch (this.state.currentIndex) {
      case 0:
        valid = this.checkUserLogin();
        this.isRequesting = true
        this.setState({ isLoading: true })
        if (valid) {
          if (this.props.token) {
            this.props.createAQuote(this.props.cartItems, this.props.token)
          } else {
            this.props.createAQuoteGuest(this.props.cartItems)
          }
        }
        break;
      default:
        break;
    }
    if (valid && typeof this.tabCartView !== "undefined" && !this.isRequesting) {
      if (this.state.currentIndex == 1 && (this.props.shippings.length == 0 || !this.props.shippingMethod)) {
        alert(Languages.NoShippingMsg)
      } else {
        const nextPage = this.state.currentIndex + 1;
        this.tabCartView.goToPage(nextPage);
      }
    }
  };

  renderCheckOut = () => {
    const params = base64.encode(
      encodeURIComponent(JSON.stringify(this.state.order))
    );
    const userAgentAndroid =
      "Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30";

    const checkOutUrl = `${AppConfig.Magento.url}/${
      Constants.WordPress.checkout
      }/?order=${params}`;

    return (
      <Modal
        ref={(modal) => (this.checkoutModal = modal)}
        backdropPressToClose={false}
        backButtonClose
        backdropColor="#fff"
        swipeToClose={false}
        onClosed={this._onClosedModal}>
        <WebView
          startInLoadingState
          style={styles.webView}
          source={{ uri: checkOutUrl }}
          userAgent={userAgentAndroid}
          onNavigationStateChange={(status) =>
            this._onNavigationStateChange(status)
          }
          scalesPageToFit
        />
        <TouchableOpacity
          style={styles.iconZoom}
          onPress={() => this.checkoutModal.close()}>
          <Text style={styles.textClose}>{Languages.close}</Text>
        </TouchableOpacity>
      </Modal>
    );
  };

  _onClosedModal = () => {
    if (this.state.orderId !== null) {
      this.props.finishOrder();
      this.checkoutModal.close();
    }
    this.setState({ isLoading: false });
  };

  _onNavigationStateChange = (status) => {
    const { url } = status;
    if (
      url.indexOf(AppConfig.Magento.url) == 0 &&
      url.indexOf("order-received") != -1
    ) {
      let params = status.url.split("?");
      if (params.length > 1) {
        params = params[1].split("&");
        params.forEach((val) => {
          const now = val.split("=");
          if (now[0] == "key" && now["1"].indexOf("wc_order") == 0) {
            this.setState({ orderId: now["1"].indexOf("wc_order") });
          }
        });
      }
    }
  };

  onShowCheckOut = async (order) => {
    await this.setState({ order });
    this.checkoutModal.open();
  };

  onPrevious = () => {
    if (this.state.currentIndex === 0) {
      this.props.onBack();
      return;
    }
    this.tabCartView.goToPage(this.state.currentIndex - 1);
  };

  updatePageIndex = (page) => {
    const currentIndex = isObject(page) ? page.i : page
    this.setState({ currentIndex }, () => {
      if (currentIndex == 2) {
        this.refs.payment.getPayments()
      }
    });
  };

  onChangeTabIndex = (page) => {
    if (this.tabCartView) {
      this.tabCartView.goToPage(page);
    }
  };

  finishOrder = () => {
    const { onFinishOrder } = this.props;
    onFinishOrder();
    BlockTimer.execute(() => {
      this.tabCartView.goToPage(0);
    }, 1500);
  };

  render() {
    const { onViewProduct, navigation, cartItems, onViewHome } = this.props;
    const { currentIndex } = this.state;
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    if (currentIndex === 0 && cartItems && cartItems.length === 0) {
      return <PaymentEmpty onViewHome={onViewHome} />;
    }
    const steps = [
      { label: Languages.MyCart, icon: Images.IconCart },
      { label: Languages.Delivery, icon: Images.IconPin },
      { label: Languages.Payment, icon: Images.IconMoney },
      { label: Languages.Order, icon: Images.IconFlag },
    ];
    return (
      <View style={[styles.fill, { backgroundColor: background }]}>
        {this.renderCheckOut()}
        <View style={styles.indicator}>
          <StepIndicator
            steps={steps}
            onChangeTab={this.onChangeTabIndex}
            currentIndex={currentIndex}
          />
        </View>
        <View style={styles.content}>
          {this.state.isLoading && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          )}
          {!this.state.isLoading && (
            <ScrollableTabView
              ref={(tabView) => {
                this.tabCartView = tabView;
              }}
              locked
              onChangeTab={this.updatePageIndex}
              style={{ backgroundColor: background }}
              initialPage={0}
              tabBarPosition="overlayTop"
              prerenderingSiblingsNumber={1}
              renderTabBar={() => <View style={{ padding: 0, margin: 0 }} />}>
              <MyCart
                key="cart"
                onNext={this.onNext}
                onPrevious={this.onPrevious}
                navigation={navigation}
                onViewProduct={onViewProduct}
              />

              <Delivery
                key="delivery"
                onNext={(formValues) => {
                  this.setState({ userInfo: formValues });
                  this.onNext();
                }}
                onPrevious={this.onPrevious}
              />
              <Payment
                ref="payment"
                key="payment"
                onPrevious={this.onPrevious}
                onNext={this.onNext}
                userInfo={this.state.userInfo}
                isLoading={this.state.isLoading}
                onShowCheckOut={this.onShowCheckOut}
              />

              <FinishOrder key="finishOrder" finishOrder={this.finishOrder} />
            </ScrollableTabView>
          )}

          {currentIndex === 0 && (
            <Buttons onPrevious={this.onPrevious} onNext={this.onNext} />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ carts, user, addresses }) => ({
  cartItems: carts.cartItems,
  type: carts.type,
  quote_id: carts.quote_id,
  user,
  token: user.token,
  selectedAddress: addresses.selectedAddress,
  error: carts.error,
  shippings: carts.shippings,
  shippingMethod: carts.shippingMethod,
});
function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CartRedux = require("@redux/CartRedux");
  return {
    ...ownProps,
    ...stateProps,
    emptyCart: () => CartRedux.actions.emptyCart(dispatch),
    finishOrder: () => CartRedux.actions.finishOrder(dispatch),
    createAQuote: (carts, token) => CartRedux.actions.createAQuote(dispatch, carts, token),
    createAQuoteGuest: (carts) => CartRedux.actions.createAQuoteGuest(dispatch, carts),
    getShippingMethod: (address, quote_id, token) => {
      CartRedux.actions.getShippingMethod(dispatch, address, quote_id, token);
    }
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(Cart));
