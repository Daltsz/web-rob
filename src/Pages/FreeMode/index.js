import React from 'react';
import Header_Design from '../../Components/Header_Design';
import BlocklyComponent, { Block, Value, Field, Shadow, Category } from '../../Components/Blockly/index';
import BlocklyJS from 'blockly/javascript';
import '../../Components/Blocks/customblocks';
import '../../Components/Generator/generator';
import './FreeMode.css'
import api from '../../Services/api';

class FreeMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      list: []

    };
    this.simpleWorkspace = React.createRef();
    this.carregar = this.carregar.bind(this);
  }


  carregar = () =>{
    try{
      let state = this.state;
      let espace = ' ';
      let code =  BlocklyJS.workspaceToCode(this.simpleWorkspace.workspace);
      state.value = code;
      state.value = state.value.split(espace);
      state.list = state.value;
      state.value = '';
      alert('Compilado Com Sucesso')
      console.log(this.state.list);
      console.log(typeof(this.simpleWorkspace))
      console.log(typeof(this.carregar))
    }catch(err){
      alert('Não Compilado')
      console.log('message error', err);
    }
  }


  handleClick = async (e) =>{
    e.preventDefault();
    try{
      let resp = await api.post('/led-blink', this.state.list);
      console.log(resp);
      alert('Rodou Corretamente')
    }catch(err){
      alert('Infelizmente não Rodou')
      console.log('Mensagem Não Enviada', err);
    }
  }


  render() {
    return (
        <div>
            <header>  
                <Header_Design></Header_Design>
            </header>       
            <div className="BlockCompnent">
                <BlocklyComponent
                ref={this.simpleWorkspace}
                media={'media/'}
                readOnly={false} 
                trashcan={true}
                move={{
                    scrollbars: true,
                    drag: false,
                    wheel: true
                }}> 
                    <Block type='led_blink'></Block>
                    <Block type='Para_Frente'></Block>
                    <Block type='Para_Tras'></Block>
                    <Block type='Esquerda'></Block>
                    <Block type='Direita'></Block>
                </BlocklyComponent>
            </div>
          <div className="buttonsWorkSpace">
            <button className="Btns" onClick={this.carregar}>
              Compilar 
            </button>
            <button  className="Btns" onClick={this.handleClick}>
              Rodar
            </button>
          </div>
        </div>
    );
  }
}
export default FreeMode;






