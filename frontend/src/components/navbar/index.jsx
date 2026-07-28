import { BrowserRouter as Router, Link } from 'react-router-dom';
import Whatsapp from '@/assets/icons/whatsapp-svgrepo-com.svg?react';
import Linkedin from '@/assets/icons/linkedin-svgrepo-com.svg?react';
import Github from '@/assets/icons/github-142-svgrepo-com.svg?react';
//
import {data} from '@/data/links';

import './style.scss';
function main(){
    return(
        <>
        <div className="main">
            <ul className='nav'>
                {data.map((link) => (
                    <li key={link.url}>
                        <Link to={link.url}>{link['label']}</Link>
                    </li>
                ))}
            </ul>
            <ul className='icons'>
                <p><Whatsapp style={{width: '2.5pc', height: '2.5pc'}}/></p>
                <p><Linkedin style={{width: '3.1pc', height: '3.1pc'}}/></p>
                <p><Github style={{width: '2.5pc', height: '2.5pc'}}/></p>
            </ul>
        </div>
        </>
    )
}

export default main