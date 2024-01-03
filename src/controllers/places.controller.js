const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error.model');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place.model');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  
  let place;
  try {
    place = await Place.findById(placeId);
  } catch(err) {
    const error = new HttpError('Something went wrong could not find a place.', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place with provided place id!', 404);
    return next(error);
  }

  res.json({ place: place.toObject( {getters: true} )});
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter(place => {
    return place.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a places with provided place id!', 404)
    );
  }
  
  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError('Invalid inputs parameters.', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'sss',
    creator
  });

  try {
    await createdPlace.save();
  } catch(err) {
    const error = new HttpError('Creating place fail, please try again', 500);
    return next(error);
  }

  res.status(201).json(createPlace);
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs parameters.', 422);
  }
  
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find(place => place.id === placeId)) {
     throw new HttpError('Could not find a place for that id', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId);
  res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;