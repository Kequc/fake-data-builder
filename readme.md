# fake-data-builder

Makes it easy to build and manage large generated datasets.

```
npm i -D fake-data-builder
```

# Usage

```javascript
import { build, sequence } from 'fake-data-builder';
import { faker } from '@faker-js/faker';

const buildUser = build<User>({
    id: sequence(),
    name: () => faker.name.findName(),
    job: () => faker.name.jobTitle()
});

const user: User = buildUser({
    name: 'Harry Hands'
});

// user ~= {
//     id: 1,
//     name: 'Harry Hands',
//     job: 'Global Accounts Engineer'
// }
```

This dataset can be as deeply nested as needed, all functions that are passed as values will be run. Any method can be used to generate values for fields. The `name` and `job` fields from this example are pointed at methods found in the [faker](https://www.npmjs.com/package/@faker-js/faker) npm library.

# Helpers

There are a small number of helpers included.

### # sequence()

Returns a number that is guaranteed to be unique, accepts a generator as a parameter for more control.

```javascript
const result = sequence(i => `user-${i}`)();

// result ~= 'user-1'
```

### # oneOf()

Returns one of the provided parameters at random.

```javascript
const result = oneOf('Larry', 'Curly', 'Moe')();

// result ~= 'Curly'
```

### # arrayOf()

Returns an array of the provided value a given number of times.

```javascript
const result = arrayOf(() => faker.color.rgb(), 4)();

// result ~= ['#1ECBE1', '#961EE1', '#E1341E', '#6AE11E']
```

# Considerations

A builder can be provided as the value for another builder.

```javascript
const buildAddress = build<Address>({
    id: sequence(),
    city: () => faker.address.city(),
    country: () => faker.address.country()
});

const buildManager = build<Manager>({
    id: sequence(),
    name: () => faker.name.findName(),
    address: () => buildAddress(),
    employees: arrayOf(() => buildUser(), 3)
});

const manager = buildManager();

// manager ~= {
//     id: 1,
//     name: 'Joann Osinski',
//     address: {
//         id: 1,
//         city: 'East Jarretmouth',
//         country: 'Greece'
//     },
//     employees: [
//         {
//             id: 1,
//             name: 'Marcella Huels',
//             job: 'Customer Intranet Developer'
//         }, {
//             id: 2,
//             name: 'Alfonso Beer',
//             job: 'Designer'
//         }, {
//             id: 3,
//             name: 'Kelvin Sporer',
//             job: 'Assistant'
//         }
//     ]
// }
```

Overrides can be nested, and contain any value that would be valid in the builder.

```javascript
const manager = buildManager({
    address: {
        country: 'Malta'
    }
});
```

Overriding an array replaces the array. If you need to change values inside of an array it is recommended to modify the result after it is returned.

```javascript
const manager = buildManager();

manager.employees[0].name = 'Samuel Mittensworth';
manager.employees[2] = buildUser({
    job: 'Executive Assistant'
});
```

It is possible to trigger an infinite loop if the data structure is recursive.

```javascript
const a = build({ b });
const b = build({ a });

a(); // triggers infinite loop
```

So don't do that.

# Random generators

If you don't want to use an external library and only need simple values there are some of those included as well.

### # randInt()

Generate a random integer. Can be given `min` `max` values, the defaults are `1` `10`.

```javascript
randInt({ min: 0, max: 5 })();
```

<sup>Integer between `0` and `5` (inclusive).</sup>

### # randFloat()

Generate a random float. Can be given `min` `max` values, the defaults are `0` `1`.

```javascript
randFloat({ min: 11, max: 22.5 })();
```

<sup>Float between `11` and `22.5` (inclusive).</sup>

### # randBoolean()

Generate either `true` or `false`.

```javascript
randBoolean()();
```

### # randDate()

Generate a random `Date` object. Can be given `timeAgo` `fromNow` values in ms, the defaults are `31557600000 * 2` (2 years) `0`.

```javascript
randDate({ timeAgo: 0, fromNow: 900000; })();
```

<sup>`Date` object between now and 15 minutes from now.</sup>

### # randString()

Generate a random string. Can be given `charset` `length` values, the defaults are `'ln'` (lowercase and numbers) `5`. Charset can include `'u'` to add uppercase and `'s'` for special characters. Can be given a `chars` value, the default is `''` these are added to the charset.

```javascript
randString({ charset: '', chars: 'abcde', length: 6 })();
```

<sup>String containing only `'abcde'` characters `6` characters long.</sup>

### # randWord()

Generate a random string from a word list. Can be given `capitalize` `uppercase`, the defaults are `false` `false`. Can be given `multiply` `separator`, the defaults are `1` `' '` these are how many words to generate and how to separate them.

```javascript
randWord({ capitalize: true })();
```

<sup>Capitalized word</sup>

### # randParagraph()

Generate a random string made up of many sentences. Can be given `sentencesMin` `sentencesMax`, the defaults are `5` `20` these are the number of sentences per paragraph. Can be given `wordsMin` `wordsMax`, the defaults are `5` `20` these are the number of words per sentence. Can be given `multiply` `separator`, the defaults are `1` `'\n\n'` these are how many paragraphs to generate and how to separate them.

```javascript
randSentence({ sentencesMin: 2, sentencesMax: 50, multiply: 2 })();
```

<sup>Two paragraphs of highly variable length.</sup>

# Conclusion

This library is being kept simple so that it might be versatile. Please request any features you would like to see added on Github.
