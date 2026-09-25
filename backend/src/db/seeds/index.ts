const {infosSeed} = require("./infosSeed")
const {typesSeed} = require("./projects/types")
const {projectsSeed} = require("./projects/projects")
const {modalSeed} = require("./projects/modal")
const {pagesSeed} = require("./navbarLinks/pages")
const {homeCardsSeed} = require("./navbarLinks/homeCards")

function index(){
    infosSeed();
    typesSeed();
    projectsSeed();
    modalSeed();
    pagesSeed();
    homeCardsSeed();
    console.log("Seed executado com sucesso");
}
index();