import { BrowserRouter as Router, Link } from 'react-router-dom';
import {data} from '@/data/links';

import './style.scss';
function main(){
    return(
        <>
        <div className="main">
            <ul>
                {data.map((link) => (
                    <li key={link.url}>
                        <Link to={link.url}>{link['label']}</Link>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default main