import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

import './style.scss';
import Home from '@/assets/icons/home-1-svgrepo-com.svg?react';
import HomeActive from '@/assets/icons/home-page-svgrepo-com.svg?react';
import Menu from '@/assets/icons/menu-rounded.svg?react';

import { useDynamicLinks  } from '@/data/links/functions.jsx';
import contacts from '@/data/contacts/index.json';
import { contactIcons } from '@/data/contacts/functions.jsx';

function main() {
    const [activeLink, setActiveLink] = useState(useLocation().pathname);
    const [toggleMenu, setToggleMenu] = useState('');

    const { links, isLoading, data } = useDynamicLinks();
    if(isLoading) return console.log("<p>Loading...</p>")
    return (
        <>
            <div className={`main ${toggleMenu}`}>
                <div className="menu">
                    <Menu className={`menu-icon ${toggleMenu}`} onClick={() => toggleMenu === '' ? setToggleMenu('active') : setToggleMenu('')} />
                    <div className={`nav-toggle ${toggleMenu}`}>
                        <ul className='nav' >
                            {data.map((link) => (
                                <li key={link.url}>
                                    <Link to={`${link.url}`} className={activeLink === link.url ? 'active' : ''} onClick={() => { setActiveLink(link.url); setToggleMenu('') }}>
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
                    <li>
                        <Link to="/" className={activeLink === '/' ? 'active' : ''} onClick={() => setActiveLink('/')}>
                            {activeLink === '/' ?
                                <HomeActive style={{ width: '1.3pc', height: '2pc' }} />
                                : <Home style={{ width: '1.3pc', height: '1pc' }} />
                            }{data[data.findIndex(link => link.url === '/')]['label']}
                        </Link>
                    </li>
                    {data.map((link) => (
                        <li key={link.url} style={link.type_id ? {} : { display: 'none' }}>
                            {
                                link.type_id ? (
                                    <Link to={`${link.url}`} className={activeLink === link.url ? 'active' : ''} onClick={() => setActiveLink(link.url)}>
                                        {link['label']}
                                    </Link>
                                ) : <></>
                            }
                        </li>
                    ))}
                    {data.map((link) => (
                        <li key={link.url} style={!link.type_id && link.url !== "/" ? {} : { display: 'none' }}>
                            {
                                !link.type_id && link.url !== "/" ? (
                                    <Link to={`${link.url}`} className={activeLink === link.url ? 'active' : ''} onClick={() => setActiveLink(link.url)}>
                                        {link['label']}
                                    </Link>
                                ) : <></>
                            }
                        </li>
                    ))}
                </ul>
                <ul className='icons'>
                    {contacts.map(({ id, icon, url }) => {
                        const Component = contactIcons[icon];
                        return (
                            <li key={id}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
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
                </ul>
            </div>
        </>
    )
}
export default main