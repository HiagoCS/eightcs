import Contabilidade from '@/assets/icons/calculator-svgrepo-com.svg?react';
import Declaracoes from '@/assets/icons/file-invoice-dollar-svgrepo-com.svg?react';
import Consultoria from '@/assets/icons/search-alt-2-svgrepo-com.svg?react';
import Contact from '@/assets/icons/contact.svg?react';

export function cardsIcons() {
    return {
        icons: {
            contabilidade: Contabilidade,
            declaracoes: Declaracoes,
            consultoria: Consultoria,
            contact: Contact
        }
    }
}