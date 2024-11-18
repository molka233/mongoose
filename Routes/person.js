const express=require('express')
const router=express.Router()
const Person= require("../model/Person")

router.get('/test',(req,res)=>{
    res.send('hello')
})
//Créer et sauvegarder un enregistrement d'un modèle
router.post('/add',async(req,res)=>{
   try{
       const{name,age,favoritefoods}=req.body;
       const newPerson=await Person.create({name,age,favoritefoods});
       res.status(200).send({msg:'person added', newPerson})
   }catch(error){
       res.status(400).send({msg:'can not added person'})
   }
})

//Ajouter plusieurs personnes
router.post('/bulk', async (req, res) => {
 const arrayOfPeople = req.body; // Le tableau des personnes doit être envoyé dans le corps de la requête
 try {
   const createdPeople = await Person.create(arrayOfPeople); // Utilisation de Model.create()
   res.status(201).json(createdPeople);
 } catch (err) {
   res.status(400).json({ error: err.message });
 }
});
//Récupérer toutes les personnes
router.get('/all',async(req,res)=> {
   try {
      const listPersons=await Person.find();
      res.status(200).send({msg:'personlist',listPersons})
   
   } catch(error){
   res.status(400).send({msg:'can not get persons'})
   }
   
   })

//Rechercher toutes les personnes ayant un nom donné
router.get('/search', async (req, res) => {
   const { name } = req.query; // Récupérer le nom à partir des paramètres de requête
   try {
     const people = await Person.find({ name }); // Recherche par nom
     if (people.length === 0) {
       return res.status(404).json({ message: 'Aucune personne trouvée avec ce nom.' });
     }
     res.status(200).json(people);
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 });

//Trouver une seule personne qui aime un aliment donné
router.get('/favorite-food', async (req, res) => {
   const { food } = req.query;
   try {
     const person = await Person.findOne({ favoritefoods: food });
     if (!person) {
       return res.status(404).json({ message: 'Aucune personne trouvée avec cet aliment favori.' });
     }
     res.status(200).json(person);
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 });
 
 

// Récupérer une personne par son ID   
   router.get('/:id', async (req, res) => {
      try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ error: 'Personne non trouvée' });
        res.status(200).json(person);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

//Ajouter "hamburger" à la liste des aliments préférés d'une personne par son _id

router.put('/:id/add-favorite-food', async (req, res) => {
   const { id } = req.params; // Récupérer l'id depuis les paramètres de l'URL
   try {
     const person = await Person.findById(id);
     if (!person) {
       return res.status(404).json({ message: 'Aucune personne trouvée avec cet ID.' });
     }
   
     person.favoritefoods.push('hamburger');
     
     await person.save();
 
     res.status(200).json({ message: 'Aliment ajouté avec succès !', person });
   } catch (err) {
     res.status(500).json({ error: 'ID invalide ou erreur serveur.' });
   }
 });
 

//Met à jour l'âge d'une personne à 20 ans en fonction de son nom
 
router.put('/update-age/:name', async (req, res) => {
   const { name } = req.params; // Récupérer le nom depuis les paramètres de l'URL
 
   try {
     const updatedPerson = await Person.findOneAndUpdate(
       { name }, 
       { age: 20 }, 
       { new: true }
     );
     if (!updatedPerson) {
       return res.status(404).json({ message: "Aucune personne trouvée avec ce nom." });
     }
 
     res.status(200).json({
       message: "Âge mis à jour avec succès.",
       person: updatedPerson,
     });
   } catch (err) {
     res.status(500).json({ error: "Erreur serveur ou requête invalide." });
   }
 });

//Supprime une personne par son _id

router.delete('/:_id',async(req,res)=> {
  try {
     const {_id}=req.params;
     await Person.findOneAndDelete({_id}) 
     res.status(200).send({msg:'person deleted'})
  
  } catch(error){
  res.status(400).send({msg:'can not delete persons'})
  }
  
  }) 
 

 // Supprimer plusieurs documents avec Model.remove()
 router.delete('/delete-many/:_Name', async (req, res) => {
     try {
         const { _name } = req.params;
         const result = await Person.deleteMany({ Name: _name });
         if (result.deletedCount === 0) {
             return res.status(404).send({msg: 'No persons found with the specified name',name: _name});
         }
         res.status(200).send({msg: 'Persons deleted successfully', deletedCount: result.deletedCount,name: _name});
     } catch (error) {
         console.error(error);
         res.status(400).send({msg: 'An error occurred',error: error.message
         });
     }
 });


 router.get('/food/:_favoritefoods', async (req, res) => {
     try {
         const favoriteFood = req.params._favoritefoods; 
         const people = await Person.find({ favoritefoods: favoriteFood }) 
             .sort({ name: 1 }) 
             .limit(2) 
             .select('-age');
        
         if (!people || people.length === 0) {
             return res.status(404).send({
                 msg: `No persons found who like ${favoriteFood}`
             });
         }
         res.status(200).send({
             msg: `Persons found who like ${favoriteFood}`,
             data: people
         });
     } catch (error) {
         console.error(error);
         res.status(400).send({
             msg: 'An unexpected error occurred',
             error: error.message
         });
     }
 });

 

      
             

     module.exports=router;