# fake-data-builder

Makes it easy to build and manage large generated datasets.

```
npm i -D fake-data-builder
```

# Usage

```javascript
import { build, sequence, randWord } from 'fake-data-builder';

const buildUser = build<User>({
    id: sequence(),
    name: randWord({ multiply: 2, capitalize: true }),
    job: randWord({ multiply: 3, capitalize: true })
});

const user: User = buildUser({
    name: 'Harry Hands'
});

// user ~= {
//     id: 1,
//     name: 'Harry Hands',
//     job: 'Ancient Usually Putting'
// }
```

This dataset can be deeply nested, all functions that are passed as values will be run. What follows are a set of generators and helpers that are included.

# Generators

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

Generate either `true` or `false`. Can be given a `median` value, this determines the likelihood of being true.

```javascript
randBoolean({ median: 0.6 })();
```

<sup>Will be `true` 60% of the time.</sup>

### # randDate()

Generate a random `Date` object. Can be given `timeAgo` `fromNow` values in ms, the defaults are `31557600000 * 2` (2 years) `0`.

```javascript
randDate({ timeAgo: 0, fromNow: 900000 })();
```

<sup>`Date` object between now and 15 minutes from now.</sup>

### # randString()

Generate a random string. Can be given `charset` `length` values, the defaults are `'ln'` (lowercase and numbers) `5`. Charset can include `'u'` to add uppercase and `'s'` for special characters. Can be given a `chars` value, the default is `''` these are added to the charset. Can be given `prefix` `postfix` values, the defaults are `''` `''`.

```javascript
randString({ charset: '', chars: 'abcde', length: 6 })();
```

<sup>String containing only `'abcde'` characters `6` characters long.</sup>

### # randWord()

Generate a random string from a word list. Can be given `capitalize` `uppercase`, the defaults are `false` `false`. Can be given `multiply` `separator`, the defaults are `1` `' '` these are how many words to generate and how to separate them. Can be given `prefix` `postfix` values, the defaults are `''` `''`.

```javascript
randWord({ capitalize: true })();
```

<sup>Capitalized word</sup>

### # randParagraph()

Generate a random string made up of many sentences. Can be given `sentencesMin` `sentencesMax`, the defaults are `5` `20` these are the number of sentences per paragraph. Can be given `wordsMin` `wordsMax`, the defaults are `5` `20` these are the number of words per sentence. Can be given `multiply` `separator`, the defaults are `1` `'\n\n'` these are how many paragraphs to generate and how to separate them.

```javascript
randParagraph({ sentencesMin: 2, sentencesMax: 50, multiply: 2 })();
```

<sup>Two paragraphs of highly variable length.</sup>

### # nullable()

Returns either null or the provided value.

```javascript
nullable(randInt(), 0.6)();
```

<sup>Will be an integer 60% of the time.</sup>

# Helpers

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
const rgb = randString({ charset: 'n', chars: 'ABCDEF', prefix: '#' });
const result = arrayOf(rgb, 4)();

// result ~= ['#1ECBE1', '#961EE1', '#E1341E', '#6AE11E']
```

# Considerations

A builder can be provided as the value for another builder.

```javascript
const buildAddress = build<Address>({
    id: sequence(),
    city: randWord({ capitalize: true }),
    country: randWord({ capitalize: true })
});

const buildManager = build<Manager>({
    id: sequence(),
    name: randWord({ multiply: 2, capitalize: true }),
    address: buildAddress,
    employees: arrayOf(buildUser, 3)
});

const manager = buildManager();

// manager ~= {
//     id: 1,
//     name: 'Bill Blanket',
//     address: {
//         id: 1,
//         city: 'Silk',
//         country: 'Yesterday'
//     },
//     employees: [
//         {
//             id: 1,
//             name: 'Newspaper Important',
//             job: 'Political Remember Hundred'
//         }, {
//             id: 2,
//             name: 'Lot Instance',
//             job: 'Scientific Shot Flower'
//         }, {
//             id: 3,
//             name: 'Heavy Upward',
//             job: 'Wonderful New Fence'
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

If you need to maintain the integrity of foreign keys it's easiest to iterate over the records you want associated.

```javascript
const profiles = users.map(user => buildProfile({
    userId: user.id
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

# Conclusion

This library is being kept simple so that it might be versatile. Please request any features you would like to see added on Github.
