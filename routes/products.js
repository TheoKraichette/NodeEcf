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
        //Sauvegarde de l'utilisateur
            newProduct.save()
            .then(products =>{

                res.redirect('/products/add');
            })
            .catch(err =>console.log(err));
            }
        })
    }
});


//Page search
router.post('/search', (req, res)=>{

    var {lot, prixMin, prixMax, searchLot, searchPrix, all} = req.body;

    let errors = [];


    if(searchLot){
        //Find article by lot
        Articles.find({numlot:lot})
        .then(article => {
            if(article[0] == null){
                errors.push({ msg: 'Aucun article trouvé'});
                res.render('search', {
                    errors,
                });
            }else{
                var slot = " ";
                res.render('search', {article, slot});
            }
        })
        .catch(err =>console.log(err));
    }

    if(searchPrix){
        if (!prixMin && prixMax){
            prixMin = 0;
        }
        if (!prixMax && prixMin){
            prixMax = 99999;
        }
        //Find article by prix
        Articles.find({prix: { $gt: prixMin, $lt: prixMax}})
        .then(article => {
            if(article[0] == null){
                if (!prixMin && !prixMax){
                    errors.push({ msg: 'Entrer au moins un prix minimum ou maximum'});
                }
                else{
                    errors.push({ msg: 'Aucun article trouvé'});
                }

                res.render('search', {
                    errors,
                });

            }else{
                var sprix = " ";
                res.render('search', {article, sprix});
            }
        })
        .catch(err =>console.log(err));
    }

    if(all){
        //Find all
        Articles.find()
        .then(article => {
                var sprix = " ";
                res.render('search', {article, sprix});

        })
        .catch(err =>console.log(err));
    }
    });

module.exports = router;