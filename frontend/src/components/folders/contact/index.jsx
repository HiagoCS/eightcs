import "./style.scss"
import EmailIcon from "@/assets/icons/email-1-svgrepo-com.svg?react"
import PhoneIcon from "@/assets/icons/phone-call-svgrepo-com.svg?react"
import PinIcon from "@/assets/icons/location-pin-svgrepo-com.svg?react"

import { useInfos } from "@/data/hooks/useInfos";
export default function ContactPage() {
    const { data: infos, isLoading, error } = useInfos();
    if (isLoading) return console.log("Loading...")
    if (error) return console.log(error.message)
    if (!infos) return console.log("Nenhuma informação de cliente encontrada!")
    const title = infos['company'] && infos['company'] != '' ? infos['company'].split(' ') : infos['name'].split(' ')
    return (
        <div className="app contact">
            <div className="contacts">
                <div className="info">
                    <div className="title">
                        <h2>{title[0]}</h2>
                        <h3>{title[1]}</h3>
                    </div>
                    <div className="text">
                        <p>{infos['footer']}</p>
                    </div>
                </div>
                <div className="addr">
                    <div className="title">
                        <p>Contatos</p>
                    </div>
                    <div className="info">
                        <div className="text">
                            <EmailIcon className="icon" />
                            <p>{infos['email']}</p>
                        </div>
                        <div className="text">
                            <PhoneIcon className="icon" />
                            <a href={`https://wa.me/55${infos['phone'].replace(/\D/g, '').length === 11 ? infos['phone'].replace(/\D/g, '') : infos['whatsapp'].replace(/\D/g, '')}`}
                                target="_blank">
                                {infos['phone']}
                            </a>
                        </div>
                        <div className="text">
                            <PinIcon className="icon" />
                            <p>{infos['location']}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}