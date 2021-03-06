import React, { Component } from 'react';
import chart from '../logos/chart.png';
import btc from '../logos/btc.png';
import eth from '../logos/eth.png';
import link from '../logos/link.png';
import ada from '../logos/ada.png';
import xmr from '../logos/xmr.png';
import yfi from '../logos/yfi.png';
import lend from '../logos/lend.png';
import comp from '../logos/comp.png';
import uni from '../logos/uni.png';
import gnt from '../logos/gnt.png';

//Libreria de axios
const axios = require("axios");

class App extends Component {

  //Aqui llamamos a la funcion "getData"
  async componentWillMount() {
    this.getData()
  }
  
//Nuestro metodo get
  getData = () => {
    //Nuestro metodo get, para acceder a la info de las criptomonedas
    axios({
      "method":"GET",
      "url":"https://coinpaprika1.p.rapidapi.com/tickers",
      "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"coinpaprika1.p.rapidapi.com",
        "x-rapidapi-key":"4bb256e94fmsh858af5ded027a70p162c89jsn29a74ff6bf75", //KEY NECESARIA PARA ACCEDER A LA INFO
        "useQueryString":true
      }
    }). then((response) => {
      const coins = response.data
      //declarar monedas y sus imagenes
      const ccArray = [
        { name: 'Bitcoin', img: btc },
        { name: 'Ethereum', img: eth },
        { name: 'Chainlink', img: link },
        { name: 'Cardano', img: ada },
        { name: 'Monero', img: xmr },
        { name: 'yearn.finance', img: yfi },
        { name: 'Aave', img: lend },
        { name: 'Compound', img: comp },
        { name: 'Uniswap', img: uni },
        { name: 'Golem', img: gnt }
      ]
      /* Buscamos la info de cada moneda escogida */
      for(let j=0; j<ccArray.length; j++){
        for (let i=0; i<coins.length; i++){
          if(coins[i].name === ccArray[j].name){
            coins[i]['img'] = ccArray[j].img
            
            this.setState({
              ccData: [...this.state.ccData, coins[i]]
            })
          }
        }
      }
      //Ordenar por rango las monedas
      this.setState({
        ccData: this.state.ccData.sort((a,b) => a.rank-b.rank)
      })
    })
    .catch((error)=>{
      console.log(error)
    })

    //Conseguir total market cap
    axios({
      "method":"GET",
      "url":"https://coinpaprika1.p.rapidapi.com/global",
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"coinpaprika1.p.rapidapi.com",
      "x-rapidapi-key":"4bb256e94fmsh858af5ded027a70p162c89jsn29a74ff6bf75",
      "useQueryString":true
      }
    })
    .then((response)=>{
      const globalData = response.data
      this.setState({ loading: true })
      this.setState({ ccGlobalMcap: globalData.market_cap_usd })
      this.setState({ loading: false })
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  constructor(props) {
    super(props)
    this.state = {
      ccData: [],
      ccGlobalMcap: '',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace text-white">
          <a>
            <img src={chart} width="30" height="30" className="d-inline-block align-top" alt="" />
            Herramientas Criptomonedas
          </a>
          {this.state.loading ? <div id="loader" className="nav-item text-nowrap d-none d-sm-none d-sm-block">Loading...</div> :
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small>Mercado de criptomonedas global:</small>&nbsp;$
              <a
                className="text-white"
                href="https://coinpaprika.com/market-overview/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {(this.state.ccGlobalMcap).toLocaleString("fr-CH")}
              </a>&nbsp;
            </li>
          }
        </nav>
        &nbsp;
          <div className="container-fluid mt-5 w-50 p-3">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                  <table className="table table-striped table-hover table-fixed table-bordered text-monospace">
                    <caption>Fuente de datos:
                      <a target="_blank" rel="noopener noreferrer" href="https://coinpaprika.com/">coinpaprika</a>
                    </caption>
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Rango</th>
                        <th scope="col">Logo</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Market Cap</th>
                      </tr>
                    </thead>
                      <tbody>
                      {this.state.ccData.map((data, key) => {
                          return(
                            <tr key={key}>
                              <td>{data.rank}</td>
                              <td><img src={data.img} width="25" height="25" className="d-inline-block align-top" alt="" /></td>
                              <td><a target="_blank" rel="noopener noreferrer" href={"https://coinpaprika.com/coin/" + data.id}>{data.name}</a></td>
                              <td>${(data.quotes.USD.price).toFixed(2)}</td>
                              <td>${(data.quotes.USD.market_cap).toLocaleString("fr-CH")}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                  </table>
              </main>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
