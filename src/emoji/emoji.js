import React from 'react';
import { PixelRatio, StyleSheet, Text, View, PanResponder, Animated, TouchableOpacity } from 'react-native';

const REACTIONS = [
  { label: "Worried", src: require('./assets/worried.png'), bigSrc: require('./assets/worried_big.png') },
  { label: "Sad", src: require('./assets/sad.png'), bigSrc: require('./assets/sad_big.png') },
  { label: "Strong", src: require('./assets/ambitious.png'), bigSrc: require('./assets/ambitious_big.png') },
  { label: "Happy", src: require('./assets/smile.png'), bigSrc: require('./assets/smile_big.png') },
  { label: "Surprised", src: require('./assets/surprised.png'), bigSrc: require('./assets/surprised_big.png') },
];
const WIDTH = 320;
const DISTANCE =  WIDTH / REACTIONS.length;
const END = WIDTH - DISTANCE;

export default class Emoji extends React.Component {
  constructor(props) {
    super(props);
    this._pan = new Animated.Value(DISTANCE);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this._pan.setOffset(this._pan._value);
        this._pan.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {Animated.event([null, {dx: this._pan}])},
      onPanResponderRelease: (evt, gestureState) => {
        this._pan.flattenOffset();

        let offset = Math.max(0, this._pan._value + 0);
        if (offset < 0) return this._pan.setValue(0);
        if (offset > END ) return this._pan.setValue(END);

        const modulo = offset % DISTANCE;
        offset = (modulo >= DISTANCE/2) ? (offset+(DISTANCE-modulo)) : (offset-modulo);
        console.log('modulo offset offset+(offset+(Distance-modulo)) offset-modulo')
        this.updatePan(offset);
      }
    });
  }

  updatePan(toValue) {
  //  console.log('u toValue', toValue)
    Animated.spring(this._pan, { toValue, friction: 7 }).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wrap}>
          <Text style={styles.welcome}>
            How are you feeling?
          </Text>

          <Animated.View style={[styles.reactions]} {...this._panResponder.panHandlers}>
            {REACTIONS.map((reaction, idx) => {
              const u = idx * DISTANCE;
              let inputRange = [u-20, u, u+20];
              let scaleOutputRange = [1, 1.5, 1];
              //let topOutputRange = [0, 10, 0]; what even is this for
              let colorOutputRange = ['#999', '#222', '#999'];
              console.log('just log the shit out of it', inputRange, scaleOutputRange)
              if (u-20 < 0) {
                inputRange = [u, u+40];
                scaleOutputRange = [1.5, 1];
                colorOutputRange = ['#222', '#999'];
              }

              if (u+20 > END) {
                inputRange = [u-40, u];
                scaleOutputRange = [1, 1.5];
                colorOutputRange = ['#999', '#222'];
              }
              console.log('u', u, inputRange)

              return (
                <TouchableOpacity onPressIn={() => this.updatePan(u)} onPressOut={() => this.updatePan(u)} activeOpacity={0.9} key={idx}>
                  <View style={styles.smileyWrap}>
                    <Animated.Image
                      source={reaction.src}
                      style={[styles.smiley, {
                        transform: [{
                          scale: this._pan.interpolate({
                            inputRange,
                            outputRange: scaleOutputRange,
                            extrapolate: 'clamp',
                          })
                        }]
                      }]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>
      </View>
    );
  }
}

/*
<Animated.View {...this._panResponder.panHandlers} style={[styles.bigSmiley, {//this one is the big smile
  transform: [{
    translateX: this._pan.interpolate({
      inputRange: [0, END],
      outputRange: [0, END],
      extrapolate: 'clamp',
    })
  }]
}]}>
</Animated.View>
*/

const size = 42;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 100,
  },
  wrap: {
    width: WIDTH,
    marginBottom: 50,
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    fontWeight: '600',
    fontFamily: 'Avenir',
    marginBottom: 50,
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderRadius: DISTANCE,
    width: WIDTH,
  },
  smileyWrap: {
    width: DISTANCE,
    height: DISTANCE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smiley: {
    width: size,
    height: size,
    borderRadius: size/2,
    backgroundColor: '#c7ced3',
  },
  bigSmiley: {
    width: WIDTH,
    height: DISTANCE,
    borderRadius: DISTANCE,
    backgroundColor: 'rgba(255, 177, 141, .2)',
    position: 'absolute',
    top: 0,
    left: -WIDTH,
  },
  bigSmileyImage: {
    width: DISTANCE,
    height: DISTANCE,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  reactionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
    fontWeight: '400',
    fontFamily: 'Avenir',
    marginTop: 5,
  }
});
