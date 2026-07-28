import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {data} from '@/data/links';

import './style.scss';
function main(){
    return(
        <>
        <div className="main">
            <ul>
                {data.map((link, index) => (
                    <li key={index}>
                        <Link to={link.url}>{link['text-name']}</Link>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default main