import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get("window");

export default StyleSheet.create({
  container:{
    // paddingLeft: 5,
    // paddingRight: 6,
    marginLeft: -4,
    width: width * 0.26,
    marginTop: 20,
    alignItems:'center'
  },
  button:{
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems:'center',
    justifyContent:'center'
  },
  wrap:{
    alignItems:'center',
    width: 110
  },
  title:{
    marginTop: 28,
    fontSize: 13,
    // fontFamily: Constants.fontHeader,
    opacity: 0.9
  },

  iconView: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  icon:{
    width: 55,
    height:55,
    resizeMode:'contain',
    marginBottom: 30
  },
  background: {
    backgroundColor: '#f1f1f1',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems:'center',
    justifyContent:'center'
  }
})
