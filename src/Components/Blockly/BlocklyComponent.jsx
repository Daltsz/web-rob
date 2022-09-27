import React from 'react';
import './BlocklyComponent.css';
import Blockly from 'blockly/core';
import locale from 'blockly/msg/en';
import 'blockly/blocks';

Blockly.setLocale(locale);

class BlocklyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.blocklyDiv = React.createRef();
        this.toolbox = React.createRef();
    }
    componentDidMount() {
        const { initialXml, children, ...rest } = this.props;
        this.primaryWorkspace = Blockly.inject(
            this.blocklyDiv.current,
            {
                toolbox: this.toolbox.current,
                ...rest
            },
        );
        if (initialXml) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initialXml), this.primaryWorkspace);
        }
    }
    setXml(xml) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.primaryWorkspace);
    }
    render() {
        const { children } = this.props;
        return <React.Fragment>
            <div ref={this.blocklyDiv} id="blocklyDiv" /> 
            <xml xmlns="" is="blockly" ref={this.toolbox}>
                {children}
            </xml>
        </React.Fragment>;
    }
}

export default BlocklyComponent;
