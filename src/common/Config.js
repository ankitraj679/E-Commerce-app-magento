/** @format */

import Images from "./Images";
import Constants from "./Constants";
import Icons from "./Icons";

export default {
  /**
   * Step 1: change to your website URL and the wooCommerce API consumeKey
   * Moved to AppConfig.json
   */

  /**
     Step 2: Setting Product Images
     - ProductSize: Explode the guide from: update the product display size: https://mstore.gitbooks.io/mstore-manual/content/chapter5.html
     The default config for ProductSize is disable due to some problem config for most of users.
     If you have success config it from the Wordpress site, please enable to speed up the app performance
     - HorizonLayout: Change the HomePage horizontal layout - https://mstore.gitbooks.io/mstore-manual/content/chapter6.html
       Update Oct 06 2018: add new type of categories
       NOTE: name is define value --> change field in Language.js
       Moved to AppConfig.json
     */
  ProductSize: {
    enable: true,
  },
  PhoneCategories: [
    {
      category: 11,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/iphoneXSmax_gold.jpg" },
      colors: ["#43e97b", "#38f9d7"],
      name: "iPhone XS Max"
    },
    {
      category: 20,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/iPhoneXR_Blue.jpg" },
      colors: ["#7F00FF", "#E100FF"],
      name: "iPhone Xr"
    },
    {
      category: 7,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/iphone10.jpg" },
      colors: ["#fa709a", "#fee140"],
      name: "iPhone X"
    },
    {
      category: 3,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/galaxy_note9.png" },
      colors: ["#00f2fe", "#E100FF"],
      name: "Galaxy Note 9"
    },
    {
      category: 29,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/icn-iphone-8-plus.png" },
      colors: ["#fee140", "#E100FF"],
      name: "iPhone 7 & 8 Plus"
    },
    {
      category: 11,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/iphone.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: "iPhone 7 & 8"
    },
    {
      category: 20,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/galaxy_note.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: "Galaxy Note 8+"
    },
    {
      category: 7,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/s8_p.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: "Galaxy S8+"
    },
    {
      category: 3,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/s8.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: "Galaxy S8"
    },
    {
      category: 29,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/ipad-12.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'iPad Pro 12"'
    },
    {
      category: 11,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/ipad_10.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'iPad Pro 10"'
    },
    {
      category: 20,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/ipad_mini4.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'iPad Mini 4"'
    },
    {
      category: 7,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/apple-watch-38_1.jpg" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'Apple Watch 38'
    },
    {
      category: 3,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/apple-watch-42_1.jpg" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'Apple Watch 42'
    },
    {
      category: 29,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/macbook-12_inch_1.jpg" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'Macbook 12"'
    },
    {
      category: 11,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/mac-13-pro_1.jpg" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'Macbook Pro 13"'
    },
    {
      category: 20,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/mac-15-pro_1.jpg" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'Macbook Pro 15"'
    },
    {
      category: 7,
      image: { uri: "https://smhttp-ssl-56626.nexcesscdn.net/media/googlepxl.png" },
      colors: ["#4facfe", "#00f2fe"],
      name: 'GooglePixel'
    },
  ],
  HomeCategories: [
    {
      category: 32,
      image: require("@images/categories_icon/ic_tshirt.png"),
      colors: ["#43e97b", "#38f9d7"],
    },
    {
      category: 20,
      image: require("@images/categories_icon/ic_dress.png"),
      colors: ["#7F00FF", "#E100FF"],
    },
    {
      category: 23,
      image: require("@images/categories_icon/ic_shorts.png"),
      colors: ["#fa709a", "#fee140"],
    },
    {
      category: 25,
      image: require("@images/categories_icon/ic_glasses.png"),
      colors: ["#00f2fe", "#E100FF"],
    },
    {
      category: 15,
      image: require("@images/categories_icon/ic_tie.png"),
      colors: ["#fee140", "#E100FF"],
    },
    {
      category: 4,
      image: require("@images/categories_icon/ic_socks.png"),
      colors: ["#4facfe", "#00f2fe"],
    },
  ],

  /**
     step 3: Config image for the Payment Gateway
     Notes:
     - Only the image list here will be shown on the app but it should match with the key id from the WooCommerce Website config
     - It's flexible way to control list of your payment as well
     Ex. if you would like to show only cod then just put one cod image in the list
     * */
  Payments: {
    cashondelivery: require("@images/payment_logo/cash_on_delivery.png"),
    free: require("@images/payment_logo/cash_on_delivery.png"),
    paypal: require("@images/payment_logo/PayPal.png"),
    stripe: require("@images/payment_logo/stripe.png"),
    tap: require("@images/payment_logo/tap_payment.png"),
  },

  /**
     Step 4: Advance config:
     - showShipping: option to show the list of shipping method
     - showStatusBar: option to show the status bar, it always show iPhoneX
     - LogoImage: The header logo
     - LogoWithText: The Logo use for sign up form
     - LogoLoading: The loading icon logo
     - appFacebookId: The app facebook ID, use for Facebook login
     - CustomPages: Update the custom page which can be shown from the left side bar (Components/Drawer/index.js)
     - WebPages: This could be the id of your blog post or the full URL which point to any Webpage (responsive mobile is required on the web page)
     - CategoryListView: default layout for category (true/false)
     - intro: The on boarding intro slider for your app
     - menu: config for left menu side items (isMultiChild: This is new feature from 3.4.5 that show the sub products categories)
     * */
  shipping: {
    visible: true,
    zoneId: 1, // depend on your woocommerce
    time: {
      freeshipping: "4 - 7",//days
      flatrate: "1 - 4",
      localpickup: "1 - 4",
    },
  },
  showStatusBar: true,
  LogoImage: require("@images/logo-main.png"),
  LogoWithText: require("@images/logo_with_text.png"),
  LogoLoading: require("@images/logo.png"),

  showAdmobAds: false,
  AdMob: {
    deviceID: "pub-2101182411274198",
    unitID: "ca-app-pub-2101182411274198/4100506392",
    unitInterstitial: "ca-app-pub-2101182411274198/8930161243",
    isShowInterstital: true,
  },
  appFacebookId: "287651401615534",
  CustomPages: { contact_id: 10941 },
  WebPages: { marketing: "http://inspireui.com" },

  intro: [
    {
      key: "page1",
      title: "Lorem Ipsum Dolor Sit Ame",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: "ios-basket-outline",
      colors: ["#0FF0B3", "#036ED9"],
    },
    {
      key: "page2",
      title: "Consectetur Adipisicing Elit Sed Do Eiusmod",
      text:
        "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
      icon: "ios-card-outline",
      colors: ["#13f1fc", "#0470dc"],
    },
    {
      key: "page3",
      title: "Adipisicing Elit Sed Do",
      text: "Usage Consectetur adipisicing elit, sed do eiusmod",
      icon: "ios-finger-print-outline",
      colors: ["#b1ea4d", "#459522"],
    },
  ],

  /**
   * Config For Left Menu Side Drawer
   * @param goToScreen 3 Params (routeName, params, isReset = false)
   * BUG: Language can not change when set default value in Config.js ==> pass string to change Languages
   */
  menu: {
    // has child categories
    isMultiChild: true,
    // Unlogged
    listMenuUnlogged: [
      {
        text: "Login",
        routeName: "LoginScreen",
        params: {
          isLogout: false,
        },
        icon: Icons.MaterialCommunityIcons.SignIn,
      },
    ],
    // user logged in
    listMenuLogged: [
      {
        text: "Logout",
        routeName: "LoginScreen",
        params: {
          isLogout: true,
        },
        icon: Icons.MaterialCommunityIcons.SignOut,
      },
    ],
    // Default List
    listMenu: [
      {
        text: "Shop",
        routeName: "Home",
        icon: Icons.MaterialCommunityIcons.Home,
      },
      // {
      //   text: "contactus",
      //   routeName: "ContactUsScreen",
      //   params: {
      //     url: "https://200383dec4.nxcli.net/contact"
      //   }
      // },
      // {
      //   text: "FAQ",
      //   routeName: "FaqScreen",
      //   params: {
      //     url: "https://200383dec4.nxcli.net/faq"
      //   }
      // },
      // {
      //   text: "Location",
      //   routeName: "LocationScreen",
      //   params: {
      //     url: "https://200383dec4.nxcli.net/faq"
      //   }
      // },
      // {
      //   text: "About",
      //   routeName: "AboutScreen",
      //   params: {
      //     url: "https://200383dec4.nxcli.net/about-us",
      //   }
      // }
    ],
  },

  // define menu for profile tab
  ProfileSettings: [
    {
      label: "WishList",
      routeName: "WishListScreen",
    },
    {
      label: "MyOrder",
      routeName: "MyOrders",
    },
    {
      label: "Address",
      routeName: "Address",
    },
    // {
    //   label: "Currency",
    //   isActionSheet: true,
    // },
    // only support mstore pro
    {
      label: "Languages",
      routeName: "SettingScreen",
    },
    // {
    //   label: "PushNotification",
    // },
    {
      label: "DarkTheme",
    },
    {
      label: "contactus",
      routeName: "ContactUsScreen",
      params: {
        url: "https://200383dec4.nxcli.net/contact"
      },
    },
    // {
    //   label: "FAQ",
    //   routeName: "FaqScreen",
    //   params: {
    //     url: "https://200383dec4.nxcli.net/faq",
    //   },
    // },
    // {
    //   label: "Location",
    //   routeName: "LocationScreen",
    //   params: {
    //     url: "https://store.cavaraty.com/privacy",
    //   },
    // },
    // {
    //   label: "About",
    //   routeName: "AboutScreen",
    //   params: {
    //     url: "https://200383dec4.nxcli.net/about-us",
    //   },
    // },
  ],

  // Layout select
  layouts: [
    {
      layout: Constants.Layout.card,
      image: Images.icons.iconCard,
      text: "cardView",
    },
    {
      layout: Constants.Layout.simple,
      image: Images.icons.iconRight,
      text: "simpleView",
    },
    {
      layout: Constants.Layout.twoColumn,
      image: Images.icons.iconColumn,
      text: "twoColumnView",
    },
    {
      layout: Constants.Layout.threeColumn,
      image: Images.icons.iconThree,
      text: "threeColumnView",
    },
    {
      layout: Constants.Layout.horizon,
      image: Images.icons.iconHorizal,
      text: "horizontal",
    },
    {
      layout: Constants.Layout.advance,
      image: Images.icons.iconAdvance,
      text: "advanceView",
    },
  ],

  // Default theme loading, this could able to change from the user profile (reserve feature)
  Theme: {
    isDark: false,
  },

  // new list category design
  CategoryListView: false,

  DefaultCurrency: {
    symbol: "$ ",
    name: "US Dollar",
    code: "USD",
    name_plural: "US dollars",
    decimal: ".",
    thousand: ",",
    precision: 2,
    format: "%s%v", // %s is the symbol and %v is the value
  },

  DefaultCountry: {
    code: "en",
    RTL: false,
    language: "English",
    countryCode: "US",
    hideCountryList: false, // when this option is try we will hide the country list from the checkout page, default select by the above 'countryCode'
  },
  HideCartAndCheckout: false,

  /**
   * Config notification onesignal, only effect for the Pro version
   */
  OneSignal: {
    appId: "43948a3d-da03-4e1a-aaf4-cb38f0d9ca51",
  },
  /**
   * Login required
   */
  Login: {
    RequiredLogin: false, // required before using the app
    AnonymousCheckout: true, // required before checkout or checkout anonymous
  },

  Layout: {
    HideHomeLogo: true,
    HideLayoutModal: false
  },

  GoogleSignIn: {
    iosClientId: "620544806375-iuv03qfnhfo70a7r6kmm1efq8iug7sqs.apps.googleusercontent.com"
  },

  TapPayment: {
    SecretKey: "sk_test_af1gFb6ZdTlPozuC8HK3yxwY"
  }
};
