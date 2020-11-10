const Sauce = require('../models/sauces');
const fs = require('fs');
const bodyParser = require('body-parser'); 

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({error: error}));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
      ...sauceObject,  
      imageUrl: url + '/images/' + req.file.filename,
    });
    sauce.save()
      .then(() => res.status(201).json({message: 'Post saved successfully!'}))
      .catch((error) => res.status(400).json({error: error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({error: error}));
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    const sauceObject = JSON.parse(req.body.sauce);
    sauce = {    
        ...sauceObject,  
        imageUrl: url + '/images/' + req.file.filename
    };
  } else {
    sauce = {
         ...req.body
    };
  }
  Sauce.updateOne({_id: req.params.id}, sauce)
    .then(() => res.status(201).json({message: 'Sauce updated successfully!'}))
    .catch((error) => res.status(400).json({error: error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then((sauces) => {
          const filename = sauces.imageUrl.split('/images/')[1];
          //delete image from database
          fs.unlink('images/' + filename, () => {
              Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Deleted!'}))
                .catch((error) => res.status(400).json({error: error}));
          });
      }
    );
};

exports.likeSauce = (req, res, next) => {
  //Get the UserID and Like
  const idUser = req.body.userId;
  const likeState = req.body.like;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (likeState == 1) {
          console.log('The user liked this sauce!');

          Sauce.updateOne({_id: req.params.id}, {$inc: { likes: +1 }, $push: { usersLiked: idUser }})
            .then(() => res.status(201).json( { message: 'Liked!' } ))
            .catch((error) => res.status(400).json({error: error}));

      } else if (likeState == -1) {
          console.log('The user disliked this sauce!');

          Sauce.updateOne({_id: req.params.id}, {$inc: { dislikes: +1 }, $push: { usersDisliked: idUser }})
            .then(() => res.status(201).json( { message: 'Disliked!' } ))
            .catch((error) => res.status(400).json({error: error}));

      } else if (likeState == 0) {
          if (sauce.usersDisliked.includes(idUser)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: idUser }})
              .then(() => res.status(200).json({ message: 'Dislike removed!' }))
              .catch(error => res.status(400).json({ error: error }));
          } else {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: idUser }})
              .then(() => res.status(200).json({ message: 'Like removed!' }))
              .catch(error => res.status(400).json({ error: error }));
          }
      };
    })
    .catch((error) => res.status(400).json({error: error}));
}