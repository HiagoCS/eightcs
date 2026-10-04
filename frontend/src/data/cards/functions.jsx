import Portfólio from '@/assets/icons/briefcase-svgrepo-com.svg?react';
import About from '@/assets/icons/company-svgrepo-com.svg?react'
import Clients from '@/assets/icons/businessman-clients-portfolio-svgrepo-com.svg?react';
import Contact from '@/assets/icons/contact.svg?react';

export function cardsIcons() {
    return {
        icons: {
            portfolio: Portfólio,
            about: About,
            clients: Clients,
            contact: Contact
        }
    }
}