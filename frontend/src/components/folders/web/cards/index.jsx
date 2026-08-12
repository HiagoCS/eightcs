import "./style.scss"
import { useState } from "react";
const imageFiles = import.meta.glob("@/assets/img/web-carousel/*/*.{png,jpg,jpeg,webp}", { eager: true, query: "?url", import: 'default' })

export default function Card({ project }) {
    const getImages = (projectId) => {
        const folder = `/web-carousel/${projectId}/`;

        return Object.entries(imageFiles)
            .filter(([path]) => path.includes(folder))
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, image]) => image);
    };
    const [currentImage, setCurrentImage] = useState(0);
    const images = getImages(project.id);
    return (
        <div className="card" id="project">
            <div className="image">
                <div className="indicators">
                    {images.map((_, index) => (
                        <button key={index}
                            className={index === currentImage ? 'active' : ''}
                            onClick={() => setCurrentImage(index)} />
                    ))}
                </div>
                <img src={images[currentImage]} loading="lazy" decoding="async"/>
            </div>
            <div className="info">
                <span className="title">
                    {project.title}
                </span>
                <span className="text">
                    {project.description}
                </span>
            </div>
        </div>
    );
}