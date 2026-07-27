import React from 'react';
import {links} from '@/data/links';
import './style.scss';
function main(){
    return(
        <>
        <div className="main">
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a href={link.url}>{link.name}</a>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default main