'use strict';

const socialService = require('./socialService');
const mediaService = require('./mediaService');

async function processAssetId(assetId) {

  const { data: asset } = await mediaService.get(`assets/${assetId}`);
  return asset;
}

async function processVideoStreamId(streamId) {

  const { data: stream } = await mediaService.get(`streams/${streamId}`);
  return stream;
}

const loaders = {
  async movie(movie, extended) {

    const { data: { items: genres } } = await socialService.get(`movies/${movie.id}/genres`);

    const poster = await processAssetId(movie.posterId);
    const videoStream = await processVideoStreamId(movie.videoStreamId);

    movie.genres = genres;

    movie.poster = poster;
    delete movie.posterId;

    movie.videoStream = videoStream;
    delete movie.videoStreamId;

    if (extended) {
      movie.trailers = await Promise
        .all(movie.trailerIdList.map((id) => processAssetId(id)));
      movie.screenshots = await Promise
        .all(movie.screenshotIdList.map((id) => processAssetId(id)));

      const { data: people } = await socialService.get(`movies/${movie.id}/people`);

      movie.cast = {
        items: await Promise.all(people.cast.items.map((item) => loaders.person(item))),
        count: people.cast.count
      };

      if (people.director) {
        movie.director = await loaders.person(people.director);
      }

      if (people.producer) {
        movie.producer = await loaders.person(people.producer);
      }
    }

    delete movie.trailerIdList;
    delete movie.screenshotIdList;

    return movie;
  },
  async group(group) {

    if (group.avatarId) {
      group.avatar = await processAssetId(group.avatarId);
      delete group.avatarId;
    }

    return group;
  },
  async profile(profile) {

    if (profile.avatarId) {
      profile.avatar = await processAssetId(profile.avatarId);
      delete profile.avatarId;
    }
    else{
      profile.avatar = {}
    }
    if (profile.photo) {
      profile.photoDetails = await processAssetId(profile.photo);
    }
    else{
      profile.photoDetails = {}
    }
    if (profile.video) {
      profile.videoDetails = await processAssetId(profile.video);
    }
    else{
      profile.videoDetails = {}
    }

    return profile;
  },
  async person(person, extended) {

    if (person.avatarId) {
      person.avatar = await processAssetId(person.avatarId);
      delete person.avatarId;
    }

    if (extended) {
      const { data: movies } = await socialService.get(`people/${person.id}/movies`);

      person.movies = {
        items: await Promise.all(movies.items.map(async(item) => ({
          movie: await loaders.movie(item.movie),
          rel: item.rel
        }))),
        count: movies.count
      };

      const { data: { items: trailerIdList } } = await socialService.get(`people/${person.id}/trailers`);

      person.trailers = await Promise.all(trailerIdList.map((id) => processAssetId(id)));
    }

    return person;
  },
  async feedback(feedback) {

    if (feedback.videoId) {
      feedback.video = await processAssetId(feedback.videoId);
      delete feedback.videoId;
    }

    return feedback;
  },
  async genre(genre) {

    if (genre.imageId) {
      genre.image = await processAssetId(genre.imageId);
      delete genre.imageId;
    }
    else{
      genre.image = {}
    }

    return genre;
  },
  async review(review) {

    if (review.videoId) {
      review.video = await processAssetId(review.videoId);
      delete review.videoId;
    }

    return review;
  }
};

module.exports = function compositionLoader(type, entity, extended) {

  const loader = loaders[type];

  if (!loader) {
    throw new Error('A composition loader of this type is not registered');
  }

  if (Array.isArray(entity)) {
    return Promise.all(entity.map((item) => loader(item, extended)));
  }

  return loader(entity, extended);
};
