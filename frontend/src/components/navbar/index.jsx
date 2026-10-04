import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

import './style.scss';
import Home from '@/assets/icons/home-1-svgrepo-com.svg?react';
import HomeActive from '@/assets/icons/home-page-svgrepo-com.svg?react';
import Menu from '@/assets/icons/menu-rounded.svg?react';

import { useDynamicLinks } from '@/data/links/functions.jsx';

function main() {
    const [activeLink, setActiveLink] = useState(useLocation().pathname);
    const [toggleMenu, setToggleMenu] = useState('');

    const { links, isLoading, data } = useDynamicLinks();
    if (isLoading) return console.log("<p>Loading...</p>")
    return (
        <>
            <div className={`main ${toggleMenu}`}>
                <div className="menu">
                    <Menu className={`menu-icon ${toggleMenu}`} onClick={() => toggleMenu === '' ? setToggleMenu('active') : setToggleMenu('')} />
                    <div className={`nav-toggle ${toggleMenu}`}>
                        <ul className='nav' >
                            {data.filter((link) => link.id)
                                .sort((a, b) => {
                                    if (a.typeId && !b.typeId) return -1;
                                    if (!a.typeId && b.typeId) return 1;
                                    return 0;
                                })
                                .map((link) => (
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
                <div className="logo">
                    <img src="./logo.png" width={"100px"} height={"100vh"} alt="" style={{paddingBottom:"10px"}}/>
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
                    {data.filter((link) => link.id)
                        .sort((a, b) => {
                            if (a.typeId && !b.typeId) return -1;
                            if (!a.typeId && b.typeId) return 1;
                            return 0;
                        })
                        .map((link) => (
                            <li key={link.url} style={link.url !== '/' ? {} : { display: 'none' }}>
                                {
                                    link.url !== '/' ? (
                                        <Link to={`${link.url}`} className={activeLink === link.url ? 'active' : ''} onClick={() => setActiveLink(link.url)}>
                                            {link['label']}
                                        </Link>
                                    ) : <></>
                                }
                            </li>
                        ))}
                </ul>
            </div>
        </>
    )
}
export default main