'use strict';

var should = require('chai').should(),
    normalizeJSONAPI = require('../src'),
    normalize = normalizeJSONAPI.normalize;

describe('normalizr', function () {
  it('fails normalizing something other than array or object', function () {
    (function () {
      normalize(42, {});
    }).should.throw();

    (function () {
      normalize(null, {});
    }).should.throw();

    (function () {
      normalize(undefined, {});
    }).should.throw();

    (function () {
      normalize('42', {});
    }).should.throw();
  });

  it('can normalize single entity', function () {
    var response = {
      data: {
        id: 1,
        type: "articles",
        attributes: {
          title: "Shoes",
          'is-favorite': false,
        }
      }
    };

    Object.freeze(response);

    normalize(response).should.eql({
      results: {
        articles: [1],
      },
      entities: {
        articles: {
          1: {
            id: 1,
            title: 'Shoes',
            isFavorite: false,
            type: 'articles',
          }
        },
      }
    });
  });

  it('can normalize single entity with included entities', function () {
    var response = {
      data: {
        id: 1,
        type: "articles",
        attributes: {
          title: "Shoes",
          'is-favorite': false,
        },
        relationships: {
          author: {
            data: {
              type: "users",
              id: 9,
            }
          }
        }
      },
      included: [
        {
          type: "users",
          id: 9,
          attributes: {
            "first-name": "Marie",
            "last-name": "Brizard",
            "twitter": "mb"
          },
        }
      ]
    };

    Object.freeze(response);

    normalize(response).should.eql({
      results: {
        articles: [1],
        users: [9],
      },
      entities: {
        articles: {
          1: {
            id: 1,
            type: 'articles',
            title: 'Shoes',
            isFavorite: false,
            author: 9,
          }
        },
        users: {
          9: {
            id: 9,
            type: 'users',
            firstName: 'Marie',
            lastName: 'Brizard',
            twitter: 'mb',
          }
        }
      }
    });
  });
});
