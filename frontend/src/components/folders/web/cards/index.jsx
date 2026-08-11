import "./style.scss"
const imageFiles = import.meta.glob("@/assets/img/web-carousel/*/*.{png,jpg,jpeg,webp}", {eager:true, query:"?url", import:'default'})
const getImages = (projectId) => {
    const folder = `/web-carousel/${projectId}/`;

    return Object.entries(imageFiles)
        .filter(([path]) => path.includes(folder))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, image]) => image);
};
//one src
//getImages('2')[0]
function card({project}){
    return(
        <div className="card" id="project">
            <div className="image">
                <img src={getImages('2')[0]} alt="" />
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
export default card;