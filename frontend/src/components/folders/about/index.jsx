import './style.scss';

const images = Object.entries(
    import.meta.glob('./about/*.{png,jpg,jpeg,webp}', {
        eager: true,
        query: '?url',
        import: 'default'
    })
)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, image]) => image);

const services = [
    {
        title: 'Sacadas e Envidraçamento',
        text: 'Soluções em envidraçamento e fechamento de sacadas para proporcionar mais proteção, conforto e aproveitamento dos ambientes.'
    },
    {
        title: 'Pintura',
        text: 'Serviços de pintura residencial e comercial, com atenção à preparação das superfícies e à qualidade do acabamento.'
    },
    {
        title: 'Reformas em Geral',
        text: 'Serviços de reforma e revitalização para transformar ambientes, melhorar sua funcionalidade e renovar seus acabamentos.'
    }
];

const values = [
    {
        title: 'Qualidade',
        text: 'Buscamos entregar serviços com atenção aos detalhes e acabamento de qualidade em cada projeto.'
    },
    {
        title: 'Comprometimento',
        text: 'Cada trabalho é realizado com responsabilidade e dedicação às necessidades de cada cliente.'
    },
    {
        title: 'Excelência',
        text: 'Nosso objetivo é oferecer resultados que unam funcionalidade, estética e satisfação.'
    }
];

export default function CompanyPage() {
    return (
        <section className="app about-page">

            {/* HERO */}
            <section className="about-hero">
                {images[0] && (
                    <img
                        src={images[0]}
                        alt="Empreiteira Glass"
                        className="about-hero-image"
                    />
                )}

                <div className="about-hero-overlay"></div>

                <div className="about-hero-content">
                    <span className="about-label">
                        EMPREITEIRA GLASS
                    </span>

                    <h1>
                        Construindo, renovando
                        <br />
                        e transformando espaços.
                    </h1>

                    <p>
                        Soluções em construção civil, sacadas e envidraçamento,
                        pintura e reformas em geral.
                    </p>
                </div>
            </section>

            {/* APRESENTAÇÃO */}
            <section className="about-section about-introduction">
                <div className="about-container about-introduction-grid">

                    <div className="about-text">
                        <span className="about-label">
                            SOBRE A EMPRESA
                        </span>

                        <h2>
                            Qualidade e comprometimento
                            em cada projeto
                        </h2>

                        <p>
                            A Empreiteira Glass atua no segmento da construção
                            civil, oferecendo soluções com qualidade, cuidado
                            e comprometimento em cada projeto.
                        </p>

                        <p>
                            Realizamos serviços de Sacadas e Envidraçamento,
                            Pintura e Reformas em Geral, atendendo às necessidades
                            de residências, comércios e outros espaços que buscam
                            mais conforto, segurança, funcionalidade e valorização
                            do ambiente.
                        </p>
                    </div>

                    {images[1] && (
                        <div className="about-image about-introduction-image">
                            <img
                                src={images[1]}
                                alt="Serviço realizado pela Empreiteira Glass"
                            />
                        </div>
                    )}

                </div>
            </section>

            {/* SERVIÇOS */}
            <section className="about-section about-services">
                <div className="about-container">

                    <div className="about-heading">
                        <span className="about-label">
                            NOSSOS SERVIÇOS
                        </span>

                        <h2>
                            Soluções para diferentes necessidades
                        </h2>

                        <p>
                            Atuamos em diferentes áreas da construção civil,
                            buscando entregar soluções adequadas para cada
                            ambiente e projeto.
                        </p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <article
                                className="service-card"
                                key={service.title}
                            >
                                <span className="service-number">
                                    0{index + 1}
                                </span>

                                <h3>
                                    {service.title}
                                </h3>

                                <p>
                                    {service.text}
                                </p>
                            </article>
                        ))}
                    </div>

                </div>
            </section>

            {/* DESTAQUE VISUAL */}
            {images[2] && (
                <section className="about-feature-image">
                    <img
                        src={images[2]}
                        alt="Empreiteira Glass"
                    />

                    <div className="about-feature-overlay">
                        <div>
                            <span className="about-label">
                                EMPREITEIRA GLASS
                            </span>

                            <h2>
                                Do projeto ao acabamento.
                            </h2>
                        </div>
                    </div>
                </section>
            )}

            {/* DIFERENCIAIS */}
            <section className="about-section about-values">
                <div className="about-container">

                    <div className="about-heading">
                        <span className="about-label">
                            NOSSO COMPROMISSO
                        </span>

                        <h2>
                            Trabalhamos para entregar
                            bons resultados
                        </h2>
                    </div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <article
                                className="value-card"
                                key={value.title}
                            >
                                <span className="value-number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <h3>
                                    {value.title}
                                </h3>

                                <p>
                                    {value.text}
                                </p>
                            </article>
                        ))}
                    </div>

                </div>
            </section>

            {/* GALERIA */}
            {images.length > 3 && (
                <section className="about-section about-gallery">
                    <div className="about-container">

                        <div className="about-heading">
                            <span className="about-label">
                                NOSSO TRABALHO
                            </span>

                            <h2>
                                Alguns dos nossos projetos
                            </h2>
                        </div>

                        <div className="gallery-grid">
                            {images.slice(3).map((image, index) => (
                                <div
                                    className="gallery-item"
                                    key={image}
                                >
                                    <img
                                        src={image}
                                        alt={`Projeto da Empreiteira Glass ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            )}

            {/* ENCERRAMENTO */}
            <section className="about-section about-footer">

                <div className="about-container about-footer-content">

                    <div>
                        <span className="about-label">
                            EMPREITEIRA GLASS
                        </span>

                        <h2>
                            Seu projeto,
                            nosso compromisso.
                        </h2>
                    </div>

                    <p>
                        Nosso trabalho é baseado na atenção aos detalhes,
                        na qualidade dos serviços e no compromisso com cada
                        cliente, buscando entregar resultados que unam bom
                        acabamento, eficiência e satisfação em todas as etapas
                        do projeto.
                    </p>

                </div>

            </section>

        </section>
    );
}