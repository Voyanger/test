import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import Axios from 'axios'
import { NavigationActions } from 'react-navigation'

class UpdateCust extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state={
      url: 'http://192.168.18.3:8090/api',
      optionBranch: {},
      optionProduct: {},
      maxTenor: 60,

      id: navigation.getParam('id'),
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

    this.getCustomer();
  }
  getListCustomer() {
    Axios.get(this.state.url + '/GetAllDataCust')
    .then(res => {
      this.setState({listCustomer: res.data.data})
    });
  };
  getCustomer = () => {
    Axios.get(this.state.url + '/GetDataCustomer?id=' + this.state.id)
    .then(res => {
        // console.log(res.data.data[0]);
        this.setState({inputFirstName: res.data.data[0].FIRST_NAME});
        this.setState({inputLastName: res.data.data[0].LAST_NAME});
        this.setState({inputPhone: res.data.data[0].PHONE_NO.toString()});
        this.setState({selectBranch: res.data.data[0].BRANCH_ID});
        this.setState({selectProduct: res.data.data[0].PRODUCT_ID});
        this.setState({selectTenor: res.data.data[0].TENOR_ID});
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
        id: this.state.id,
        firstName: this.state.inputFirstName,
        lastName: this.state.inputLastName,
        phone: this.state.inputPhone,
        branchId: this.state.selectBranch,
        productId: this.state.selectProduct,
        tenor: this.state.selectTenor,
    }

    Axios.post(this.state.url + '/UpdateDataCust', data)
    .then( res => {
      if(res.data.statusCode == '200'){
        this.props.navigation.navigate('Home', {callback: 'test'});
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
            <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
              <View style={styles.btnBack}>
                <Text style={styles.btnBackText}>Back</Text>
              </View>
            </TouchableOpacity>  
          </View>
        </View>

      </ScrollView>
    );
  }
}

export default UpdateCust;

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
  btnBack: {
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
  btnBackText: {
    fontSize: 20,
  },

});
