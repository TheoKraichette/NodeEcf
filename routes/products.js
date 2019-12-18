const express = require('express');
const router = express.Router();
const Product = require('../models/Product')

router.get('/search', (req, res) => res.render('search'));
router.get('/add', (req, res) => res.render('add'));

// Requête d'enregistrement
router.post('/add', (req, res) => {
    var { name, identifiant, numLot, price, resume, dispo, date} = req.body;
    let errors = [];
        
    //lowercase name
        if(name){
            name = name.toLowerCase();
            //identifiant
            identifiant = name.substr(0, 3);
            identifiant = identifiant.toUpperCase();
            }

        //lot
            if (numLot.length != 5){
                errors.push({msg: "Le numéro de lot doit être composé de 5 chiffres"});
            }
        
            //send errors
        if (errors.length > 0){
            res.render('add', {errors, name, identifiant, numLot, price, resume, dispo});
        }
        else{

        Product.findOne({ numLot: numLot, name: name }).then(products => {
        if (products) {
        errors.push({ msg: 'Ce produit existe déjà' });
        res.render('add', {
            errors,
            name,
            numLot,
            price,
            resume
        });

        } else {
        const newProduct = new Product({
            name,
            identifiant,
            numLot,
            price,
            resume,
            dispo,
            date
        });
        //Sauvegarde du produit
            newProduct.save()
            .then(products =>{
                var nice = "";
                res.render('add', {
                    nice
                });
            })
            .catch(err =>console.log(err));
            }
        })
    }
});


//Page search
router.post('/searchLot', (req, res)=>{

    var {lot, numLot} = req.body;

    let errors = [];
 
        //Find products by lot
        Product.find({numLot:lot})
        .then(products => {
            if(products[0] == null){
                errors.push({ msg: 'Aucun products trouvé'});
                res.render('search', {
                    errors,
                });
            }else{
                var slot = " ";
                res.render('search', {products, slot});
                console.log(products)
            }
        })
        .catch(err =>console.log(err));
    });

        
    //Find products by price

router.post('/searchPrice', (req, res) =>{
    
    var {minPrice, maxPrice} = req.body;

    let errors = [];

    if (!minPrice && maxPrice){
        minPrice = 0;
    }
    if (!maxPrice && minPrice){
        maxPrice = 99999;
    }
    Product.find({price: { $gt: minPrice, $lt: maxPrice}})
    .then(products => {
        if(products[0] == null){
            if (!minPrice && !maxPrice){
                errors.push({ msg: 'Entrer au moins un price minimum ou maximum'});
            }
            else{
                errors.push({ msg: 'Aucun products trouvé'});
            }

            res.render('search', {
                errors,
            });

        }else{
            var sprix = " ";
            res.render('search', {products, sprix});
            console.log(products)
        }
    })
    .catch(err =>console.log(err));

});


module.exports = router;