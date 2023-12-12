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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;