const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers.',
    location: {
      lat: 40,
      lng: -73
    },
    address: 'NY',
    creator: 'u1'
  }
];

const uuid = require('uuid/v4');

const HttpError = require('../models/http-error.model');

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  
  const place = DUMMY_PLACES.find(place => {
    return place.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place with provided place id!', 404);
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find(place => {
    return place.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError('Could not find a place with provided place id!', 404)
    );
  }
  
  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createPlace);

  res.status(201).json(createPlace);
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;