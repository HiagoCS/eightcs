import "./style.scss";
import CloseIcon from '@/assets/icons/close-svgrepo-com.svg?react';
import ArrowRight from '@/assets/icons/arrow-right-svgrepo-com.svg?react';
import ArrowLeft from '@/assets/icons/arrow-left-svgrepo-com.svg?react';
import { useEffect, useState } from "react";

import image1 from "./images/1.png";
import image2 from "./images/2.png";
import image3 from "./images/3.png";
import image4 from "./images/4.png";
import image5 from "./images/5.png";
import image6 from "./images/6.png";
import image7 from "./images/7.png";
import image8 from "./images/8.png";

export default function Modal({ onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const modal = [
        {
            image: image1,
            title: "Vitrine Digital",
            text: (
                <>
                    <strong>eight.cs Development</strong>
                    <p>
                        Uma solução criada para apresentar sua empresa,
                        seus serviços e seus projetos de forma
                        organizada, moderna e profissional.
                    </p>
                    <p>
                        A Vitrine Digital transforma seu trabalho em
                        uma presença digital simples e acessível para
                        seus clientes.
                    </p>
                </>
            )
        },

        {
            image: image2,
            title: "Funcionalidades",
            text: (
                <>
                    <p>
                        A Vitrine Digital possui dois modelos que
                        podem trabalhar juntos:
                    </p>

                    <h3>Site SPA</h3>

                    <p>
                        SPA significa <strong>Single Page Application</strong>.
                        É um site onde o visitante navega pelas
                        diferentes áreas sem precisar carregar uma
                        página completamente nova a cada clique.
                    </p>

                    <p>
                        Isso proporciona uma navegação mais
                        <strong> rápida e fluida</strong>.
                    </p>

                    <h3>Indexação dos projetos</h3>

                    <p>
                        Seus serviços e projetos podem ser organizados
                        individualmente para facilitar sua visualização
                        e navegação.
                    </p>
                </>
            )
        },

        {
            image: image3,
            title: "Componentes do Site",
            text: (
                <>
                    <p>
                        A Vitrine Digital é organizada em quatro
                        componentes principais:
                    </p>

                    <h3>Banner</h3>
                    <p>
                        Identificação da sua empresa.
                    </p>

                    <h3>Home</h3>
                    <p>
                        Primeira apresentação dos seus serviços.
                    </p>

                    <h3>Projetos</h3>
                    <p>
                        Organização e exibição dos seus trabalhos.
                    </p>

                    <h3>Contatos</h3>
                    <p>
                        Informações para o cliente entrar em contato.
                    </p>
                </>
            )
        },

        {
            image: image4,
            title: "Banner",
            text: (
                <>
                    <h3>A identidade da sua empresa</h3>

                    <p>
                        O banner fica localizado no topo do site e
                        apresenta o <strong>nome da sua empresa</strong>.
                    </p>

                    <p>
                        Ele funciona como uma identificação imediata,
                        permitindo que o visitante reconheça rapidamente
                        quem está oferecendo aquele serviço.
                    </p>
                </>
            )
        },

        {
            image: image5,
            title: "Home",
            text: (
                <>
                    <h3>A primeira impressão</h3>

                    <p>
                        A Home é a área principal da Vitrine Digital.
                    </p>

                    <p>
                        Ela possui um banner central acompanhado de
                        uma breve descrição da sua prestação de serviço.
                    </p>

                    <p>
                        Assim, logo nos primeiros segundos, o visitante
                        consegue entender <strong>quem é você</strong>
                        e <strong>o que sua empresa oferece</strong>.
                    </p>

                    <p>
                        A Home também pode apresentar uma visão geral
                        dos seus projetos.
                    </p>
                </>
            )
        },

        {
            image: image6,
            title: "Projetos",
            text: (
                <>
                    <h3>Seus serviços organizados</h3>

                    <p>
                        Os projetos ficam organizados em um
                        <strong> menu dinâmico</strong>, permitindo
                        separar seus serviços em diferentes tópicos.
                    </p>

                    <p>
                        Ao mesmo tempo, esses projetos podem aparecer
                        de forma generalizada na Home.
                    </p>

                    <p>
                        Dessa maneira, o visitante possui uma
                        <strong> visão geral</strong> dos seus serviços
                        e também pode acessar exatamente o tópico
                        que procura.
                    </p>
                </>
            )
        },

        {
            image: image7,
            title: "Contatos",
            text: (
                <>
                    <h3>Facilite o próximo passo</h3>

                    <p>
                        A área de contatos foi pensada para ser
                        simples e direta.
                    </p>

                    <p>
                        Todas as principais informações da sua empresa
                        ficam reunidas em um único lugar:
                    </p>

                    <ul>
                        <li>Telefone</li>
                        <li>E-mail</li>
                        <li>Redes sociais</li>
                        <li>Endereço</li>
                    </ul>

                    <p>
                        Assim, o cliente sabe facilmente
                        <strong> como falar com você</strong> e
                        <strong> onde encontrar sua empresa</strong>.
                    </p>
                </>
            )
        },

        {
            image: image8,
            title: "Sua empresa na internet",
            text: (
                <>
                    <p>
                        A Vitrine Digital reúne em um único espaço:
                    </p>

                    <h3>Apresentação</h3>
                    <h3>Serviços</h3>
                    <h3>Projetos</h3>
                    <h3>Contatos</h3>

                    <p>
                        Tudo desenvolvido para que seu cliente
                        encontre rapidamente o que precisa e
                        conheça melhor o seu trabalho.
                    </p>

                    <h2>eight.cs Development</h2>

                    <p>
                        <strong>
                            Tecnologia para apresentar o seu trabalho.
                        </strong>
                    </p>
                </>
            )
        }
    ];

    const next = () => {
        setCurrentIndex((current) =>
            current === modal.length - 1 ? 0 : current + 1
        );
    };

    const previous = () => {
        setCurrentIndex((current) =>
            current === 0 ? modal.length - 1 : current - 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }

            if (event.key === "ArrowRight") {
                next();
            }

            if (event.key === "ArrowLeft") {
                previous();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const currentModal = modal[currentIndex];

    return (
        <div className="modal">

            <div className="close" onClick={onClose}>
                <CloseIcon
                    style={{
                        width: "2.5vw",
                        height: "2.5vh"
                    }}
                />
            </div>

            <div className="previous" onClick={previous}>
                <ArrowLeft
                    style={{
                        width: "2.5vw",
                        height: "2.5vh"
                    }}
                />
            </div>

            <div className="modal-content">

                <div className="image">
                    <img
                        src={currentModal.image}
                        alt={currentModal.title}
                    />
                </div>

                <div className="info-home">
                    <h1>{currentModal.title}</h1>

                    {currentModal.text}
                </div>

            </div>

            <div className="next" onClick={next}>
                <ArrowRight
                    style={{
                        width: "2.5vw",
                        height: "2.5vh"
                    }}
                />
            </div>

            <div className="indicators">
                {modal.map((_, index) => (
                    <span
                        key={index}
                        className={
                            index === currentIndex
                                ? "active"
                                : ""
                        }
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>

        </div>
    );
}