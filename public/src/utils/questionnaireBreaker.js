'use strict';

const testimonialService = require('./testimonialService');

async function questionnaireBreaker(request, h) {

  const { credentials: { user } } = request.auth;

  const { data: { count } } = await testimonialService.get('questionnaires', {
    params: { userId: user.id }
  });

  if (!count) {
    return h.badRequest('Questionnaire not passed');
  }

  return true;
}

module.exports = {
  method: questionnaireBreaker,
  failAction: 'error'
};
