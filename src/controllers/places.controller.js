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

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch(err) {
    const error = new HttpError('Something went wrong could not find places with this uid.', 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a places with provided place id!', 404)
    );
  }
  
  res.json({ places: places.map(place => place.toObject({ getters: true })) });
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

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs parameters.', 422);
  }
  
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find place.', 500);
    return next(error);
  }

  place.title = title;
  place .description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place.', 500);
    return next(error);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete place', 500);
    return next(error);
  }

  try {
    await place.remove();
  } catch {
    const error = new HttpError('Something went wrong, could not delete place', 500);
    return next(error); 
  }

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;