import "./style.scss";

import EmailIcon from "@/assets/icons/email-1-svgrepo-com.svg?react";
import PhoneIcon from "@/assets/icons/phone-call-svgrepo-com.svg?react";
import PinIcon from "@/assets/icons/location-pin-svgrepo-com.svg?react";

import contacts from "@/data/contacts/index.json";
import { contactIcons } from "@/data/contacts/functions.jsx";

import { useInfos } from "@/data/hooks/useInfos";

export default function ContactPage() {
    const {
        data: infos,
        isLoading,
        error
    } = useInfos();

    if (isLoading) {
        return console.log("Loading...");
    }

    if (error) {
        return console.log(error.message);
    }

    if (!infos) {
        return console.log(
            "Nenhuma informação de cliente encontrada!"
        );
    }

    const title = infos.company && infos.company !== ""
        ? infos.company.split(" ")
        : infos.name.split(" ");

    const phone = infos.phone?.replace(/\D/g, "") || "";
    const whatsapp = infos.whatsapp?.replace(/\D/g, "") || "";

    const whatsappNumber =
        phone.length === 11
            ? phone
            : whatsapp;

    return (
        <section className="app contact">

            <div className="contacts">

                {/* =====================================================
                    CABEÇALHO
                ===================================================== */}

                <div className="contact-header">

                    <span className="contact-label">
                        ENTRE EM CONTATO
                    </span>

                    <div className="contact-title">
                        <h2>
                            {title[0]}
                        </h2>

                        {title[1] && (
                            <h3>
                                {title.slice(1).join(" ")}
                            </h3>
                        )}
                    </div>

                    <p className="contact-description">
                        {infos.footer}
                    </p>

                </div>

                {/* =====================================================
                    CONTEÚDO
                ===================================================== */}

                <div className="contact-content">

                    {/* =================================================
                        CONTATOS
                    ================================================= */}

                    <div className="contact-details">

                        <div className="section-heading">
                            <span>
                                CONTATOS
                            </span>

                            <h4>
                                Fale comigo
                            </h4>
                        </div>

                        <div className="contact-list">

                            <div className="contact-item">

                                <div className="contact-icon">
                                    <EmailIcon />
                                </div>

                                <div className="contact-item-info">
                                    <span>
                                        E-mail
                                    </span>

                                    <p>
                                        {infos.email}
                                    </p>
                                </div>

                            </div>

                            <div className="contact-item">

                                <div className="contact-icon">
                                    <PhoneIcon />
                                </div>

                                <div className="contact-item-info">
                                    <span>
                                        Telefone
                                    </span>

                                    {whatsappNumber ? (
                                        <a
                                            href={`https://wa.me/55${whatsappNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {infos.phone}
                                        </a>
                                    ) : (
                                        <p>
                                            {infos.phone}
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div className="contact-item">

                                <div className="contact-icon">
                                    <PinIcon />
                                </div>

                                <div className="contact-item-info">
                                    <span>
                                        Localização
                                    </span>

                                    <p>
                                        {infos.location}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        REDES / ÍCONES
                    ================================================= */}

                    <div className="contact-social">

                        <div className="section-heading">
                            <span>
                                CONECTE-SE
                            </span>

                            <h4>
                                Encontre-me também
                            </h4>
                        </div>

                        <div className="social-grid">

                            {contacts.map(
                                ({ id, icon, url }) => {

                                    const Component =
                                        contactIcons[icon];

                                    if (!Component) {
                                        return null;
                                    }

                                    return (
                                        <a
                                            key={id}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-item"
                                        >
                                            <Component />
                                        </a>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    RODAPÉ
                ===================================================== */}

                <div className="contact-bottom">
                    <span>
                        Estou à disposição para conversar sobre
                        seu projeto.
                    </span>
                </div>

            </div>

        </section>
    );
}