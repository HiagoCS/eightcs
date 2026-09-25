const {integer, text, sqliteTable} = require("drizzle-orm/sqlite-core");
//PERSONAL INFOS
const personalInfos = sqliteTable("infos",{
    id: integer("id").primaryKey(),
    name:text("name").unique(),
    occupation:text("occupation").unique(),
    company:text("company").unique(),
    email:text("email").unique(),
    phone:text("phone").unique(),
    location:text("location").unique(),
    description:text("description").unique()
});
//PROJETOS
const projectType = sqliteTable("project_type",{
    id: integer("id").primaryKey(),
    type: text("type").notNull().unique(),
    status: integer("status",{mode:"boolean"}).notNull()
});
const project = sqliteTable("project",{
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    externalUrl: text("external_url"),
    typeId: integer("type_id").notNull().references(() => projectType.id),
    status: integer("status",{mode:"boolean"}).notNull()
});
const projectModal = sqliteTable("modal",{
    id: integer("id").primaryKey(),
    projectId: integer("project_id").notNull().references(() => project.id),
    text: text("text").notNull(),
    extension:text("extension").notNull()
});

//LINKS ON NAVBAR
const navbarLinks = sqliteTable("navbar_links",{
    id: integer("id").primaryKey(),
    label: text("label").notNull(),
    function: text("function").notNull(),
    url: text("url").notNull(),
    typeId: integer("type_id").default(null).references(() => projectType.id),
});

//PAGES CARDS
const homeCards = sqliteTable("home_cards",{
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    text: text("text").notNull(),
    class: text("class").notNull(),
    icon: text("icon").notNull(),
    linkId: integer("link_id").references(() => navbarLinks.id),
    typeId: integer("type_id").default(null).references(() => projectType.id),
});
module.exports = {projectType, project, projectModal, navbarLinks, personalInfos, homeCards}