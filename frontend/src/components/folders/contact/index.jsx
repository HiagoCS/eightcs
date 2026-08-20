import "./style.scss"
import ReactIcon from "@/assets/icons/frameworks/react-svgrepo-com.svg?react"
import NextIcon from "@/assets/icons/frameworks/next-js-svgrepo-com.svg?react"
import TSIcon from "@/assets/icons/frameworks/typescript-logo-svgrepo-com.svg?react"
import NodeIcon from "@/assets/icons/frameworks/nodejs-icon-svgrepo-com.svg?react"
import FlutterIcon from "@/assets/icons/frameworks/flutter-svgrepo-com.svg?react"
import VueIcon from "@/assets/icons/frameworks/vue-svgrepo-com.svg?react"
import PhpIcon from "@/assets/icons/frameworks/php-svgrepo-com.svg?react"

import EmailIcon from "@/assets/icons/email-1-svgrepo-com.svg?react"
import PhoneIcon from "@/assets/icons/phone-call-svgrepo-com.svg?react"
import PinIcon from "@/assets/icons/location-pin-svgrepo-com.svg?react"
function main(){
    return(
        <div className="app" id="contact-section">
            <div className="contacts">
                <div className="info">
                    <div className="title">
                        <h2>eight.cs</h2>
                        <h3>development</h3>
                    </div>
                    <div className="text">
                        <p>Transformando ideias em soluções digitais, criativas, eficientes e de impacto</p>
                    </div>
                </div>
                <div className="frameworks">
                    <div className="title">
                        <p>Tecnologias</p>
                    </div>
                    <div className="icons">
                        <ReactIcon className="icon"/>
                        <NextIcon className="icon"/>
                        <TSIcon className="icon"/>
                        <NodeIcon className="icon"/>
                        <FlutterIcon className="icon"/>
                        <VueIcon className="icon"/>
                        <PhpIcon className="icon"/>
                    </div>
                </div>
                <div className="addr">
                    <div className="title">
                        <p>Contatos</p>
                    </div>
                    <div className="info">
                        <div className="text">
                            <EmailIcon className="icon"/>
                            <p>contato@gmail.com</p>
                        </div>
                        <div className="text">
                            <PhoneIcon className="icon"/>
                            <p>(11)9 5826-7059</p>
                        </div>
                        <div className="text">
                            <PinIcon className="icon"/>
                            <p>São Paulo, SP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default main