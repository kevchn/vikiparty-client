import React from 'react';
import ReactDOM from 'react-dom';

import Title from './components/Title';

import './styles/styles.scss';

const template = (
    <div>
        <Title/>
    </div>
);

ReactDOM.render(template, document.getElementById('root'));