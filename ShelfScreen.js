import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import Books from "../components/Books";
import axios from "axios";

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export default class ShelfScreen extends React.Component {
  state = {
    books: "",
    refreshing: false,
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    /*
    wait(1000).then(() => {
      this.setState({ refreshing: false });
    });
    */
    this.callApi().then((res) =>
      this.setState({ refreshing: false, books: res })
    );
  };

  componentDidMount() {
    this.callApi()
      .then((res) => this.setState({ books: res }))
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("http://172.30.1.38:3000/api/book");
    const body = await response.json();
    //console.log(body);
    return body;
  };

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {this.state.books ? (
          this.state.books.map((c) => {
            return (
              <Books
                key={c.id}
                id={c.id}
                title={c.title}
                author={c.author}
                price={c.price}
                image={c.image}
                publisher={c.publisher}
              />
            );
          })
        ) : (
          <View style={styles.container}>
            <Text style={styles.text}>책을 불러오고 있어요.</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 30,
  },
});
