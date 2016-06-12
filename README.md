# normalize-json-api [![build status](https://img.shields.io/travis/prenaudin/normalize-json-api/master.svg?style=flat-square)](https://travis-ci.org/paularmstrong/normalizr) [![npm version](https://img.shields.io/npm/v/normalizr.svg?style=flat-square)](https://www.npmjs.com/package/normalize-json-api)

Normalizes JSON API responses according to a schema for [Flux](https://facebook.github.io/flux) and [Redux](http://rackt.github.io/redux) apps.
More on [JSON API](http://jsonapi.org/).
Thanks to [paularmstrong](https://github.com/paularmstrong) and [Dan Abramov](http://github.com/gaearon)
for building normalizr where the original idea of this library came from :)

## Installation

```
npm install --save normalize-json-api
```

## The Problem

* You have a JSON API sideloaded objects ;  
* You want to port your app to [Flux](https://github.com/facebook/flux) or [Redux](http://rackt.github.io/redux);
* You noticed [it's hard](https://groups.google.com/forum/#!topic/reactjs/jbh50-GJxpg) for Stores (or Reducers) to consume data from nested API responses.

normalize-json-api takes JSON API and

For example,

```javascript
{
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
}
```

can be normalized to

```javascript
{
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
}
```

## Features

TODO

## Usage

TODO

## Credits

normalize-json-api was inspired heavily by normalizr
