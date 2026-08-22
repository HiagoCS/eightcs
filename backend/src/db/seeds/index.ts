const {infosSeed} = require("./infosSeed")
const {typesSeed} = require("./projects/types")
const {projectsSeed} = require("./projects/projects")
const {modalSeed} = require("./projects/modal")
const {pagesSeed} = require("./navbarLinks/pages")
const {iconsSeed} = require("./navbarLinks/icons")

function index(){
    infosSeed();
    typesSeed();
    projectsSeed();
    modalSeed();
    pagesSeed();
    iconsSeed();
    console.log("Seed executado com sucesso");
}
index();