const { Encoder } = require('./encoder')

test('string encode', () => {
  expect(
    Encoder.encode('a b')
  ).toBe('a%20b')

  expect(
    Encoder.encode('a, b')
  ).toBe('a%2C%20b')

  expect(
    Encoder.encode('a; b')
  ).toBe('a%3B%20b')
})

test('string encode + decode', () => {
  expect(
    Encoder.decode(Encoder.encode('a b'))
  ).toBe('a b')

  expect(
    Encoder.decode(Encoder.encode('a, b'))
  ).toBe('a, b')

  expect(
    Encoder.decode(Encoder.encode('a; b'))
  ).toBe('a; b')
})
