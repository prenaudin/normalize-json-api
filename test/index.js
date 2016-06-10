const expect = require('chai').expect;
const normalizeJSONAPI = require('../src');
const normalize = normalizeJSONAPI.normalize;

describe('normalizr', () => {
  it('fails normalizing something other than array or object', () => {
    expect(() => {
      normalize(42, {});
    }).to.throw();

    expect(() => {
      normalize(null, {});
    }).to.throw();

    expect(() => {
      normalize(undefined, {});
    }).to.throw();

    expect(() => {
      normalize('42', {});
    }).to.throw();
  });

  it('can normalize single entity', () => {
    const response = {
      data: {
        id: 1,
        type: 'articles',
        attributes: {
          title: 'Shoes',
          'is-favorite': false,
        },
      },
    };

    Object.freeze(response);

    expect(normalize(response)).to.eql({
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
          },
        },
      },
    });
  });

  it('can normalize single entity with included entities', () => {
    const response = {
      data: {
        id: 1,
        type: 'articles',
        attributes: {
          title: 'Shoes',
          'is-favorite': false,
        },
        relationships: {
          author: {
            data: {
              type: 'users',
              id: 9,
            },
          },
        },
      },
      included: [
        {
          type: 'users',
          id: 9,
          attributes: {
            'first-name': 'Marie',
            'last-name': 'Brizard',
            twitter: 'mb',
          },
        },
      ],
    };

    Object.freeze(response);

    expect(normalize(response)).to.eql({
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
          },
        },
        users: {
          9: {
            id: 9,
            type: 'users',
            firstName: 'Marie',
            lastName: 'Brizard',
            twitter: 'mb',
          },
        },
      },
    });
  });
});
