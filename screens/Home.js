import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import Axios from 'axios'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state={
      url: 'http://192.168.18.3:8090/api',
      optionBranch: {},
      optionProduct: {},
      maxTenor: 60,

      inputFirstName: '',
      inputLastName: '',
      inputPhone: '',
      selectBranch: '',
      selectProduct: '',
      selectTenor: '',

      listCustomer: [],
    };
    this.getBranch.bind(this);
    this.getBranch();
    this.getProduct.bind(this);
    this.getProduct();
    this.getListCustomer.bind(this);
    this.getListCustomer();
    this.props.navigation.addListener(
      'didFocus',
      () => {
        this.getListCustomer();
      }
    );
  }

  getListCustomer = () => {
    Axios.get(this.state.url + '/GetAllDataCust')
    .then(res => {
      this.setState({listCustomer: res.data.data})
    });
  };
  getBranch = () => {
    Axios.get(this.state.url + '/GetMasterBranch')
    .then(res => {
      this.setState({optionBranch: res.data.data})
    });
  };
  initBranch = () => {
    const res = this.state.optionBranch;
    var pickerArr = [];

    for (var key in res) {
      pickerArr.push(<Picker.Item key={key} label={this.state.optionBranch[key].BRANCH_NAME} value={this.state.optionBranch[key].BRANCH_ID}/>);
    }

    return pickerArr;
  };
  getProduct = () => {
    Axios.get(this.state.url + '/GetMasterProduct')
    .then(res => {
      this.setState({optionProduct: res.data.data})
    });
  };
  initProduct = () => {
    const res = this.state.optionProduct;
    var pickerArr = [];

    for (var key in res) {
      pickerArr.push(<Picker.Item key={key} label={this.state.optionProduct[key].PRODUCT_NAME} value={this.state.optionProduct[key].PRODUCT_ID}/>);
    }

    return pickerArr;
  };
  initTenor = () => {
    var pickerArr = [];
    var max = this.state.maxTenor;
    for (let key = 1; key <= max; key++) {
      pickerArr.push(<Picker.Item key={key} label={key.toString()} value={key}/>);
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
      firstName: this.state.inputFirstName,
      lastName: this.state.inputLastName,
      phone: this.state.inputPhone,
      branchId: this.state.selectBranch,
      productId: this.state.selectProduct,
      tenor: this.state.selectTenor,
    }

    Axios.post(this.state.url + '/SaveDataCust', data)
    .then( res => {
      if(res.data.statusCode == '200'){
        this.clear();
        this.getListCustomer();
        // pop up success
      }
      else {
        // pop up failed
      }
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
  delete = (CUST_ID) => {
    const data = {
      id: CUST_ID,
    }

    Axios.post(this.state.url + '/DeleteDataCust', data)
    .then( res => {
      if(res.data.statusCode == '200'){
        this.getListCustomer();
        // pop up success
      }
      else {
        // pop up failed
      }
    })
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
              {this.initBranch()}
            </Picker>
            <Picker
              style={styles.picker}
              onValueChange={this.setProduct}
              selectedValue={this.state.selectProduct}
            >
              <Picker.Item label='Select Product Name' value='disabled' color='#aaa'/>
              {this.initProduct()}
            </Picker>
            <Picker
              style={styles.picker}
              onValueChange={this.setTenor}
              selectedValue={this.state.selectTenor}
            >
              <Picker.Item label='Select Tenor' value='disabled' color='#aaa'/>
              {this.initTenor()}
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

        {
          this.state.listCustomer.map((val, index)=>(
            <View style={styles.row} key={index}>
              <View style={{width: 130}}>
                <Image
                  style={{width: 120, height: 120}}
                  source={{ uri: val.AVATAR }}
                />
              </View>
              <View style={{width: Dimensions.get('window').width-155}}>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('UpdateCust', { id: val.CUST_ID })}}>
                  <Text style={styles.custNameText}>{val.FIRST_NAME} {val.LAST_NAME}</Text>
                </TouchableOpacity>
                <Text style={styles.custDetailText}>Branch Name: {val.BRANCH_NAME}</Text>
                <Text style={styles.custDetailText}>Product Name: {val.PRODUCT_NAME}</Text>
                <Text style={styles.custDetailText}>Tenor: {val.TENOR_ID}</Text>
              </View> 
              <View style={{width: 25}}>
                <TouchableOpacity onPress={() => Alert.alert('Confirmation', 'Confirm to Delete ?', [{text: 'Cancel', onPress: undefined}, {text: 'Yes, Delete', onPress: () => this.delete(val.CUST_ID)}])}>
                  <View style={styles.btnDelCust}>
                    <Text style={{color: '#fff'}}>X</Text>
                  </View>
                </TouchableOpacity> 
              </View>
            </View>
          ))
        }

      </ScrollView>
    );
  }
}

export default Home;

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
