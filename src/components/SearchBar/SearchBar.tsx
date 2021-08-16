import { Component } from 'react';

import InputForm from '../InputForm/InputForm';

import './search-bar.css';

class SearchBar extends Component{
  
    render(){
        return(
          <div>
            <div className="container">
                <h1 className="heading">Walley</h1>
            </div>
            <InputForm />
          </div>
        )
    }
}
export default SearchBar