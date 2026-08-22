const {infosSeed} = require("./infosSeed")
const {typesSeed} = require("./projects/types")
const {projectsSeed} = require("./projects/projects")
const {modalSeed} = require("./projects/modal")

function index(){
    infosSeed();
    typesSeed();
    projectsSeed();
    modalSeed();
    console.log("Seed executado com sucesso");
}
index();