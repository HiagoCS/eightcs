import { BrowserRouter as Router, Link } from 'react-router-dom';

import Home from '@/assets/icons/home-1-svgrepo-com.svg?react';
import HomeActive from '@/assets/icons/home-page-svgrepo-com.svg?react';
import Menu from '@/assets/icons/menu-rounded.svg?react';
import { data } from '@/data/links';
import contacts from '@/data/contacts/index.json';
import { contactIcons } from '@/data/contacts/functions.jsx';
import { useState } from 'react';

import './style.scss';
function main() {
    const [activeLink, setActiveLink] = useState('/');
    const [toggleMenu, setToggleMenu] = useState('');
    return (
        <>
            <div className={`main ${toggleMenu}`}>
                <div className="menu">
                    <Menu className={`menu-icon ${toggleMenu}`} onClick={() => toggleMenu === '' ? setToggleMenu('active') : setToggleMenu('')} />
                    <div className={`nav-toggle ${toggleMenu}`}>
                        <ul className='nav' >
                            {data.map((link) => (
                                <li key={link.url}>
                                    <Link to={link.url} className={activeLink === link.url ? 'active' : ''} onClick={() => { setActiveLink(link.url); setToggleMenu('') }}>
                                        {link.url === '/' ?
                                            (activeLink === link.url ?
                                                <HomeActive style={{ width: '1.3pc', height: '2pc' }} />
                                                : <Home style={{ width: '1.3pc', height: '1pc' }} />
                                            ) : <></>
                                        }{link['label']}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <ul className='nav' >
                    {data.map((link) => (
                        <li key={link.url}>
                            <Link to={link.url} className={activeLink === link.url ? 'active' : ''} onClick={() => setActiveLink(link.url)}>
                                {link.url === '/' ?
                                    (activeLink === link.url ?
                                        <HomeActive style={{ width: '1.3pc', height: '2pc' }} />
                                        : <Home style={{ width: '1.3pc', height: '1pc' }} />
                                    ) : <></>
                                }{link['label']}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className='icons'>
                    {contacts.map(({ id, icon, url }) => {
                        const Component = contactIcons[icon];

                        return (
                            <li key={id}>
                                <a href={url}>
                                    <Component
                                        style={{
                                            width: '2.5pc',
                                            height: '2.5pc'
                                        }}
                                    />
                                </a>
                            </li>
                        );
                    })}
                    {/* <p><Whatsapp style={{ width: '2.5pc', height: '2.5pc' }} /></p>
                    <p><Linkedin style={{ width: '3.1pc', height: '3.1pc' }} /></p>
                    <p><Github style={{ width: '2.5pc', height: '2.5pc' }} /></p> */}
                </ul>
            </div>
        </>
    )
}
export default main