import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import Axios from 'axios'


class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      url: 'http://localhost:8090/api',
      optionBranch: {},
      optionProduct: {},
      maxTenor: 60,

      inputFirstName: '',
      inputLastName: '',
      inputPhone: '',
      selectBranch: '',
      selectProduct: '',
      selectTenor: '',
    };
    this.fetchBranch.bind(this);
    this.fetchBranch();
    this.fetchProduct.bind(this);
    this.fetchProduct();
  }

  fetchBranch = () => {
    Axios.get(this.state.url + '/GetMasterBranch')
    .then(res => {
      this.setState({optionBranch: res.data.data})
    });
  };
  getBranch = () => {
    const res = this.state.optionBranch;
    var pickerArr = [];

    for (var key in res) {
      pickerArr.push(<Picker.Item label={this.state.optionBranch[key].BRANCH_NAME} value={this.state.optionBranch[key].BRANCH_ID}/>);
    }

    return pickerArr;
  };
  fetchProduct = () => {
    Axios.get(this.state.url + '/GetMasterProduct')
    .then(res => {
      this.setState({optionProduct: res.data.data})
    });
  };
  getProduct = () => {
    const res = this.state.optionProduct;
    var pickerArr = [];

    for (var key in res) {
      pickerArr.push(<Picker.Item label={this.state.optionProduct[key].PRODUCT_NAME} value={this.state.optionProduct[key].PRODUCT_ID}/>);
    }

    return pickerArr;
  };
  getTenor = () => {
    var pickerArr = [];

    for (let key = 1; key <= this.state.maxTenor; key++) {
      pickerArr.push(<Picker.Item label={key} value={key}/>);
    }

    return pickerArr;
  };

  setBranch = (option) => {
    if(option != 'disabled') {
      this.setState({selectBranch: option})
    }
  };
  setProduct = (option) => {
    if(option != 'disabled') {
      this.setState({selectProduct: option})
    }
  };
  setTenor = (option) => {
    if(option != 'disabled') {
      this.setState({selectTenor: option})
    }
  };

  submit = () => {
    const data = {
      inputFirstName: this.state.inputFirstName,
      inputLastName: this.state.inputLastName,
      inputPhone: this.state.inputPhone,
      selectBranch: this.state.selectBranch,
      selectProduct: this.state.selectProduct,
      selectTenor: this.state.selectTenor,
    }
    // console.log('data before submit: ', data);
    Axios.post(url, data)
    .then( res => {
      console.log(res);
    })
  };
  clear = () => {
    this.setState({inputFirstName: ''})
    this.setState({inputLastName: ''})
    this.setState({inputPhone: ''})
    this.setState({selectBranch: ''})
    this.setState({selectProduct: ''})
    this.setState({selectTenor: ''})
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <View>
            <Text style={styles.header}>Form Data Customer</Text>
          </View>

          <View>
            <TextInput
              style={styles.textInput}
              placeholder='First Name'
              maxLength={30}
              value={this.state.inputFirstName}
              onChangeText={(text)=>this.setState({inputFirstName: text})}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Last Name'
              maxLength={30}
              value={this.state.inputLastName}
              onChangeText={(text)=>this.setState({inputLastName: text})}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Phone Number'
              maxLength={13}
              value={this.state.inputPhone}
              onChangeText={(text)=>this.setState({inputPhone: text})}
            />

            <Picker
              style={styles.picker}
              onValueChange={this.setBranch}
              selectedValue={this.state.selectBranch}
            >
              <Picker.Item label='Select Branch' value='disabled' color='#aaa'/>
              {this.getBranch()}
            </Picker>
            <Picker
              style={styles.picker}
              onValueChange={this.setProduct}
              selectedValue={this.state.selectProduct}
            >
              <Picker.Item label='Select Product Name' value='disabled' color='#aaa'/>
              {this.getProduct()}
            </Picker>
            <Picker
              style={styles.picker}
              onValueChange={this.setTenor}
              selectedValue={this.state.selectTenor}
            >
              <Picker.Item label='Select Tenor' value='disabled' color='#aaa'/>
              {this.getTenor()}
            </Picker>

            <TouchableOpacity onPress={this.submit}>
              <View style={styles.btnSubmit}>
                <Text style={styles.btnSubmitText}>Submit</Text>
              </View>
            </TouchableOpacity>          
            <TouchableOpacity onPress={this.clear}>
              <View style={styles.btnClear}>
                <Text style={styles.btnClearText}>Clear Form</Text>
              </View>
            </TouchableOpacity>  
          </View>
        </View>

        <View style={styles.row}>
          <View style={{width: 130}}>
            <Image
              style={{width: 120, height: 120}}
              source={{ uri: 'https://i.pravatar.cc/50?u=1' }}
            />
          </View>
          <View style={{width: Dimensions.get('window').width-155}}>
            <Text style={styles.custNameText}>Full Name</Text>
            <Text style={styles.custDetailText}>Branch Name: </Text>
            <Text style={styles.custDetailText}>Product Name: </Text>
            <Text style={styles.custDetailText}>Tenor: </Text>
          </View>
          <View style={{width: 25}}>
            <TouchableOpacity>
              <View style={styles.btnDelCust}>
                <Text style={{color: '#fff'}}>X</Text>
              </View>
            </TouchableOpacity> 
          </View>
        </View>

      </ScrollView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    marginTop: 40,
    marginBottom: 30,
  },
  textInput: {
    width: 300,
    fontSize: 20,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  picker: {
    width: 300,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  btnSubmit: {
    height: 50,
    backgroundColor: '#016ecd',
    marginTop: 40,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },
  btnClear: {
    height: 50,
    backgroundColor: '#faa632',
    marginTop: 5,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSubmitText: {
    color: '#fff',
    fontSize: 20,
  },
  btnClearText: {
    fontSize: 20,
  },

  row: {
    flexDirection: 'row',
    alignContent: 'stretch',
  },
  custNameText: {
    color: '#248e82',
    fontSize: 25,
  },
  custDetailText: {
    fontSize: 15,
  },
  btnDelCust: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#da4f4a',
    width: 20,
    borderRadius: 5,
  }
});
