import { data } from '@/data/links';
const pagesComponents = import.meta.glob("@/components/folders/*/index.jsx", { eager: true, import: 'default' });
const links = {}
const getFunctions = () => {
    return Object.entries(pagesComponents)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, jsx]) => jsx);
};
const functions = getFunctions();
data.map((link, index) => {
    if(link.type_id){
        links[data[index]?.name] = functions[functions.findIndex(func => func.name === 'projectPage')];
    }
    else if(!link.type_id && functions[functions.findIndex(func => func.name.toLowerCase() === data[index]?.name.toLowerCase())]){
        links[data[index]?.name] = functions[functions.findIndex(func => func.name.toLowerCase() === data[index]?.name.toLowerCase())];
    }
    
})
export { links };