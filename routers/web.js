const express = require("express");
const imageHandler = require("../handlers/v1/images");
const common = require("../middlewares/common");
const web = require("../handlers/v1/web");
const placeHandler = require("../handlers/v1/places");
const router = express.Router();

router.use((req,res, next) => {
    res.locals.pageTitle = "Kuliner aman dengan menu digital emam";
    next();
});

router.get("/", common.routePath, common.commingsoon, web.homePage);

router.get("/explore", web.allPlace);

router.get("/claim/:slug", web.claimBusiness);

router.get('/search-places', placeHandler.searchPlacesAndMenus)

router.get("/explore/category/:category", web.getPlaceCategory);

router.get("/explore/category", web.categoryPage);

router.post("/fetch_food.php", (req, res) => {
    res.send(`
    <div class="show-search" align="left">
        <a href="detailtempat.php?id=Didago-Cafe-Dago-Bandung">
            <img src="https://emam.id/images/database/tempatmakan/emam-didago-cover.png" style="width:50px; height:50px; float:left; margin-right:6px;" />
            <div class="text-info-tempat" style=""><span class="name">Di<strong>dago</strong> Cafe</span>&nbsp;<br />Jl. Ir. H. Juanda No.21, Kota Bandung (setelah DEKRANASDA Jawa Barat)<br /></div>
        </a>
    </div>

    `);
});

router.get("/about", common.routePath, (req, res) => {
    res.render("about");
});

router.get("/blog", common.commingsoon, (req, res) => {
    res.redirect("/under-construction");
});

router.get("/business", common.commingsoon, (req, res) => {
    res.redirect("/under-construction");
});

router.get("/contact-us", common.commingsoon, (req, res) => {
    res.render('about');
});

router.get("/under-construction", common.commingsoon, (req, res) => {
    res.render("underconstruction");
});

router.get("/coming-soon", (req, res) => {
    res.render("coming-soon");
});

router.get("/p/:slug", common.commingsoon, web.placeDetailPage);

router.get("/images/:key", imageHandler.getImage);

module.exports = router;
