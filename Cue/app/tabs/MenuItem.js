// @flow

var React = require('React');
var View = require('View');
var Text = require('Text');
var TouchableHighlight = require('TouchableHighlight');
var StyleSheet = require('StyleSheet');


class MenuItem extends React.Component {
  props: {
    selected: boolean;
    title: string;
    onPress: () => void;
  };

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.container}>
          <Text>
            {this.props.title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
  },
});

module.exports = MenuItem;