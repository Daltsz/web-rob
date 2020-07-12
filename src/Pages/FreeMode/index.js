import React from 'react';
import Header_Design from '../../Components/Header_Design';
import BlocklyComponent, { Block, Value, Field, Shadow } from '../../Components/Blockly/index';
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

    let state = this.state;

    let espace = ' ';


    let code =  BlocklyJS.workspaceToCode(this.simpleWorkspace.workspace);
    
    state.value = code;

    state.value = state.value.split(espace);



    state.list = state.value;

    state.value = '';
  
    console.log(this.state.list);

  }


  handleClick = async (e) =>{

    e.preventDefault();

    

    try{
      let resp = await api.post('/led-blink', this.state.list);
      console.log(resp);
    }catch(err){

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
                <BlocklyComponent ref={this.simpleWorkspace}
                readOnly={false} trashcan={true} media={'media/'}
                move={{
                    scrollbars: true,
                    drag: true,
                    wheel: true
                }}
                initialXml={`
                <xml xmlns="http://www.w3.org/1999/xhtml">
                <block type="controls_ifelse" x="0" y="0"></block>
                </xml>
                `}>
                    <Block type="test_react_field" />
                    <Block type="test_react_date_field" />
                    <Block type="controls_ifelse" />
                    <Block type="logic_compare" />
                    <Block type="logic_operation" />
                    <Block type="controls_repeat_ext">
                    <Value name="TIMES">
                        <Shadow type="math_number">
                        <Field name="NUM">10</Field>
                        </Shadow>
                    </Value>
                    </Block>
                    <Block type="logic_operation" />
                    <Block type="logic_negate" />
                    <Block type="logic_boolean" />
                    <Block type="logic_null" disabled="true" />
                    <Block type="logic_ternary" />
                    <Block type="text_charAt">
                    <Value name="VALUE">
                        <Block type="variables_get">
                        <Field name="VAR">text</Field>
                        </Block>
                    </Value>
                    </Block>
                    <Block type='led_blink'></Block>
                </BlocklyComponent>
            </div>

          <button onClick={this.carregar}>
            Compilar 
          </button>

          <button onClick={this.handleClick}>
            Rodar
          </button>

        </div>
    );
  }
}

export default FreeMode;









// export default function FreeMoode(){

//     return(

//         <div>
//             <header>

//                 <Heade_Design></Heade_Design>

//             </header>


//             <h1>FreeMode</h1>

            
//         </div>

//     );
// }